import {fetchSource} from './fetch-source';
﻿import {newsSources,parseNewsFeed} from './news';
import {database} from '@/lib/server/repository';
import {recordSync} from './sync';
export async function refreshNews(){const db=await database();const reports=[];for(const source of newsSources){const at=new Date().toISOString();try{const html=await fetchSource(source.url);const items=parseNewsFeed(html,source,at);if(items.length)await db.batch(items.map(item=>({sql:'INSERT INTO news (id,record,published_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET record=excluded.record,published_at=excluded.published_at',params:[item.id,JSON.stringify(item),item.publishedAt||'']})));await recordSync(source.id,at,items.length,null);reports.push({source:source.id,ok:true,count:items.length});}catch(error){const message=error instanceof Error?error.message:'Feed unavailable';await recordSync(source.id,at,0,message);reports.push({source:source.id,ok:false,error:message});}}return reports;}
