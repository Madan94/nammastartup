import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { load } from 'cheerio';
import type { NewsItem } from '@/lib/catalog/types';
export const newsSources = [
  { id: 'eplane-news', url: 'https://www.eplane.ai/feed/', publisher: 'The ePlane Company' },
  { id: 'agnikul-news', url: 'https://agnikul.in/feed/', publisher: 'Agnikul Cosmos' },
] as const;
export function parseNewsFeed(
  xml: string,
  source: { id: string; url: string; publisher: string },
  observedAt: string,
): NewsItem[] {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true)
    throw new Error('Invalid feed');
  const doc = new XMLParser({ ignoreAttributes: false, processEntities: false }).parse(xml);
  if (!doc.rss?.channel) throw new Error('RSS channel not found');
  const raw = doc.rss.channel.item;
  const items = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
  const output: NewsItem[] = [];
  for (const item of items.slice(0, 30)) {
    if (typeof item.title !== 'string' || typeof item.link !== 'string') continue;
    let url: URL;
    try {
      url = new URL(item.link, source.url);
    } catch {
      continue;
    }
    if (url.protocol !== 'https:') continue;
    url.hash = '';
    const title = load(item.title).text().trim().slice(0, 250);
    if (!title || /^hello world/i.test(title)) continue;
    const stamp = Date.parse(item.pubDate);
    output.push({
      id: source.id + '|' + url.href,
      title,
      url: url.href,
      publisher: source.publisher,
      publishedAt: Number.isFinite(stamp) ? new Date(stamp).toISOString() : null,
      observedAt,
    });
  }
  return output;
}
