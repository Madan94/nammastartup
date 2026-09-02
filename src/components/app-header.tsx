"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, BriefcaseBusiness, ChartNoAxesCombined, Compass, Menu, Search, Sparkles, UserRound } from "lucide-react";
import { productConfig } from "@/lib/config/product";

const links = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/search", label: "AI Search", icon: Search },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/compare", label: "Compare", icon: ChartNoAxesCombined },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header className="app-header">
      <Link href="/" className="brand" aria-label={`${productConfig.name} home`}>
        <span className="brand-mark"><Sparkles size={17} strokeWidth={2.4} /></span>
        <span>{productConfig.shortName}<b>AI</b></span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={15} />{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <span className="demo-pill"><span /> Demo data</span>
        <Link href="/profile" className="profile-button"><UserRound size={16} /><span>Arjun</span></Link>
        <button className="mobile-menu" aria-label="Open menu"><Menu size={20} /></button>
      </div>
    </header>
  );
}
