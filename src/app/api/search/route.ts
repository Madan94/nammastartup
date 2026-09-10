import {listCompanies,listJobs} from '@/lib/server/repository';
import {filterCompanies} from '@/lib/catalog/filters';
import {z} from 'zod';
export async function POST(request:Request){try{const {query}=z.object({query:z.string().trim().min(1).max(150)}).parse(await request.json());const companies=filterCompanies(await listCompanies(),{query,sector:'',area:'',kind:'',hiring:false},(await listJobs()).map(j=>j.companySlug));return Response.json({companies,count:companies.length,source:'verified-directory'});}catch{return Response.json({error:'Enter a search between 1 and 150 characters.'},{status:400})}}
