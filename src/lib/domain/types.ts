export type Stage = "Seed" | "Series A" | "Series B" | "Series C+" | "Bootstrapped";
export type Momentum = "Strong" | "Rising" | "Steady" | "Cooling";

export interface Job {
  id: string;
  title: string;
  experience: [number, number];
  skills: string[];
  workMode: "On-site" | "Hybrid" | "Remote";
  postedDaysAgo: number;
}

export interface Startup {
  id: string;
  slug: string;
  name: string;
  monogram: string;
  accent: string;
  tagline: string;
  description: string;
  sector: string;
  stage: Stage;
  neighborhood: string;
  employees: string;
  technologies: string[];
  healthScore: number;
  stabilityScore: number;
  learningScore: number;
  growth6m: number;
  hiringMomentum: Momentum;
  risk: "Low" | "Moderate" | "Elevated";
  jobs: Job[];
  signals: string[];
  isDemoData: true;
  updatedAt: string;
}

export interface SearchIntent {
  role: string;
  yearsExperience: number | null;
  skills: string[];
  neighborhoods: string[];
  priorities: { learning: number; stability: number; growth: number };
  limit: number;
}

export interface RankedStartup {
  startup: Startup;
  score: number;
  bestJob: Job | null;
  matchingSkills: string[];
  missingSkills: string[];
  breakdown: {
    roleAvailability: number;
    skillMatch: number;
    experienceMatch: number;
    technologyMatch: number;
    location: number;
    learning: number;
    stability: number;
    growth: number;
  };
  reason: string;
}
