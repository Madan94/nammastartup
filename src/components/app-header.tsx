"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, MapPin, Menu, X } from "lucide-react";

export function AppHeader() {
 const path=usePathname(); const [open,setOpen]=useState(false);
 return <header className="site-header"><Link href="/" className="site-brand" aria-label="Chennai Startup Map home"><span className="site-brand-icon"><MapPin size={21}/></span><span>Namma Startup<small>CHENNAI STARTUP MAP</small></span></Link><button className="nav-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'site-nav is-open':'site-nav'} aria-label="Primary navigation">{[['/','Explore'],['/jobs','Find a job'],['/news','City pulse'],['/about','About']].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/submit" className="submit-link" onClick={()=>setOpen(false)}>Add your company <ArrowUpRight size={16}/></Link></nav></header>;
}
