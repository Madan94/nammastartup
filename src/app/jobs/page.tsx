import { refreshIfDue } from '@/lib/ingestion/refresh';
import { Freshness } from '@/components/catalog/freshness';
import { listJobs, listCompanies } from '@/lib/server/repository';
import { JobsList } from '@/features/jobs/jobs-list';
export const dynamic = 'force-dynamic';
export default async function JobsPage() {
  await refreshIfDue('jobs');
  const [jobs, companies] = await Promise.all([listJobs(), listCompanies()]);
  return (
    <main id="main-content" className="page-wrap">
      <span className="eyebrow">Your next chapter, in Chennai</span>
      <h1>Build something that matters.</h1>
      <p className="lead">
        Explore roles listed on official company careers pages. Apply directly with the company.
        Availability can change after our last check.
      </p>
      <JobsList jobs={jobs} companies={companies} />
      <Freshness category="jobs" />
    </main>
  );
}
