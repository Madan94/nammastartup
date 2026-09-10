import {openStore} from '@/lib/server/platform';
import {schemaStatements} from '../../../db/migrations';
import {verifiedCompanies} from '@/data/chennai';
import type {Company,JobListing,NewsItem} from '@/lib/catalog/types';
let ready:Promise<void>|undefined;
export async function database(){const db=await openStore();if(!ready)ready=(async()=>{await db.batch(schemaStatements.map(sql=>({sql})));await db.batch(verifiedCompanies.map(c=>({sql:"INSERT INTO companies (slug,name,sector,area,kind,record,status,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET record=excluded.record WHERE companies.updated_at=excluded.updated_at AND companies.status='published'",params:[c.slug,c.name,c.sector,c.area,c.kind,JSON.stringify(c),'published',c.verifiedAt]})));})().catch(error=>{ready=undefined;throw error});await ready;return db;}
export async function listCompanies():Promise<Company[]>{const db=await database();return (await db.all<{record:string}>("SELECT record FROM companies WHERE status='published' ORDER BY name")).map(row=>JSON.parse(row.record));}
export async function getCompany(slug:string):Promise<Company|null>{const db=await database();const [row]=await db.all<{record:string}>("SELECT record FROM companies WHERE slug=? AND status='published'",[slug]);return row?JSON.parse(row.record):null;}
export async function listJobs():Promise<JobListing[]>{const db=await database();return(await db.all<{record:string}>("SELECT jobs.record FROM jobs JOIN companies ON companies.slug=jobs.company_slug WHERE active=1 AND companies.status='published' ORDER BY observed_at DESC")).map(row=>JSON.parse(row.record));}
export async function listNews():Promise<NewsItem[]>{const db=await database();return(await db.all<{record:string}>('SELECT record FROM news ORDER BY published_at DESC LIMIT 60')).map(row=>JSON.parse(row.record));}
export async function listSyncs(){const db=await database();return db.all<{source:string;attempted_at:string;success_at:string|null;error:string|null;item_count:number}>('SELECT * FROM sync_runs ORDER BY source');}
