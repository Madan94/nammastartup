import Link from "next/link";
import { BriefcaseBusiness, ArrowRight } from "lucide-react";
export default function JobsPage() { return <main className="placeholder-page"><BriefcaseBusiness/><span className="kicker">Opportunity index</span><h1>Jobs, ranked around you.</h1><p>The complete filtered jobs workspace is queued for the next build increment. Today, matching roles are live inside AI Search and company profiles.</p><Link href="/search">Search matching roles <ArrowRight size={16}/></Link></main>; }
