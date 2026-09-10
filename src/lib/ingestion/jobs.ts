import { load } from 'cheerio';
import type { JobListing } from '@/lib/catalog/types';
export const jobSources = [
  { id: 'agnikul-jobs', companySlug: 'agnikul-cosmos', url: 'https://agnikul.in/careers/' },
] as const;
export function parseAgnikulJobs(html: string, observedAt: string): JobListing[] {
  const $ = load(html);
  if (
    !$('h2')
      .toArray()
      .some((el) => $(el).text().trim() === 'Job Openings')
  )
    throw new Error('Careers layout changed; retained previous listings.');
  const jobs: JobListing[] = [];
  $('h2').each((_, el) => {
    const title = $(el).text().replace(/\s+/g, ' ').trim();
    if (!/Engineer|Developer|Strategist/i.test(title) || title.length > 150) return;
    const parent = $(el)
      .parents()
      .toArray()
      .find(
        (p) =>
          $(p)
            .find('h3')
            .toArray()
            .some((h) => /Chennai, India/i.test($(h).text())) && $(p).find('h2').length === 1,
      );
    if (!parent) return;
    const id = 'agnikul-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    jobs.push({
      id,
      companySlug: 'agnikul-cosmos',
      title,
      location: 'Chennai, India',
      url: 'https://agnikul.in/careers/',
      sourceUrl: 'https://agnikul.in/careers/',
      observedAt,
      active: true,
    });
  });
  if (!jobs.length)
    throw new Error('No identifiable job cards; review source before closing stored jobs.');
  return jobs;
}
