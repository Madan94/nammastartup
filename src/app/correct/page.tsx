import {listCompanies} from '@/lib/server/repository';
import {CorrectionForm} from '@/features/submissions/correction-form';
export const dynamic='force-dynamic';
export default async function CorrectPage({searchParams}:{searchParams:Promise<{company?:string}>}){const params=await searchParams;return <main id="main-content" className="page-wrap narrow-page"><span className="eyebrow">Keep the directory useful</span><h1>Something changed?</h1><p className="lead">Report an outdated address, incorrect detail, closed company, or removal request. An administrator will review the evidence before changing the directory.</p><CorrectionForm companies={await listCompanies()} selected={params.company||''}/></main>}
