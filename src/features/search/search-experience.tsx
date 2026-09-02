"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowUp, Bot, Check, ChevronDown, Map, MessageSquareText, RotateCcw, Sparkles } from "lucide-react";
import { StartupCard } from "@/components/startup-card";
import type { RankedStartup, SearchIntent } from "@/lib/domain/types";

const fallbackQuery = "I'm a Java backend developer with 2 years experience. Find 10 Bengaluru startups where I have the highest chance of getting hired. I prefer strong learning opportunities and reasonable stability.";

export function SearchExperience() {
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<RankedStartup[]>([]);
  const [intent, setIntent] = useState<SearchIntent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(value: string) {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults(data.results); setIntent(data.intent);
    } catch (err) { setError(err instanceof Error ? err.message : "Search is unavailable."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (!initial) return;
    const timer = window.setTimeout(() => void runSearch(initial), 0);
    return () => window.clearTimeout(timer);
    // The URL is the initial external search source; subsequent searches use the form.
  }, [initial]);
  const submit = (event: FormEvent) => { event.preventDefault(); void runSearch(query.trim() || fallbackQuery); };

  return <main className="search-page">
    <aside className="chat-rail">
      <div className="rail-heading"><div><MessageSquareText size={18} /><b>AI Search</b></div><button aria-label="New search" onClick={() => { setQuery(""); setResults([]); setIntent(null); }}><RotateCcw size={15} /></button></div>
      <div className="chat-thread">
        {!intent ? <div className="chat-welcome"><div className="bot-orb"><Sparkles size={21} /></div><h2>What matters in your next move?</h2><p>Describe your experience, ideal role, and what you value. I’ll turn it into an evidence-backed shortlist.</p>
          <div className="starter-prompts">
            {["Java backend roles with stability", "AI startups in HSR hiring freshers", "Where can I learn distributed systems?"].map(text => <button key={text} onClick={() => { setQuery(text); void runSearch(text); }}>{text}<ArrowUp size={14} /></button>)}
          </div>
        </div> : <>
          <div className="user-message">{query}</div>
          <div className="assistant-message"><div className="assistant-avatar"><Bot size={16} /></div><div><b>I translated that into a search strategy.</b><p>I’m prioritizing direct role alignment first, then adjusting for the career signals you care about.</p></div></div>
          <div className="intent-card">
            <div><span>Target role</span><b>{intent.role}</b></div>
            <div><span>Experience</span><b>{intent.yearsExperience ?? "Any"} years</b></div>
            <div className="intent-wide"><span>Skills detected</span><div>{intent.skills.length ? intent.skills.map(skill => <i key={skill}><Check size={11} />{skill}</i>) : <i>Profile defaults</i>}</div></div>
            <div className="intent-wide"><span>Priorities</span><div><i>Role fit</i>{intent.priorities.learning > .5 && <i>Learning</i>}{intent.priorities.stability > .5 && <i>Stability</i>}</div></div>
          </div>
          <div className="assistant-note"><span>Ranking complete</span><p>I found {results.length} companies with useful evidence. Fit scores measure alignment—not hiring probability.</p></div>
        </>}
      </div>
      <form className="rail-composer" onSubmit={submit}><textarea rows={2} value={query} onChange={event => setQuery(event.target.value)} placeholder="Refine your search..." aria-label="Natural language startup search"/><button><ArrowUp size={18} /></button><small><Sparkles size={11} /> AI-assisted · evidence grounded</small></form>
    </aside>

    <section className="results-panel">
      <div className="results-toolbar"><div><span className="kicker">Your opportunity set</span><h1>{intent ? `${results.length} startups worth a closer look` : "Your matches will appear here"}</h1></div><div className="toolbar-actions"><button><SlidersHorizontal size={15} /> Filters</button><button><Map size={15} /> Map</button></div></div>
      {intent && <div className="active-filters"><span>{intent.role}</span>{intent.skills.slice(0,4).map(skill => <span key={skill}>{skill}</span>)}<button>Best fit <ChevronDown size={13} /></button></div>}
      {loading && <div className="search-loading"><div className="scan-orb"><Sparkles size={20} /></div><b>Reading the signal...</b><span>Matching roles, skills, momentum, and preferences</span><div className="loading-line" /></div>}
      {error && <div className="error-state">{error}</div>}
      {!loading && !error && results.length > 0 && <div className="result-list">{results.map((item, index) => <StartupCard key={item.startup.id} item={item} rank={index + 1} />)}</div>}
      {!loading && !intent && <div className="results-empty"><div className="signal-rings"><span /><span /><Sparkles size={25} /></div><h3>Your shortlist starts with a conversation.</h3><p>Use the panel on the left to describe your next move in your own words.</p></div>}
    </section>
  </main>;
}
