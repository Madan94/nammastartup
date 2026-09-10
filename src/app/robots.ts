import type {MetadataRoute} from 'next';
import {siteOrigin} from '@/lib/config/origin';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/','/correct']},sitemap:siteOrigin()+'/sitemap.xml'};}
