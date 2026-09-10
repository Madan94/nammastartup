import { logoutAdmin } from '@/lib/server/auth';
import { requireSameOrigin, readJson, apiError } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    await readJson(request);
    requireSameOrigin(request);
    await logoutAdmin();
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
