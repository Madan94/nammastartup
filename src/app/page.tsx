import Link from 'next/link';
import {Suspense} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {verifiedCompanies} from '@/data/chennai';
import {Directory} from '@/features/directory/directory';
export default function DiscoverPage(){return <main id="main-content" className="directory-shell"><div className="directory-intro"><div><span className="eyebrow">Built in Chennai. Building for the world.</span><h1>A city full of possibilities.</h1><p>Meet the companies shaping Chennai. Find the people, places, and opportunities around you.</p></div><span className="city-stamp">சென்னை<br/><b>13.08° N · 80.27° E</b></span></div><Suspense fallback={<p>Loading directory…</p>}><Directory companies={verifiedCompanies}/></Suspense><div className="contribute-banner"><div><h2>Your city. Your ecosystem.</h2><p>Every company starts somewhere. Help put Chennai on the map.</p></div><Link href="/submit">Add a company <ArrowUpRight size={18}/></Link></div></main>}
