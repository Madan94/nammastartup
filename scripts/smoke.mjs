import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
const directory = mkdtempSync(join(tmpdir(), 'namma-http-'));
const key = randomBytes(32).toString('hex');
const base = 'http://localhost:3012';
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--port', '3012'],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_PATH: join(directory, 'smoke.sqlite'),
      ADMIN_ACCESS_KEY: key,
      NEXT_PUBLIC_APP_URL: base,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  },
);
let logs = '';
server.stdout.on('data', (c) => (logs += c));
server.stderr.on('data', (c) => (logs += c));
let cookie = '';
let checks = 0;
async function get(path, status = 200) {
  const response = await fetch(base + path, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  assert.equal(response.status, status, path);
  checks++;
  return response;
}
async function post(path, body, status = 200, origin = base) {
  const response = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, status, path + ' ' + (await response.clone().text()));
  checks++;
  return response;
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const r = await fetch(base + '/api/companies');
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Server did not start: ' + logs);
  const catalog = await (await get('/api/companies')).json();
  assert.ok(catalog.count >= 8);
  const company = catalog.companies[0];
  for (const path of [
    '/',
    '/jobs',
    '/news',
    '/submit',
    '/about',
    '/privacy',
    '/correct',
    '/admin',
    '/company/' + company.slug,
    '/sitemap.xml',
    '/robots.txt',
  ])
    await get(path);
  await get('/company/does-not-exist', 404);
  await get('/search', 308);
  assert.equal((await (await get('/api/companies?q=no-match-unique')).json()).count, 0);
  await post('/api/admin/refresh', {}, 401);
  await post('/api/admin/manage', { action: 'hide', id: company.slug }, 401);
  await post('/api/submissions', {}, 400);
  await post('/api/submissions', {}, 403, 'https://untrusted.test');
  await post('/api/admin/login', { key: 'incorrect' }, 401);
  const login = await post('/api/admin/login', { key });
  cookie = login.headers.get('set-cookie').split(';')[0];
  assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(login.headers.get('set-cookie'), /SameSite=strict/i);
  const submission = {
    name: 'Integration Test Company',
    website: 'https://integration-company.org',
    description: 'Temporary record in an isolated test database.',
    sector: 'SaaS',
    area: 'Taramani',
    address: 'IIT Madras Research Park, Chennai 600113',
    email: 'integration@integration-company.org',
    careersUrl: '',
    consent: true,
  };
  const created = await (await post('/api/submissions', submission, 201)).json();
  await post('/api/submissions', submission, 409);
  assert.equal((await (await get('/api/companies?q=Integration+Test')).json()).count, 0);
  const record = {
    ...company,
    ...submission,
    slug: 'integration-test-company',
    kind: 'Startup',
    careersUrl: null,
    sourceUrl: submission.website,
    latitude: null,
    longitude: null,
    locationPrecision: 'unverified',
    verifiedAt: new Date().toISOString(),
  };
  await post(
    '/api/admin/review',
    { id: created.id, action: 'approve', company: record, verified: false },
    400,
  );
  await post('/api/admin/review', {
    id: created.id,
    action: 'approve',
    company: record,
    verified: true,
  });
  assert.equal((await (await get('/api/companies?q=Integration+Test')).json()).count, 1);
  await post(
    '/api/admin/review',
    { id: created.id, action: 'approve', company: record, verified: true },
    400,
  );
  const correction = await (
    await post(
      '/api/corrections',
      {
        companySlug: record.slug,
        email: submission.email,
        description: 'Change the test description after source review.',
        sourceUrl: record.sourceUrl,
        consent: true,
      },
      201,
    )
  ).json();
  await post('/api/admin/review', {
    id: correction.id,
    action: 'approve',
    company: { ...record, description: 'Updated description in the isolated test database.' },
    verified: true,
  });
  await post('/api/admin/manage', { id: record.slug, action: 'hide' });
  await get('/company/' + record.slug, 404);
  await post('/api/admin/manage', { id: record.slug, action: 'publish' });
  await get('/company/' + record.slug);
  await post('/api/admin/manage', { id: created.id, action: 'delete-submission' });
  await post('/api/admin/logout', {});
  cookie = '';
  await post('/api/admin/manage', { id: record.slug, action: 'hide' }, 401);
  console.log(JSON.stringify({ checks, passed: true, isolatedDatabase: directory }));
} catch (error) {
  console.error(error);
  console.error(logs.slice(-4000));
  process.exitCode = 1;
} finally {
  server.kill();
}
