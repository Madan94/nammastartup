import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { randomBytes } from 'node:crypto';
const directory = mkdtempSync(join(tmpdir(), 'namma-http-'));
const key = randomBytes(32).toString('hex');
const worker = process.argv.includes('--worker');
const port = worker ? '3013' : '3012';
const base = 'http://localhost:' + port;
const cloudflareRequire = worker
  ? createRequire(realpathSync('node_modules/@cloudflare/vite-plugin/package.json'))
  : null;
const args = worker
  ? [
      join(dirname(cloudflareRequire.resolve('wrangler/package.json')), 'bin/wrangler.js'),
      'dev',
      '--local',
      '--config',
      'dist/server/wrangler.json',
      '--port',
      port,
      '--persist-to',
      directory,
      '--var',
      'ADMIN_ACCESS_KEY:' + key,
      '--var',
      'NEXT_PUBLIC_APP_URL:' + base,
    ]
  : ['node_modules/next/dist/bin/next', 'start', '--port', port];
const server = spawn(process.execPath, args, {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_PATH: join(directory, 'smoke.sqlite'),
    ADMIN_ACCESS_KEY: key,
    NEXT_PUBLIC_APP_URL: base,
    WRANGLER_SEND_METRICS: 'false',
    WRANGLER_WRITE_LOGS: 'false',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});
let logs = '';
server.stdout.on('data', (c) => (logs += c));
server.stderr.on('data', (c) => (logs += c));
let cookie = '';
let checks = 0;
async function get(path, status = 200) {
  const response = await fetch(base + path, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
    signal: AbortSignal.timeout(60000),
  });
  assert.equal(response.status, status, path);
  await response.clone().arrayBuffer();
  checks++;
  return response;
}
async function post(path, body, status = 200, origin = base) {
  const response = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, status, path + ' ' + (await response.clone().text()));
  checks++;
  return response;
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const r = await fetch(base + '/api/companies', { signal: AbortSignal.timeout(10000) });
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Server did not become healthy; see the bounded log excerpt below.');
  const catalog = await (await get('/api/companies')).json();
  assert.ok(catalog.count >= 8);
  const company = catalog.companies[0];
  const home = await (await get('/')).text();
  assert.match(home, /property="og:image" content="https?:[^" ]+\/og.png"/);
  for (const item of catalog.companies.slice(0, 2)) {
    const html = await (await get('/company/' + item.slug)).text();
    assert.ok(html.includes(item.name + ' | Chennai Startup Map'));
    assert.ok(html.includes('/company/' + item.slug));
  }
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
  const jobs = await (await get('/api/jobs')).json();
  const news = await (await get('/api/news')).json();
  assert.ok(Array.isArray(jobs.jobs) && jobs.count === jobs.jobs.length);
  assert.ok(Array.isArray(news.news) && news.count === news.news.length);
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
  const concurrentSubmission = { ...submission, website: 'https://concurrent-company.org' };
  const concurrent = await Promise.all(
    [0, 1].map(() =>
      fetch(base + '/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: base },
        body: JSON.stringify(concurrentSubmission),
      }),
    ),
  );
  assert.deepEqual(concurrent.map((response) => response.status).sort(), [201, 409]);
  checks += 2;
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
  await post(
    '/api/admin/review',
    {
      id: correction.id,
      action: 'approve',
      company,
      verified: true,
    },
    400,
  );
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
  console.log(
    JSON.stringify({
      runtime: worker ? 'Cloudflare Workers/D1' : 'Next/SQLite',
      checks,
      importedJobs: jobs.count,
      importedNews: news.count,
      passed: true,
      isolatedDatabase: directory,
    }),
  );
} catch (error) {
  writeFileSync(join(directory, 'server.log'), logs.replaceAll(key, '[test secret redacted]'));
  console.error(error);
  console.error(logs.slice(-4000).replaceAll(key, '[test secret redacted]'));
  process.exitCode = 1;
} finally {
  if (process.platform === 'win32' && server.pid) {
    spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], {
      windowsHide: true,
      stdio: 'ignore',
    });
  } else server.kill();
}
