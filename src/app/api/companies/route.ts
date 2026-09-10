import {listCompanies,listJobs} from '@/lib/server/repository';
import {filterCompanies,parseFilters} from '@/lib/catalog/filters';
export const dynamic='force-dynamic';
export async function GET(request:Request){const [companies,jobs]=await Promise.all([listCompanies(),listJobs()]);const results=filterCompanies(companies,parseFilters(new URL(request.url).searchParams),jobs.map(j=>j.companySlug));return Response.json({companies:results,count:results.length},{headers:{'Cache-Control':'no-store'}})}
