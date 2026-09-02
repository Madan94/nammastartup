import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ExternalLink, MapPin, Scale, ShieldCheck, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";
import { startups } from "@/data/demo/startups";
import { parseSearchIntent, rankStartups } from "@/lib/domain/search";

const demoIntent = parseSearchIntent("Java Spring Boot PostgreSQL Redis Kafka backend developer with 2 years experience, strong learning and stability");

export default async function StartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const startup = startups.find(item => item.slug === slug);
  if (!startup) notFound();
  const fit = rankStartups([startup], demoIntent)[0];
  const chart = [42, 45, 47, 50, 54, 58, 61, 65, 69, 72, 76, 80];
  return <main className="company-page">
    <div className="company-breadcrumb"><Link href="/search"><ArrowLeft size={15} /> Back to matches</Link><span>Demo intelligence · Updated {startup.updatedAt}</span></div>
    <section className="company-hero">
      <div className="company-logo large" style={{ "--logo-accent": startup.accent } as React.CSSProperties}>{startup.monogram}</div>
      <div className="company-title"><div><span>{startup.sector}</span><span>{startup.stage}</span><span className="hiring-dot">Actively hiring</span></div><h1>{startup.name}</h1><p>{startup.tagline}</p><div className="company-meta"><span><MapPin size={14} />{startup.neighborhood}, Bengaluru</span><span><Building2 size={14} />{startup.employees} employees</span><span><CalendarDays size={14} />Data current Aug 2026</span></div></div>
      <div className="company-hero-actions"><button><Bookmark size={16} /> Save</button><button><Scale size={16} /> Compare</button></div>
    </section>
    <div className="company-layout">
      <div className="company-content">
        <section className="fit-spotlight">
          <div className="fit-ring" style={{ "--fit": `${fit.score * 3.6}deg` } as React.CSSProperties}><div><strong>{fit.score}</strong><span>fit score</span></div></div>
          <div><span className="kicker">Your profile × {startup.name}</span><h2>A strong reason to look closer.</h2><p>{fit.reason}</p><div className="skill-row">{fit.matchingSkills.map(skill => <span className="skill matched" key={skill}>✓ {skill}</span>)}</div></div>
        </section>
        <section className="content-section"><div className="section-title"><div><span className="kicker">Open opportunities</span><h2>Roles aligned with your profile</h2></div><span>{startup.jobs.length} open</span></div>
          <div className="job-list">{startup.jobs.map(job => <article key={job.id}><div className="job-icon"><BriefcaseBusiness size={18} /></div><div><h3>{job.title}</h3><p>{job.workMode} · {job.experience[0]}–{job.experience[1]} years · Posted {job.postedDaysAgo} days ago</p><div className="skill-row">{job.skills.map(skill => <span className="skill" key={skill}>{skill}</span>)}</div></div><button>View role <ExternalLink size={14} /></button></article>)}</div>
        </section>
        <section className="content-section"><div className="section-title"><div><span className="kicker">Employee growth</span><h2>A measured upward trajectory</h2></div><span className="positive"><TrendingUp size={14} /> +{startup.growth6m}% / 6m</span></div>
          <div className="growth-chart"><div className="chart-axis"><span>80</span><span>60</span><span>40</span></div><div className="bars">{chart.map((value, index) => <div key={index}><i style={{ height: `${value}%` }} /><span>{index % 2 === 0 ? ["Sep","Nov","Jan","Mar","May","Jul"][index/2] : ""}</span></div>)}</div></div>
          <p className="chart-summary">Employee count increased consistently in this synthetic demo series, with no single-month spike dominating the trend.</p>
        </section>
        <section className="content-section"><div className="section-title"><div><span className="kicker">Evidence ledger</span><h2>What shapes this outlook</h2></div></div>
          <div className="signal-list">{startup.signals.map((signal, index) => <div key={signal}><span className={index === 2 ? "caution" : "positive"}>{index === 2 ? <TriangleAlert size={16} /> : <CheckCircle2 size={16} />}</span><p>{signal}</p><small>StartupLens Demo Dataset</small></div>)}</div>
        </section>
      </div>
      <aside className="intelligence-rail">
        <section className="score-card"><div className="score-card-heading"><div><Sparkles size={16} /><b>Startup outlook</b></div><span>High confidence</span></div><h3>{startup.risk === "Low" ? "Positive" : "Moderately positive"}</h3><p>Observable company signals show useful momentum, balanced against a <b>{startup.risk.toLowerCase()} operational-risk signal</b>.</p><div className="score-bars">
          {([['Health', startup.healthScore], ['Stability', startup.stabilityScore], ['Learning', startup.learningScore], ['Growth', Math.min(100, 55 + startup.growth6m)]] as [string, number][]).map(([label, value]) => <div key={label}><span>{label}<b>{value}</b></span><i><em style={{ width: `${value}%` }} /></i></div>)}
        </div><small><ShieldCheck size={13} /> Based on observable demo signals. Not investment advice.</small></section>
        <section className="career-card"><span className="kicker">Possible career path</span><h3>Build depth without standing still.</h3><div className="career-path"><div><i>Now</i><b>Backend Engineer</b></div><span /><div><i>Next</i><b>Software Engineer II</b></div><span /><div><i>Potential</i><b>Senior Backend Engineer</b></div></div><p>Likely exposure: distributed systems, event streaming, database scaling, and observability.</p></section>
        <section className="about-card"><span className="kicker">About</span><p>{startup.description}</p><div>{startup.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></section>
      </aside>
    </div>
  </main>;
}
