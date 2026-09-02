import { describe, expect, it } from "vitest";
import { startups } from "@/data/demo/startups";
import { parseSearchIntent, rankStartups } from "./search";

describe("deterministic startup search", () => {
  const query = "I'm a Java backend developer with 2 years experience. Find 10 Bengaluru startups where I have the highest chance of getting hired. I prefer strong learning opportunities and reasonable stability.";

  it("extracts the key candidate intent", () => {
    const intent = parseSearchIntent(query);
    expect(intent.role).toBe("Backend Engineer");
    expect(intent.yearsExperience).toBe(2);
    expect(intent.skills).toContain("Java");
    expect(intent.priorities.learning).toBe(1);
    expect(intent.priorities.stability).toBe(1);
    expect(intent.limit).toBe(10);
  });

  it("returns explainable results in descending score order", () => {
    const results = rankStartups(startups, parseSearchIntent(query));
    expect(results.length).toBe(startups.length);
    expect(results[0].bestJob).not.toBeNull();
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    expect(results.every((result) => result.score >= 0 && result.score <= 100)).toBe(true);
    expect(results.every((result) => result.reason.length > 20)).toBe(true);
  });

  it("normalizes Postgres to PostgreSQL", () => {
    const intent = parseSearchIntent("2 YOE backend engineer with Java and Postgres");
    expect(intent.skills).toContain("PostgreSQL");
    const results = rankStartups(startups, intent);
    expect(results[0].matchingSkills).toEqual(expect.arrayContaining(["Java", "PostgreSQL"]));
  });
});
