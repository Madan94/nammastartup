import { cookies } from 'next/headers';
const cookieName = 'namma_admin';
function key() {
  const secret = process.env.ADMIN_ACCESS_KEY;
  if (!secret || secret.length < 32) throw new Error('Admin access is not configured');
  return secret;
}
async function signature(text: string) {
  const secret = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return Array.from(
    new Uint8Array(await crypto.subtle.sign('HMAC', secret, new TextEncoder().encode(text))),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
export async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all(
    [a, b].map((v) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(v))),
  );
  const left = new Uint8Array(x),
    right = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}
export async function loginAdmin(accessKey: string) {
  if (!(await safeEqual(accessKey, key()))) return false;
  const expires = String(Date.now() + 8 * 3600000);
  const token = expires + '.' + (await signature(expires));
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 3600,
  });
  return true;
}
export async function isAdmin() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return false;
    const [expires, sig, ...extra] = token.split('.');
    if (
      extra.length ||
      !sig ||
      !/^[0-9]{13}$/.test(expires) ||
      Number(expires) < Date.now() ||
      Number(expires) > Date.now() + 8 * 3600000
    )
      return false;
    return await safeEqual(sig, await signature(expires));
  } catch {
    return false;
  }
}
export async function logoutAdmin() {
  (await cookies()).delete(cookieName);
}
