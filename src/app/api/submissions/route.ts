import { database } from '@/lib/server/repository';
import { submissionSchema } from '@/lib/catalog/validation';
import { apiError, rateLimit, readJson, requireSameOrigin } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    const input = await readJson(request);
    requireSameOrigin(request);
    if (!(await rateLimit(request, 'submit')))
      return Response.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      );
    const data = submissionSchema.parse(input);
    const db = await database();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const inserted = await db.all(
      "INSERT INTO submissions (id,kind,name,website,email,payload,status,note,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM submissions WHERE website=? AND kind='company' AND status='pending') RETURNING id",
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
        data.website,
      ],
    );
    if (!inserted.length)
      return Response.json(
        { error: 'This website already has a submission awaiting review.' },
        { status: 409 },
      );
    return Response.json({ id, status: 'pending' }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
