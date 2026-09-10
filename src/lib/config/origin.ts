export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  return configured ? new URL(configured).origin : 'http://localhost:3000';
}
