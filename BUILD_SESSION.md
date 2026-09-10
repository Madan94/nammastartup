# Chennai Startup Map build

Base: `ca1dee4e7c46e93effea917bc754b3759b14c480`.

User requirements: Chennai equivalent of Bangalore Startup Map; real records and dynamic workflows; official company websites and permitted public feeds; no existing infrastructure; free listings; exactly 50 focused commits, pushed in batches of five.

Product: map and grid directory, URL-addressable filters, company profiles, current source-linked jobs, news, moderated submissions, correction requests, and a protected admin workspace. No paid placements in this release.

Data rules: keep source URLs and observation times; never fabricate job counts, funding, founders, coordinates, or confidence scores. Unknown fields stay unknown. A company having a careers page does not establish that it is hiring. Refresh failures retain prior data with its original freshness. Review all public submissions before publication.

Delivery: retain the Next.js application and pnpm workflow. Add durable storage, source adapters, server-side authorization, meaningful tests, and a compatible hosting build. Public reading requires no account; administrative writes require authorization. Never commit credentials.

Validation: type checks and relevant tests before each five-commit push; final production builds and route/API checks. Record exact verification and any remaining external blockers in the final release documentation.

The Git history is the authoritative 50-step build log. Count with `git rev-list --count ca1dee4e7c46e93effea917bc754b3759b14c480..HEAD`.
