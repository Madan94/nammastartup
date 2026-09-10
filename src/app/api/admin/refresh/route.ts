import { isAdmin } from '@/lib/server/auth';
import { refreshIfDue } from '@/lib/ingestion/refresh';
import { requireSameOrigin, readJson, apiError } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    await readJson(request);
    requireSameOrigin(request);
    if (!(await isAdmin()))
      return Response.json({ error: 'Administrator access required.' }, { status: 401 });
    const [jobs, news] = await Promise.all([
      refreshIfDue('jobs', true),
      refreshIfDue('news', true),
    ]);
    return Response.json({ jobs, news });
  } catch (error) {
    return apiError(error);
  }
}
