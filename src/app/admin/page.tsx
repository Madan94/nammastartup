import { isAdmin } from '@/lib/server/auth';
import { listSubmissions } from '@/lib/server/moderation';
import { database, listCompanies, listJobs, listSyncs, getCompany } from '@/lib/server/repository';
import {
  AdminLogin,
  AdminActions,
  ReviewCard,
  ManageRecord,
} from '@/features/admin/admin-workspace';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Administration | Chennai Startup Map',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  if (!(await isAdmin()))
    return (
      <main id="main-content" className="page-wrap narrow-page">
        <span className="eyebrow">Directory administration</span>
        <h1>Welcome back.</h1>
        <p className="lead">
          Sign in to review submissions and keep Chennai’s directory up to date.
        </p>
        <AdminLogin />
      </main>
    );
  const [submissions, companies, jobs, sources] = await Promise.all([
    listSubmissions(),
    listCompanies(),
    listJobs(),
    listSyncs(),
  ]);
  return (
    <main id="main-content" className="page-wrap">
      <span className="eyebrow">Directory administration</span>
      <h1>Keep the map moving.</h1>
      <p className="lead">
        {companies.length} published companies · {jobs.length} listed jobs ·{' '}
        {submissions.filter((s) => s.status === 'pending').length} pending reviews
      </p>
      <AdminActions />
      <section className="admin-sources">
        <h2>Source health</h2>
        {sources
          .filter((s) => !s.source.startsWith('_'))
          .map((s) => (
            <div key={s.source}>
              <b>{s.source}</b>
              <span>{s.error || s.item_count + ' records at last successful check'}</span>
              <small>{s.success_at || 'No successful check'}</small>
            </div>
          ))}
      </section>
      <section className="admin-sources">
        <h2>Published and hidden companies</h2>
        {(
          await (
            await database()
          ).all<{ slug: string; name: string; status: string }>(
            'SELECT slug,name,status FROM companies ORDER BY name',
          )
        ).map((c) => (
          <div key={c.slug}>
            <b>{c.name}</b>
            <span>{c.status}</span>
            <ManageRecord
              id={c.slug}
              action={c.status === 'published' ? 'hide' : 'publish'}
              label={c.status === 'published' ? 'Hide listing' : 'Publish listing'}
            />
          </div>
        ))}
      </section>
      <h2>Submissions & corrections</h2>
      {!submissions.length && <div className="empty-state">No submissions to review yet.</div>}
      {await Promise.all(
        submissions.map(async (s) => (
          <ReviewCard
            key={s.id}
            submission={s}
            existing={
              s.kind === 'correction' ? await getCompany(JSON.parse(s.payload).companySlug) : null
            }
          />
        )),
      )}
    </main>
  );
}
