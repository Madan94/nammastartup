import { sourceFreshness } from '@/lib/server/repository';
export async function Freshness({ category }: { category: 'jobs' | 'news' }) {
  const { latest, stale, failed } = await sourceFreshness(category);
  return (
    <p className="freshness" role="status">
      {latest
        ? 'Last source check: ' +
          new Date(latest).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) +
          ' IST.'
        : 'Awaiting the first successful source check.'}{' '}
      {failed
        ? 'Some sources could not be refreshed. Previously checked records are retained.'
        : stale
          ? 'Some source records are more than two days old.'
          : 'Sources refresh periodically when this page is visited.'}
    </p>
  );
}
