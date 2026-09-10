import {refreshIfDue} from '@/lib/ingestion/refresh';
﻿import {listNews} from '@/lib/server/repository';
export const dynamic='force-dynamic';
export async function GET(){await refreshIfDue('news');const news=await listNews();return Response.json({news,count:news.length},{headers:{'Cache-Control':'no-store'}})}
