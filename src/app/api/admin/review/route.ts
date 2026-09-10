import {isAdmin} from '@/lib/server/auth';
import {reviewSubmission} from '@/lib/server/moderation';
import {companySchema} from '@/lib/catalog/validation';
import {requireSameOrigin,readJson,apiError} from '@/lib/server/http';
import {z} from 'zod';
export async function POST(request:Request){try{requireSameOrigin(request);if(!await isAdmin())return Response.json({error:'Sign in as an administrator.'},{status:401});const body=z.object({id:z.string().uuid(),action:z.enum(['approve','reject']),note:z.string().max(1000).default(''),verified:z.boolean().optional(),company:z.unknown().optional()}).parse(await readJson(request));if(body.action==='approve'&&!body.verified)return Response.json({error:'Verify the official source before approving.'},{status:400});const company=body.action==='approve'?companySchema.parse({...body.company as object,verifiedAt:new Date().toISOString()}):undefined;return Response.json(await reviewSubmission(body.id,body.action,body.note,company));}catch(error){return apiError(error)}}
