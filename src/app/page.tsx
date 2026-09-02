import Link from "next/link";
import { ArrowRight, Building2, MapPin, Radar, Sparkles, TrendingUp } from "lucide-react";
import { SearchComposer } from "@/components/search-composer";
import { MiniStartupCard } from "@/components/startup-card";
import { startups } from "@/data/demo/startups";

const neighborhoods = [
  { name: "HSR Layout", x: 46, y: 66 }, { name: "Koramangala", x: 34, y: 52 },
  { name: "Indiranagar", x: 54, y: 40 }, { name: "Whitefield", x: 77, y: 38 },
  { name: "Bellandur", x: 61, y: 62 }, { name: "Jayanagar", x: 27, y: 70 },
];

export default function DiscoverPage() {
  return <main>
    <section className="hero-section">
      <div className="hero-glow" />
      <div className="eyebrow"><span><Radar size={14} /></span> Bengaluru startup intelligence</div>
      <h1>Find the startup<br />that fits your <em>future.</em></h1>
      <p className="hero-copy">Discover matching roles, understand company momentum, and compare opportunities—with evidence, not hype.</p>
      <SearchComposer />
      <div className="prompt-suggestions">
        <span>Try asking</span>
        <Link href="/search?q=Java%20backend%20roles%20at%20growth-stage%20startups">Java backend at growth-stage startups</Link>
        <Link href="/search?q=Stable%20Series%20B%20startups%20with%20backend%20openings">Stable Series B companies</Link>
      </div>
      <div className="hero-stats">
        <div><strong>40+</strong><span>curated startups</span></div>
        <div><strong>100+</strong><span>active demo roles</span></div>
        <div><strong>8</strong><span>evidence signals</span></div>
        <div><strong>1</strong><span>clear decision</span></div>
      </div>
    </section>

    <section className="discover-section">
      <div className="section-heading"><div><span className="kicker">Explore the ecosystem</span><h2>Bengaluru, through a career lens.</h2></div><Link href="/search">See all startups <ArrowRight size={16} /></Link></div>
      <div className="map-layout">
        <div className="startup-list-panel">
          <div className="panel-title"><div><Building2 size={17} /><b>Strong signals today</b></div><span>Updated Sep 2</span></div>
          {startups.slice(0, 5).map((startup) => <MiniStartupCard key={startup.id} startup={startup} />)}
        </div>
        <div className="abstract-map" aria-label="Stylized map showing Bengaluru startup neighborhoods">
          <div className="map-grid" />
          <div className="map-road r1" /><div className="map-road r2" /><div className="map-road r3" />
          {neighborhoods.map((point, index) => <div className="map-point" style={{ left: `${point.x}%`, top: `${point.y}%` }} key={point.name}>
            <span className={index < 2 ? "hot" : ""}><MapPin size={15} /></span><b>{point.name}</b><small>{index === 0 ? 8 : index === 1 ? 7 : index + 2} startups</small>
          </div>)}
          <div className="map-card"><Sparkles size={18} /><div><b>Opportunity pulse</b><span>Backend hiring is strongest around HSR and Koramangala this week.</span></div></div>
          <div className="map-legend"><span><i className="strong" /> Strong fit</span><span><i /> Active cluster</span></div>
        </div>
      </div>
    </section>

    <section className="signal-strip">
      <div><TrendingUp size={22} /><span>Signal, not noise</span></div>
      <p>Every recommendation combines role alignment, skill fit, hiring momentum, learning potential, stability, and location—then shows you exactly why it ranked.</p>
      <Link href="/search">Ask StartupLens <ArrowRight size={16} /></Link>
    </section>
  </main>;
}
