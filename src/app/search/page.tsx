import { Suspense } from "react";
import { SearchExperience } from "@/features/search/search-experience";

export default function SearchPage() {
  return <Suspense fallback={<main className="search-page"><div className="loading-line" /></main>}><SearchExperience /></Suspense>;
}
