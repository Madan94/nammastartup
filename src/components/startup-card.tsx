import Link from "next/link";
import { ArrowUpRight, Bookmark, BriefcaseBusiness, MapPin, TrendingUp } from "lucide-react";
import type { RankedStartup, Startup } from "@/lib/domain/types";

export function StartupCard({ item, rank }: { item: RankedStartup; rank: number }) {
  const { startup, score, bestJob, matchingSkills, missingSkills, reason } = item;
  return (
    <article className="startup-card">
      <div className="card-rank">{String(rank).padStart(2, "0")}</div>
      <div className="company-logo" style={{ "--logo-accent": startup.accent } as React.CSSProperties}>{startup.monogram}</div>
      <div className="card-main">
        <div className="company-heading">
          <div><h3>{startup.name}</h3><p>{startup.sector} · {startup.stage}</p></div>
          <div className="fit-score"><strong>{score}</strong><span>FIT</span></div>
        </div>
        <div className="company-meta">
          <span><MapPin size={13} />{startup.neighborhood}</span>
          <span><BriefcaseBusiness size={13} />{startup.jobs.length} open {startup.jobs.length === 1 ? "role" : "roles"}</span>
          <span><TrendingUp size={13} />{startup.hiringMomentum} hiring</span>
        </div>
        {bestJob && <div className="best-role"><span>Best role</span><b>{bestJob.title}</b><small>{bestJob.workMode} · {bestJob.experience[0]}–{bestJob.experience[1]} yrs</small></div>}
        <div className="skill-row">
          {matchingSkills.slice(0, 4).map((skill) => <span className="skill matched" key={skill}>✓ {skill}</span>)}
          {missingSkills.slice(0, 2).map((skill) => <span className="skill missing" key={skill}>+ {skill}</span>)}
        </div>
        <p className="match-reason">{reason}</p>
        <div className="card-footer">
          <div><span className="metric"><i style={{ width: `${startup.healthScore}%` }} />Health {startup.healthScore}</span><span className={`risk ${startup.risk.toLowerCase()}`}>{startup.risk} risk</span></div>
          <div className="card-actions"><button aria-label={`Save ${startup.name}`}><Bookmark size={16} /></button><Link href={`/startups/${startup.slug}`}>View company <ArrowUpRight size={15} /></Link></div>
        </div>
      </div>
    </article>
  );
}

export function MiniStartupCard({ startup }: { startup: Startup }) {
  return <Link href={`/startups/${startup.slug}`} className="mini-startup-card">
    <div className="company-logo small" style={{ "--logo-accent": startup.accent } as React.CSSProperties}>{startup.monogram}</div>
    <div><strong>{startup.name}</strong><span>{startup.sector} · {startup.neighborhood}</span></div>
    <div className="health-mini"><b>{startup.healthScore}</b><small>health</small></div>
  </Link>;
}
