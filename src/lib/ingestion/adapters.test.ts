import { describe, it, expect } from 'vitest';
import { parseAgnikulJobs } from './jobs';
import { parseNewsFeed } from './news';
import { robotsAllows, limitedText } from './fetch-source';
const source = {
  id: 'source',
  url: 'https://www.eplane.ai/feed/',
  publisher: 'The ePlane Company',
};
describe('source adapters', () => {
  it('reads only identified Chennai job cards', () => {
    const html =
      '<h2>Job Openings</h2><section><h2>Software Engineer</h2><h3>Chennai, India</h3></section><section><h2>Software Engineer Other</h2><h3>Delhi, India</h3></section>';
    const jobs = parseAgnikulJobs(html, '2026-09-10T00:00:00Z');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].location).toBe('Chennai, India');
  });
  it('refuses to retire jobs on an unrecognized layout', () => {
    expect(() => parseAgnikulJobs('<h2>Unavailable</h2>', '')).toThrow();
    expect(() => parseAgnikulJobs('<h2>Job Openings</h2>', '')).toThrow();
  });
  it('keeps publisher dates instead of inventing freshness', () => {
    const xml =
      '<rss><channel><item><title>Company update</title><link>/news/update</link><pubDate>Mon, 13 Oct 2025 23:16:06 +0000</pubDate></item></channel></rss>';
    const [item] = parseNewsFeed(xml, source, '2026-09-10T00:00:00Z');
    expect(item.publishedAt).toBe('2025-10-13T23:16:06.000Z');
    expect(item.url).toBe('https://www.eplane.ai/news/update');
  });
  it('rejects unsafe XML entities and active links', () => {
    expect(() => parseNewsFeed('<!DOCTYPE foo><rss/>', source, '')).toThrow();
    expect(
      parseNewsFeed(
        '<rss><channel><item><title>Test</title><link>javascript:alert(1)</link></item></channel></rss>',
        source,
        '',
      ),
    ).toHaveLength(0);
  });
  it('respects robots path rules', () => {
    expect(robotsAllows('User-agent: *\nDisallow: /private/', '/private/records')).toBe(false);
    expect(
      robotsAllows('User-agent: *\nDisallow: /private/\nAllow: /private/public', '/private/public'),
    ).toBe(true);
    expect(robotsAllows('User-agent: *\nDisallow: /wp-admin/', '/careers/')).toBe(true);
  });
  it('rejects oversized streamed responses', async () => {
    await expect(limitedText(new Response('abcdef'), 3)).rejects.toThrow('size limit');
  });
});
