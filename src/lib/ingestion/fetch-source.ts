const allowedSources = new Set([
  'https://agnikul.in/careers/',
  'https://agnikul.in/feed/',
  'https://www.eplane.ai/feed/',
]);
const agent = 'NammaStartupDirectory/1.0 (+https://github.com/Madan94/nammastartup)';
export async function limitedText(response: Response, maxBytes = 2_000_000) {
  if (Number(response.headers.get('content-length') || 0) > maxBytes)
    throw new Error('Source response exceeds size limit');
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error('Source response exceeds size limit');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const joined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(joined);
}
export function robotsAllows(robots: string, path: string) {
  const rules = robots
    .split('\n')
    .map((line) => line.split('#')[0].trim())
    .filter(Boolean);
  let agentApplies = true;
  let bestLength = -1,
    allowed = true;
  for (const line of rules) {
    const split = line.indexOf(':');
    if (split < 0) continue;
    const key = line.slice(0, split).trim().toLowerCase(),
      value = line.slice(split + 1).trim();
    if (key === 'user-agent') {
      agentApplies = value === '*' || agent.toLowerCase().startsWith(value.toLowerCase());
      continue;
    }
    if (!agentApplies || !value || !['allow', 'disallow'].includes(key)) continue;
    const pattern = value.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    if (new RegExp('^' + pattern).test(path) && value.length >= bestLength) {
      if (value.length > bestLength || key === 'allow') allowed = key === 'allow';
      bestLength = value.length;
    }
  }
  return allowed;
}
export async function fetchSource(url: string) {
  if (!allowedSources.has(url)) throw new Error('Source is not configured');
  const origin = new URL(url).origin;
  const robots = await fetch(origin + '/robots.txt', {
    headers: { 'User-Agent': agent },
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  if (robots.status !== 404) {
    if (!robots.ok) throw new Error('Unable to verify source access policy');
    const policy = await limitedText(robots, 100000);
    if (!robotsAllows(policy, new URL(url).pathname))
      throw new Error('Source disallows automated access');
    const delay = Number(policy.match(/crawl-delay:\s*([\d.]+)/i)?.[1] || 0);
    if (!Number.isFinite(delay) || delay > 20)
      throw new Error('Source requires a slower crawl; automatic refresh deferred');
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }
  const response = await fetch(url, {
    headers: { 'User-Agent': agent },
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Source returned HTTP ' + response.status);
  return limitedText(response);
}
