import {logoutAdmin} from '@/lib/server/auth';
import {requireSameOrigin,apiError} from '@/lib/server/http';
export async function POST(request:Request){try{requireSameOrigin(request);await logoutAdmin();return Response.json({ok:true})}catch(error){return apiError(error)}}
