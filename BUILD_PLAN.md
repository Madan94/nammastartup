# StartupLens AI — Product Design and Build Plan

## 1. Executive summary

StartupLens AI is a Bengaluru-focused startup discovery and career decision product for job seekers. Its central promise is not merely to list jobs, but to rank startups against a candidate's skills, goals, location, and risk preferences—and show the evidence behind every recommendation.

The source brief is ambitious enough for several product releases. The right MVP is a polished, pitch-ready vertical slice built around one reliable journey:

1. Explore Bengaluru startups.
2. Describe the role and company you want in natural language.
3. Receive deterministic, explainable startup and job matches.
4. Inspect a startup's jobs, momentum, risks, and evidence.
5. Compare two to four opportunities.
6. Save the best companies and jobs.

The application must work without external services. Supabase, Claude, and Mapbox should enhance the experience when configured, but local demo data and deterministic logic must always preserve the main journey.

## 2. Product decisions

### Target user

The MVP serves Bengaluru software engineers, initially optimized for a backend engineer with about two years of experience. Investor, founder, recruiter, and sales use cases are explicitly deferred.

### Product promise

> From 1,000 startups to the 10 that matter to you.

The product is a decision-support system, not a hiring-probability predictor, investment adviser, or generic chatbot.

### MVP success criteria

- The exact Java backend demo query returns ten credible, differentiated results.
- Every score has a visible breakdown and evidence.
- A user can complete discover → search → profile → compare → save without any API keys.
- Five companies contain enough history and signals for a compelling detailed demo.
- The app labels synthetic data and uncertainty without cluttering every screen.
- Desktop is pitch-ready; mobile remains fully usable.

### Scope boundaries

Build in the MVP:

- Discover/map, AI-style search, startup details, jobs, compare, profile, saved items.
- Demo authentication and an optional Supabase authentication path.
- Resume PDF extraction with review-before-save.
- Deterministic ranking, health, learning, stability, and momentum scores.
- Claude-assisted parsing and narrative generation with deterministic fallbacks.
- CSV/JSON imports and adapter interfaces for future job/news providers.
- A minimal protected admin/import screen.

Defer until after the pitch MVP:

- India-wide coverage, alerts, application tracking, salary intelligence.
- Recruiter, founder, investor, and sales modes.
- Knowledge-graph infrastructure and semantic/vector search.
- Automated production ingestion from licensed providers.
- Greenhouse, Lever, and RSS integrations unless the vertical slice is already stable.
- Magic links if email/password plus demo access is sufficient.

## 3. Experience design

### Information architecture

Primary navigation:

- Discover
- AI Search
- Jobs
- Compare (with selection count)
- Saved
- Profile

Admin is role-gated and excluded from primary navigation for normal users.

### Core screen designs

#### Discover `/`

- Compact header with brand, navigation, and Try Demo.
- Hero copy and one prominent natural-language search field.
- Desktop split view: filterable startup list on the left, map on the right.
- Mobile: map with a draggable results sheet and compact search composer.
- Quick collections: actively hiring, recently funded, strong momentum.
- Map fallback uses a neighborhood-grouped discovery grid, not an error panel.

#### Search `/search`

- Query composer at the top with example prompt chips.
- Parsed-intent summary shown as editable filter chips.
- Ranked list and map share selection state.
- Each result exposes match score, best job, matched/missing skills, health, momentum, and a concise reason.
- An expandable “How we ranked this” panel explains weights and evidence.
- Use conversational history sparingly; this is structured search, not open-ended chat.

#### Startup profile `/startups/[slug]`

- Hero with identity, stage, sector, location, hiring state, save/compare actions.
- Personalized fit and relevant jobs appear before general company intelligence.
- Tabs or anchored sections: Overview, Jobs, Candidate Fit, Signals, People & Funding.
- Charts include text summaries and source/freshness labels.
- Outlook and career path use uncertainty-aware language.

#### Jobs `/jobs`

- Search/filter toolbar and sortable job cards.
- Candidate match is the default sort for demo users.
- Company health is compact supporting context, not the dominant job metric.

#### Compare `/compare`

- Supports two to four companies.
- Sticky company headers and a horizontally scrollable mobile matrix.
- Rows group into Fit, Opportunity, Company signals, and Risk.
- Deterministic “best for” badges precede an optional grounded AI narrative.
- Recommendation is conditional on the user's priorities, never universal.

#### Profile `/profile`

- Candidate basics, skills, target roles, location/work mode, and preference weights.
- Resume upload extracts into a review form; nothing is saved until confirmed.
- A reset-to-demo-profile action makes pitch recovery easy.

#### Saved `/saved`

- Tabs for startups, jobs, and searches.
- Saved searches can be rerun with the current profile.

### Visual system

- Neutral slate/stone surfaces with one confident brand accent and semantic status colors.
- Dense cards with strong typography, small badges, restrained shadows, and consistent spacing.
- Score presentation combines number, label, and icon so color is never the only signal.
- Charts use the same time range and legends across company profiles.
- Reserve gradients and animation for subtle focus, loading, and transitions only.

### Accessibility

- Full keyboard access and visible focus states.
- Semantic landmarks, labels, dialog focus management, and live result counts.
- Text alternatives for every chart.
- WCAG AA contrast and reduced-motion support.

## 4. Technical architecture

### Recommended stack

- Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui.
- Server Components for initial data; Client Components only for interactive filters, map, compare state, and forms.
- PostgreSQL/Supabase for production persistence and auth.
- Local TypeScript repository backed by seeded JSON for keyless demo mode.
- Zod at every external boundary.
- Recharts for trends; Mapbox/react-map-gl when a token exists.
- Vitest for domain logic and Playwright for the demo journey.

### Architectural principle: ports and adapters

Business logic must not know whether records came from Supabase or local demo files.

```text
UI / Route Handlers
        |
Application services (search, compare, save, profile)
        |
Domain logic (intent, normalization, scoring, evidence)
        |
Repository + AI + Map ports
        |
Supabase / local demo | Claude / deterministic | Mapbox / grid
```

Suggested structure:

```text
src/
  app/
  components/
  features/{discover,search,startups,jobs,compare,profile,saved}/
  lib/
    config/
    domain/{search,scoring,evidence}/
    repositories/{contracts,demo,supabase}/
    ai/{contracts,claude,fallback,prompts}/
    ingestion/{adapters,normalize,pipeline}/
    map/{neighborhoods,distance}/
    analytics/
  data/demo/
  types/
supabase/{migrations,seed.sql}
tests/{unit,e2e}/
```

### Runtime modes

Use explicit capability detection rather than spreading environment checks across components:

- `demo`: local seed repository, local session, deterministic parser/explanations, map or grid.
- `connected`: Supabase repository/auth plus optional Claude and Mapbox.
- Individual services may degrade independently; a failed explanation must never erase ranked results.

Expose capabilities from a central server configuration and pass only safe flags to the browser.

## 5. Data design

The proposed entities are sound: profiles, startups, founders, jobs, funding rounds, employee snapshots, hiring snapshots, signals, scores, sources, saved items, and search sessions.

Recommended refinements:

- Use database enums or checked text values for stage, work mode, signal type, and employment type.
- Keep canonical searchable skills/technologies in relational join tables in production; JSON arrays are acceptable for the first demo repository. This prevents slow and inconsistent skill search later.
- Give evidence-bearing records `source_id`, `observed_at`, and `is_demo_data`; use `data_last_updated_at` only as a convenient aggregate.
- Store score snapshots as derived artifacts with `algorithm_version` so results remain auditable after formulas change.
- Save `parsed_query`, `profile_snapshot`, and `scoring_version` in search sessions for reproducibility.
- Add unique constraints for startup slug, external job identity, saved-item pairs, and snapshot date per startup.
- Add indexes for active jobs, stage/sector/neighborhood, posted date, snapshot ranges, and user-owned records.
- Enforce RLS on profile, saved, resume, and search-session tables. Public catalog data is read-only to normal users.

Seed design:

- 40 fictional startups and at least 100 jobs.
- Five narrative archetypes: stable Java fit, high-growth/high-risk Kafka fit, early-stage learning fit, excellent stack/low hiring, strong health/no Java role.
- Six to twelve monthly snapshots for each rich profile.
- A single source record identifies the synthetic dataset; every demo record is flagged.
- Seed generation should be deterministic, idempotent, and validated for referential integrity.

## 6. Search and scoring design

### Search pipeline

1. Merge confirmed profile defaults with the raw query; explicit query statements win.
2. Parse into a strict `SearchIntent` schema.
3. Validate and normalize roles, skills, stages, neighborhoods, and priority weights.
4. Retrieve broadly using hard constraints only (location radius, active roles, explicit stage/sector).
5. Score matching jobs first.
6. Aggregate job fit and company attributes into startup fit.
7. Rank deterministically and retain component/evidence references.
8. Generate one batched explanation for the top results, or use templates.
9. Render the same ranked domain object regardless of AI availability.

### Candidate fit

Base weights:

| Component | Weight |
|---|---:|
| Role availability | 25% |
| Skill match | 25% |
| Experience match | 15% |
| Technology match | 10% |
| Location/work mode | 10% |
| Learning | 5% |
| Stability | 5% |
| Growth | 5% |

Rules:

- Parsed priorities adjust weights within bounded ranges, then normalize to 1.
- Hard filters exclude; preferences influence score.
- Skill comparison uses canonical aliases and distinguishes required from preferred skills.
- Startup role availability should derive from the best matching active jobs, with a small breadth bonus—not an average that punishes companies with unrelated roles.
- Return raw components, applied weights, overall score, matching/missing skills, and evidence IDs.
- Label the result “fit score,” never “chance of being hired.”

### Health and outlook

- Health is deterministic and renormalizes across available components.
- Missing information reduces confidence rather than becoming a zero.
- Operational risk is inverse-scored in health but displayed directly with “lower is better.”
- Store component coverage, source freshness, and algorithm version.
- Claude may summarize the calculated outlook; it may not create new facts or scores.

### Distance

- Maintain local coordinates for supported Bengaluru neighborhoods.
- Use Haversine distance for radius filtering.
- If the origin is ambiguous, treat it as a soft preference and surface the interpretation.

## 7. AI design and safety

Claude is used for strict query parsing, resume structuring, and concise grounded summaries. It is never the source of companies, jobs, metrics, or rankings.

Every AI operation must:

- Accept a compact structured context.
- Return JSON validated by Zod.
- Retry malformed JSON once and then use deterministic fallback logic.
- Include evidence IDs for claims.
- Exclude hidden prompts and server keys from responses/logs.
- Batch result explanations into one call.

The local parser must recognize the demo's roles, experience phrases, core technologies, Bengaluru neighborhoods, stages, radius expressions, and preference words. Template explanations consume the same ranked result object as Claude, ensuring parity.

Resume handling:

- Validate MIME type and size, extract text server-side, and send only necessary text.
- Display extracted/inferred values for confirmation.
- Avoid retaining raw text; delete or expire the uploaded PDF after processing unless the user explicitly keeps it.
- Provide profile/resume deletion.

## 8. API and state boundaries

- Prefer direct server-side repository calls in Server Components.
- Use Route Handlers for interactive search, uploads, AI operations, import, and client-triggered saves.
- Use URL search parameters for shareable discover/job filters.
- Keep compare selections in a small client store persisted to local storage; validate IDs on the server when loading comparison data.
- Demo saves/profile use namespaced local storage. Connected mode uses authenticated server mutations.
- Rate-limit AI and upload endpoints and reject arbitrary fetch URLs.

Core endpoints:

```text
POST /api/search
POST /api/resume/parse
POST /api/compare/explain
GET  /api/startups
GET  /api/startups/[slug]
GET  /api/jobs
POST/DELETE /api/saved/startups/[id]
POST/DELETE /api/saved/jobs/[id]
POST /api/import/{csv,json}
```

Avoid separate parse-search and search endpoints in the MVP; one orchestration endpoint prevents duplicated client state and extra latency.

## 9. Step-by-step delivery plan

Each increment must leave the application runnable and demoable.

### Step 0 — Establish decisions and tooling (half day)

- Record architecture decisions, supported runtime modes, environment schema, and naming constants.
- Scaffold Next.js, TypeScript, Tailwind, linting, Vitest, and Playwright.
- Add CI commands: lint, typecheck, unit tests, build, E2E.

Exit: a branded shell boots and all quality commands run.

### Step 1 — Domain model and deterministic seed (1–2 days)

- Define domain/Zod schemas and repository contracts.
- Build deterministic demo seed data with 40 startups, 100+ jobs, evidence, and five rich profiles.
- Implement the local repository and data validation tests.
- Create Supabase migrations, RLS, indexes, and an idempotent seed path.

Exit: catalog queries return valid, reproducible data without Supabase.

### Step 2 — Discovery vertical slice (1–2 days)

- Build the responsive app shell, discover split view, filters, cards, and marker/list selection.
- Integrate Mapbox behind a map adapter; implement the neighborhood grid fallback.
- Add loading, empty, unavailable, and demo-data states.

Exit: users can browse and filter startups with or without a map token.

### Step 3 — Scoring engine and search (2 days)

- Implement normalization, aliases, fallback intent parser, distance calculation, job score, startup score, and confidence handling.
- Add the search orchestration service and `/search` experience.
- Hard-test the exact Java query and snapshot its ranked breakdown.
- Add “How we ranked this” and evidence UI.

Exit: the exact query reliably produces ten differentiated, explainable results with no AI key.

### Step 4 — Startup and jobs intelligence (1–2 days)

- Build startup details, candidate fit, jobs, founders, funding/signals, charts, outlook, and possible career path.
- Build the jobs page with filters and candidate-match sorting.
- Add source, freshness, confidence, and accessible chart summaries.

Exit: all five rich demo profiles tell coherent, evidence-backed stories.

### Step 5 — Compare and saved journey (1 day)

- Add global compare selection, two-to-four-company matrix, deterministic best-for labels, and grounded summary fallback.
- Implement demo-mode and connected-mode saved startups, jobs, and searches.

Exit: a user can compare three results and retain chosen items across reloads.

### Step 6 — Profile, authentication, and resume (1–2 days)

- Add Try Demo, local demo session, Supabase auth adapter, profile editor, and preference weights.
- Implement PDF validation/extraction, structured parsing, review, confirmation, and deletion.
- Verify RLS and prevent cross-user access.

Exit: profile changes alter ranking; resume data is never silently committed.

### Step 7 — Optional AI enhancement (1 day)

- Add Claude client, server-only prompts, strict schemas, timeout/error policy, and one-retry behavior.
- Add query parsing, batched explanations, comparison narrative, outlook, career scenario, and resume parsing.
- Confirm all operations degrade to deterministic behavior independently.

Exit: Claude improves language and interpretation but cannot change factual retrieval or computed scores.

### Step 8 — Import/admin and observability (1 day)

- Add admin authorization, CSV/JSON import preview/validation, ingestion errors, source freshness, and analytics abstraction.
- Document future Greenhouse/Lever/RSS adapters without letting them delay the MVP.

Exit: an admin can safely preview and import validated records.

### Step 9 — Hardening and pitch polish (1–2 days)

- Test keyboard/mobile use, failure modes, loading performance, rate limits, and privacy deletion.
- Add E2E coverage for the full demo path.
- Run lint, typecheck, unit tests, E2E, and production build; fix all failures.
- Finish architecture, scoring, AI, ingestion, deployment, and demo documentation.

Exit: the three-to-five-minute demo succeeds from a clean install with no external keys.

Estimated MVP: 11–16 focused engineering days for one experienced full-stack engineer, excluding production data-provider procurement and legal review.

## 10. Testing strategy

Unit tests:

- Skill/role normalization and aliases.
- Query parser, weight normalization, hard versus soft filters.
- Job/startup/health scores, missing data, confidence, and risk inversion.
- Haversine distance and neighborhood lookup.
- Seed validity and stable rank ordering.
- Evidence references contain no dangling IDs.

Integration tests:

- Search orchestration in local and mocked connected modes.
- AI invalid JSON, timeout, and fallback behavior.
- Repository parity, import validation, auth/RLS mutations.

Playwright journeys:

1. Try Demo and submit the exact Java query.
2. Verify ten ranked results and score explanation.
3. Open a startup and inspect evidence/charts/jobs.
4. Compare three companies and see priority-aware trade-offs.
5. Save a startup and job and verify persistence.
6. Change a profile priority and verify ranking changes.
7. Run with missing AI and Mapbox keys.

## 11. Delivery risks and mitigations

| Risk | Mitigation |
|---|---|
| Scope is too broad for a polished MVP | Ship the vertical slice first; integrations and secondary personas remain deferred. |
| Demo depends on third-party uptime | Local repository, parser, narratives, session, and map fallback are first-class implementations. |
| Scores look arbitrary | Version formulas, expose components/weights/evidence, and test rank fixtures. |
| Synthetic data is mistaken for fact | Fictional companies, record-level flags, one clear dataset notice, and source labels. |
| Missing data unfairly lowers companies | Renormalize available health components and lower confidence. |
| AI invents claims | Retrieve first, strict schemas, evidence IDs, validation, and deterministic fallback. |
| Resume creates privacy exposure | Minimize transfer/retention, require confirmation, enforce RLS, provide deletion. |
| Map becomes the schedule bottleneck | Build against a map port and ship the neighborhood grid as a complete fallback. |

## 12. Definition of done

- Clean install and local boot are documented and reproducible.
- Demo mode needs no Supabase, Claude, or Mapbox credentials.
- The exact showcase query returns ten deterministic results.
- Discovery, startup, jobs, compare, profile, resume review, and saved flows work.
- Scores, narratives, outlooks, and charts expose evidence, freshness, and confidence.
- No UI describes fit as hiring probability or outlook as guaranteed performance.
- Responsive and keyboard-accessible layouts pass manual checks.
- Lint, typecheck, unit tests, Playwright demo tests, and production build pass.
- Deployment, provenance, scoring, AI, ingestion, and demo instructions are complete.

## 13. Recommended first implementation milestone

Do not begin with authentication or external integrations. Build the first vertical slice in this order:

1. App shell and centralized product configuration.
2. Typed local demo dataset with three rich companies and ten jobs initially.
3. Skill normalization and deterministic job/startup scoring.
4. Search page supporting the exact Java query.
5. Result card → startup detail navigation.
6. Expand the validated seed to 40 companies and 100+ jobs.

This proves the product's distinctive value before investing in infrastructure and secondary flows.
