import { database } from '@/lib/server/repository';
import { submissionSchema } from '@/lib/catalog/validation';
import { apiError, rateLimit, readJson, requireSameOrigin } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    if (!(await rateLimit(request, 'submit')))
      return Response.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      );
    const data = submissionSchema.parse(await readJson(request));
    const db = await database();
    const existing = await db.all(
      "SELECT id FROM submissions WHERE website=? AND kind='company' AND status='pending'",
      [data.website],
    );
    if (existing.length)
      return Response.json(
        { error: 'This website already has a submission awaiting review.' },
        { status: 409 },
      );
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.run(
      'INSERT INTO submissions (id,kind,name,website,email,payload,status,note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        id,
        'company',
        data.name,
        data.website,
        data.email,
        JSON.stringify(data),
        'pending',
        '',
        now,
        now,
      ],
    );
    return Response.json({ id, status: 'pending' }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
