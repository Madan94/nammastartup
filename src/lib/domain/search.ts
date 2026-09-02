import { z } from "zod";
import type { Job, RankedStartup, SearchIntent, Startup } from "./types";

const aliases: Record<string, string> = {
  spring: "spring boot", postgres: "postgresql", k8s: "kubernetes",
  js: "javascript", ts: "typescript", "amazon web services": "aws",
};

export const SearchIntentSchema = z.object({
  role: z.string(),
  yearsExperience: z.number().nullable(),
  skills: z.array(z.string()),
  neighborhoods: z.array(z.string()),
  priorities: z.object({ learning: z.number(), stability: z.number(), growth: z.number() }),
  limit: z.number().min(1).max(50),
});

const knownSkills = ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "Python", "React", "TypeScript", "AWS", "GCP"];
const knownNeighborhoods = ["HSR Layout", "Koramangala", "Indiranagar", "Bellandur", "Whitefield", "JP Nagar", "Jayanagar", "Hebbal", "Marathahalli", "Electronic City"];

const normalize = (value: string) => aliases[value.trim().toLowerCase()] || value.trim().toLowerCase();

export function parseSearchIntent(query: string): SearchIntent {
  const lower = query.toLowerCase();
  const experience = lower.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yoe)/);
  const limitMatch = lower.match(/(?:find|show|top)\s+(\d+)/);
  const role = lower.includes("backend") ? "Backend Engineer" : lower.includes("platform") ? "Platform Engineer" : lower.includes("frontend") ? "Frontend Engineer" : "Software Engineer";
  const skills = knownSkills.filter((skill) => lower.includes(skill.toLowerCase()) || (skill === "PostgreSQL" && lower.includes("postgres")));
  const neighborhoods = knownNeighborhoods.filter((place) => lower.includes(place.toLowerCase()));
  return SearchIntentSchema.parse({
    role,
    yearsExperience: experience ? Number(experience[1]) : null,
    skills,
    neighborhoods,
    priorities: {
      learning: lower.includes("learning") || lower.includes("learn") ? 1 : 0.5,
      stability: lower.includes("stability") || lower.includes("stable") ? 1 : 0.5,
      growth: lower.includes("growth") || lower.includes("high-growth") ? 1 : 0.5,
    },
    limit: limitMatch ? Number(limitMatch[1]) : 10,
  });
}

function scoreJob(job: Job, intent: SearchIntent) {
  const requested = intent.skills.map(normalize);
  const offered = job.skills.map(normalize);
  const matches = requested.filter((skill) => offered.includes(skill));
  const skillScore = requested.length ? (matches.length / requested.length) * 100 : 65;
  const roleScore = /backend|software|platform/i.test(job.title) && /backend|software|platform/i.test(intent.role) ? 100 : 55;
  const years = intent.yearsExperience;
  const experienceScore = years === null ? 70 : years >= job.experience[0] && years <= job.experience[1] ? 100 : Math.max(30, 100 - Math.min(Math.abs(years - job.experience[0]), Math.abs(years - job.experience[1])) * 25);
  return { score: skillScore * 0.45 + roleScore * 0.25 + experienceScore * 0.3, skillScore, roleScore, experienceScore };
}

export function rankStartups(items: Startup[], intent: SearchIntent): RankedStartup[] {
  return items.map((startup) => {
    const scoredJobs = startup.jobs.map((job) => ({ job, ...scoreJob(job, intent) })).sort((a, b) => b.score - a.score);
    const best = scoredJobs[0];
    const requested = intent.skills.map(normalize);
    const companySkills = startup.technologies.map(normalize);
    const matchingSkills = intent.skills.filter((skill) => companySkills.includes(normalize(skill)));
    const missingSkills = best ? best.job.skills.filter((skill) => !requested.includes(normalize(skill))).slice(0, 3) : [];
    const location = intent.neighborhoods.length === 0 || intent.neighborhoods.includes(startup.neighborhood) ? 100 : 65;
    const breakdown = {
      roleAvailability: best ? best.roleScore : 0,
      skillMatch: best ? best.skillScore : 0,
      experienceMatch: best ? best.experienceScore : 50,
      technologyMatch: requested.length ? (matchingSkills.length / requested.length) * 100 : 70,
      location,
      learning: startup.learningScore,
      stability: startup.stabilityScore,
      growth: Math.min(100, 55 + startup.growth6m),
    };
    const baseWeights = { roleAvailability: .25, skillMatch: .25, experienceMatch: .15, technologyMatch: .10, location: .10, learning: .05, stability: .05, growth: .05 };
    const weights = { ...baseWeights, learning: .05 * intent.priorities.learning * 2, stability: .05 * intent.priorities.stability * 2, growth: .05 * intent.priorities.growth * 2 };
    const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
    const score = Object.entries(weights).reduce((sum, [key, weight]) => sum + breakdown[key as keyof typeof breakdown] * weight, 0) / totalWeight;
    const reason = best
      ? `${best.job.title} aligns with ${Math.max(1, matchingSkills.length)} of your core skills. ${startup.hiringMomentum} hiring momentum and a ${startup.stabilityScore}/100 stability signal shape the trade-off.`
      : "No directly relevant role is open today, but the company remains visible for its technology and growth signals.";
    return { startup, score: Math.round(score), bestJob: best?.job ?? null, matchingSkills, missingSkills, breakdown, reason };
  }).sort((a, b) => b.score - a.score).slice(0, intent.limit);
}
