import {listNews} from '@/lib/server/repository';
export const dynamic='force-dynamic';
export async function GET(){const news=await listNews();return Response.json({news,count:news.length},{headers:{'Cache-Control':'no-store'}})}
