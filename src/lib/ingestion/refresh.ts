import {database} from '@/lib/server/repository';
import {refreshJobs} from './sync';
import {refreshNews} from './news-sync';
export async function refreshIfDue(category:'jobs'|'news',force=false){
 const db=await database();const now=new Date().toISOString();const threshold=new Date(Date.now()-(force?60*1000:6*60*60*1000)).toISOString();
 const lease=await db.all<{source:string}>("INSERT INTO sync_runs (source,attempted_at,item_count) VALUES (?,?,0) ON CONFLICT(source) DO UPDATE SET attempted_at=excluded.attempted_at WHERE sync_runs.attempted_at<? RETURNING source",['_refresh_'+category,now,threshold]);
 if(!lease.length)return {skipped:true};return category==='jobs'?refreshJobs():refreshNews();
}
