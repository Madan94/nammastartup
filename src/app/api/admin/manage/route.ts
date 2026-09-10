import { isAdmin } from '@/lib/server/auth';
import { database } from '@/lib/server/repository';
import { requireSameOrigin, readJson, apiError } from '@/lib/server/http';
import { z } from 'zod';
export async function POST(request: Request) {
  try {
    const input = await readJson(request);
    requireSameOrigin(request);
    if (!(await isAdmin()))
      return Response.json({ error: 'Administrator access required.' }, { status: 401 });
    const data = z
      .object({
        action: z.enum(['hide', 'publish', 'delete-submission']),
        id: z.string().min(1).max(150),
      })
      .parse(input);
    const db = await database();
    const statement =
      data.action === 'delete-submission'
        ? { sql: 'DELETE FROM submissions WHERE id=?', params: [data.id] }
        : {
            sql: 'UPDATE companies SET status=?,updated_at=? WHERE slug=?',
            params: [
              data.action === 'hide' ? 'hidden' : 'published',
              new Date().toISOString(),
              data.id,
            ],
          };
    await db.batch([
      statement,
      {
        sql: 'INSERT INTO audit (id,action,record_id,created_at) VALUES (?,?,?,?)',
        params: [crypto.randomUUID(), data.action, data.id, new Date().toISOString()],
      },
    ]);
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
