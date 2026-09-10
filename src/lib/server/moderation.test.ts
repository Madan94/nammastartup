import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { database, getCompany, listCompanies } from './repository';
import { reviewSubmission } from './moderation';
import { verifiedCompanies } from '@/data/chennai';
process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'namma-test-')), 'test.sqlite');
describe('persistent review workflow', () => {
  beforeAll(async () => {
    await database();
  });
  it('loads sourced companies', async () => {
    expect((await listCompanies()).length).toBe(verifiedCompanies.length);
  });
  it('requires approval before publication and rejects repeat review', async () => {
    const db = await database();
    const id = crypto.randomUUID(),
      now = new Date().toISOString();
    await db.run(
      'INSERT INTO submissions (id,kind,name,website,email,payload,status,note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        id,
        'company',
        'Test only',
        'https://test-company.org',
        'private@test-company.org',
        '{}',
        'pending',
        '',
        now,
        now,
      ],
    );
    const company = { ...verifiedCompanies[0], slug: 'test-only-company', name: 'Test only' };
    expect(await getCompany(company.slug)).toBeNull();
    await reviewSubmission(id, 'approve', 'Verified in test', company);
    expect((await getCompany(company.slug))?.name).toBe('Test only');
    await expect(reviewSubmission(id, 'approve', '', company)).rejects.toThrow('ALREADY_REVIEWED');
    await db.run('UPDATE companies SET status=? WHERE slug=?', ['hidden', company.slug]);
    expect(await getCompany(company.slug)).toBeNull();
  });
  it('rolls back an entire failed batch', async () => {
    const db = await database();
    const id = crypto.randomUUID();
    await expect(
      db.batch([
        {
          sql: 'INSERT INTO audit(id,action,record_id,created_at) VALUES (?,?,?,?)',
          params: [id, 'test', 'test', new Date().toISOString()],
        },
        { sql: 'INSERT INTO table_that_does_not_exist VALUES (1)' },
      ]),
    ).rejects.toThrow();
    expect(await db.all('SELECT id FROM audit WHERE id=?', [id])).toHaveLength(0);
  });
  it('limits a correction to its original company', async () => {
    const db = await database();
    const id = crypto.randomUUID(),
      now = new Date().toISOString();
    const original = verifiedCompanies[0];
    await db.run(
      'INSERT INTO submissions(id,kind,name,website,email,payload,status,note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        id,
        'correction',
        original.name,
        original.website,
        'test@example.org',
        JSON.stringify({ companySlug: original.slug }),
        'pending',
        '',
        now,
        now,
      ],
    );
    await expect(reviewSubmission(id, 'approve', '', verifiedCompanies[1])).rejects.toThrow(
      'CORRECTION_TARGET',
    );
    expect(
      (await db.all<{ status: string }>('SELECT status FROM submissions WHERE id=?', [id]))[0]
        .status,
    ).toBe('pending');
    await reviewSubmission(id, 'approve', '', {
      ...original,
      description: 'Description updated in an isolated test.',
    });
    expect((await getCompany(original.slug))?.description).toBe(
      'Description updated in an isolated test.',
    );
  });
  it('records only one decision when reviews race', async () => {
    const db = await database();
    const id = crypto.randomUUID(),
      now = new Date().toISOString();
    await db.run(
      'INSERT INTO submissions(id,kind,name,website,email,payload,status,note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        id,
        'company',
        'Race test',
        'https://race.example.org',
        'test@example.org',
        '{}',
        'pending',
        '',
        now,
        now,
      ],
    );
    const results = await Promise.allSettled([
      reviewSubmission(id, 'reject', 'First'),
      reviewSubmission(id, 'reject', 'Second'),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(await db.all('SELECT id FROM audit WHERE record_id=?', [id])).toHaveLength(1);
  });
});
