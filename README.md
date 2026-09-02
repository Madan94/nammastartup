# StartupLens AI

An evidence-backed Bengaluru startup and job discovery product. It turns a candidate's natural-language goals into structured filters, deterministic fit scores, and a transparent startup shortlist.

## Current build

The first production vertical slice includes:

- Premium responsive discovery and ecosystem-map experience
- Natural-language AI-style search with a deterministic fallback parser
- Explainable candidate-to-job and candidate-to-startup scoring
- Ranked result cards with skills, roles, momentum, health, and risk
- Rich startup intelligence pages with opportunity, growth, outlook, career-path, and evidence views
- Validated fictional demo dataset and automated scoring tests

## Local setup

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`. No environment variables are required for the current demo milestone.

Quality gates:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

See [BUILD_PLAN.md](BUILD_PLAN.md) for the analyzed product design, architecture, scope, and phased implementation plan for StartupLens AI.
