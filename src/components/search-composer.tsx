"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";

const DEFAULT_QUERY = "I'm a Java backend developer with 2 years experience. Find 10 Bengaluru startups where I have the highest chance of getting hired. I prefer strong learning opportunities and reasonable stability.";

export function SearchComposer({ compact = false, initialValue = "" }: { compact?: boolean; initialValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim() || DEFAULT_QUERY;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };
  return (
    <form className={`search-composer ${compact ? "compact" : ""}`} onSubmit={submit}>
      <div className="composer-icon"><Sparkles size={18} /></div>
      <textarea
        aria-label="Describe your ideal startup or role"
        rows={compact ? 1 : 2}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tell me what you want in your next startup..."
      />
      <button type="submit" aria-label="Search startups"><ArrowUp size={20} /></button>
      {!compact && <div className="composer-hint"><kbd>Enter</kbd><span>to discover your best matches</span></div>}
    </form>
  );
}
