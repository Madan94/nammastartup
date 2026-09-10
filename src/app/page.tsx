import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { verifiedCompanies } from "@/data/chennai";
import "./directory.css";

export default function DiscoverPage() {
  return <main className="directory-shell">
    <div className="directory-intro"><div><span className="eyebrow">Built in Chennai. Building for the world.</span><h1>A city full of possibilities.</h1><p>Meet the companies shaping Chennai. Find the people, places, and opportunities around you.</p></div><span className="city-stamp">சென்னை<br/><b>13.08° N · 80.27° E</b></span></div>
    <div className="directory-heading"><h2>{verifiedCompanies.length} companies to discover</h2><span>Chennai & its startup corridor</span></div>
    <div className="directory-grid">{verifiedCompanies.map(company => <article className="directory-card" key={company.slug}><span className="company-initial">{company.name.slice(0,2).toUpperCase()}</span><span className="sector-badge">{company.sector}</span><h2>{company.name}</h2><p>{company.description}</p><div className="directory-card-bottom"><span><MapPin size={14}/>{company.area}</span><a href={company.website} target="_blank" rel="noreferrer">Website <ArrowUpRight size={15}/></a></div></article>)}</div>
    <div className="contribute-banner"><div><h2>Your city. Your ecosystem.</h2><p>Every company starts somewhere. Help put Chennai on the map.</p></div><Link href="/submit">Add a company <ArrowUpRight size={18}/></Link></div>
  </main>;
}
