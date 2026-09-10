import { loginAdmin } from '@/lib/server/auth';
import { apiError, rateLimit, readJson, requireSameOrigin } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    requireSameOrigin(request);
    if (!(await rateLimit(request, 'login', 10)))
      return Response.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    if (typeof body.key !== 'string' || body.key.length > 200 || !(await loginAdmin(body.key)))
      return Response.json({ error: 'Invalid access key.' }, { status: 401 });
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
