# Chennai Startup Map · Namma Startup

A Chennai company directory with an interactive map, searchable profiles, official careers listings, company news, and a moderated submission workflow. Built for free listings using official company websites and permitted public feeds.

The previous fictional Bengaluru ranking prototype has been replaced. Counts, filters, markers, jobs, news, and moderation read persistent data. There are no invented fit scores, funding totals, founders, or paid rankings.

## What you can do

- Explore a Leaflet/OpenStreetMap map or grid. Filter by sector, neighbourhood, company type, or companies with source-listed jobs. Filters are shareable in the URL.
- Inspect a company address, website, careers link, original source, and verification date.
- Browse imported Chennai roles and RSS headlines; apply and read articles on their original websites.
- Submit a company or correction. Requests stay private until an administrator reviews them.
- Use `/admin` to verify, approve, reject, refresh sources, hide or republish companies, and delete private intake records.

## Coverage and freshness

The initial catalog contains **8 companies**, verified on 10 September 2026: Agnikul Cosmos, Garuda Aerospace, Gofrugal, HCL GUVI, The ePlane Company, Mindgrove Technologies, Planys Technologies, and Raptee.HV. Seven have verified **neighbourhood centroids**, explicitly labelled approximate. Gofrugal remains unmapped until its coordinates are verified.

This is a small curated directory, not a complete Chennai census. Company profiles require human verification. Job/news adapters refresh when their pages or APIs are visited, at most once per six hours; administrators can request another check after one minute. There is no unattended scheduler. Failed refreshes retain previous data and expose its age.

Initial live source checks returned four Agnikul roles and five ePlane RSS headlines. Counts can change. Original feed dates are preserved, including older stories. A careers link alone does not count as hiring. See [sources and coverage](docs/SOURCES.md).

## Run locally on Windows

Use Node.js 24 or newer. For a fresh checkout:

```powershell
corepack pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Put the generated value into `ADMIN_ACCESS_KEY` in `.env.local`, then run:

```powershell
corepack pnpm dev
```

Open `http://localhost:3000`; administration is at `/admin`. SQLite and the verified catalog initialize automatically. No external API key is required. Jobs/news need internet access and populate on their first check.

| Variable | Purpose |
| --- | --- |
| `ADMIN_ACCESS_KEY` | Private random key, at least 32 characters. Required for admin sign-in. |
| `NEXT_PUBLIC_APP_URL` | Canonical origin. Local default: `http://localhost:3000`. |
| `DATABASE_PATH` | Optional local SQLite path; defaults to `.data/chennai.sqlite`. Not used by D1. |

In the original build checkout, a key already exists in ignored `.env.local` and `.data/admin-access.txt`; preserve it instead of copying the example over it.

## Architecture

```text
Official careers / RSS → allowlisted fetch + robots checks → parser → database
Verified company sources → curated bootstrap records ────────────────┘
Public forms → validation + rate limits → pending submissions
Admin access key → signed session → source review → published company
Database → server pages + JSON APIs → map / profiles / jobs / news
```

- UI: Next.js App Router, React, TypeScript, Leaflet, responsive CSS.
- Local persistence: Node SQLite, WAL, parameterized queries, transaction batches.
- Hosted persistence: Cloudflare D1 through a platform adapter. Drizzle defines schema and migrations.
- Hosting: the original Next build remains available; Vinext creates the Workers-compatible Sites build. `.openai/hosting.json` identifies this project's existing Sites resource and logical `DB` binding.
- Authorization: HMAC-signed, HttpOnly, SameSite Strict eight-hour admin sessions; Secure on production. Writes enforce same-origin requests. Public input is validated, bounded, rate-limited, and never automatically fetched.

`src/features` contains interfaces; `src/lib/server` handles storage/auth; `src/lib/ingestion` handles adapters; `src/data` contains verified records and location evidence; `db` and `drizzle` contain schema/bootstrap/migrations.

## Validate

```powershell
corepack pnpm lint
corepack pnpm test
corepack pnpm build
corepack pnpm typecheck
corepack pnpm test:smoke
corepack pnpm build:sites
corepack pnpm audit --prod
```

The HTTP smoke test starts a production server on port 3012 with an isolated temporary database and random admin key. Fictional fixtures exist only in that test database. `typecheck` regenerates route types because Next and Vinext emit different declarations. CI runs the application checks. See [verification evidence](docs/VERIFICATION.md).

## Operations and scope

Review `/admin` regularly; no mail or notification service is configured. Open each official source before approving. Leave uncertain coordinates blank. Use correction requests to edit existing records. Hiding a company excludes it and its jobs from public results. Deleting a private submission does not delete its published company.

Back up local SQLite using its backup API or copy it while the server is stopped. Hosted D1 is a separate database; use the provider's export facilities. Rotating the admin key invalidates sessions. See [operations](docs/OPERATIONS.md).

Payments and sponsorship are deferred by choice. No custom domain, third-party sign-in, email delivery, or public launch is configured. The Sites preview is owner-only. Browser interaction and mobile visual review remain necessary before public launch; HTTP/build checks do not substitute for them.
