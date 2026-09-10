import type {MetadataRoute} from 'next';
import {listCompanies} from '@/lib/server/repository';
import {siteOrigin} from '@/lib/config/origin';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const origin=siteOrigin();return [...['','/jobs','/news','/about','/submit'].map(path=>({url:origin+path})),...(await listCompanies()).map(c=>({url:origin+'/company/'+c.slug,lastModified:new Date(c.verifiedAt)}))];}
