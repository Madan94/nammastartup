# Operating the directory

## Review and publish

1. Open `/admin` and enter the private server access key.
2. Inspect a pending request and its official source. Verify the organization, Chennai presence, address, description, and careers link.
3. Edit the structured record. Use a stable lowercase slug for a new company. Corrections retain the original company slug.
4. Enter coordinates only with supporting evidence and choose the correct precision. Leave both empty when uncertain.
5. Mark the source verified and approve. Publication and the review decision share a database transaction. Rejected requests never enter the catalog.

To remove a listing, hide the company and close the request with an explanatory note. Hiding excludes the company and its jobs from public results. Deleting a submission removes its private intake record; the public company and minimal audit history remain separate.

The workspace displays the 200 most recent requests. Add pagination before intake exceeds that operational limit. There are no automatic emails or notifications; submitted requests receive a reference ID on screen.

## Refresh and maintain

Visit `/jobs` and `/news` to populate a new database. Admin refresh controls use the same allowlisted adapters. The status panel shows attempts, successes, errors, and item counts. Publisher failures never make cached records appear newly verified.

If a page changes, inspect the official source and update its adapter and regression test. Do not convert parsing failure into a successful empty import. Company addresses require human review; job/news refresh does not reverify profiles.

Local Next uses `.data/chennai.sqlite` unless `DATABASE_PATH` is set. Hosted Sites uses D1 binding `DB`, independent of the local database. Both bootstrap the same schema and verified catalog; requests and imported feeds evolve independently.

When changing `db/schema.ts`, run `corepack pnpm db:generate`, review `drizzle/`, and update idempotent statements in `db/migrations.ts`. Preserve existing data. Package migrations with the Sites build. SQLite transaction batches map to atomic D1 batches.

Keep `.env.local`, `.dev.vars`, `.data`, and build artifacts private and ignored. Set hosted `ADMIN_ACCESS_KEY` and `NEXT_PUBLIC_APP_URL` through Sites runtime settings. Rotating the key invalidates sessions. No email recovery flow exists.

Rate limits use Cloudflare's connecting-IP header on the managed deployment. Direct local requests share a local bucket. Other hosting requires a trusted client-IP adapter; do not trust spoofable forwarding headers without proxy controls.

## Publishing

`corepack pnpm build` produces the standard Next application. `corepack pnpm build:sites` produces `dist/server/index.js`, client assets, and migration metadata. Reuse the existing `.openai/hosting.json` project.

The Sites preview is owner-only. The directory itself requires no browsing account, but the preview host adds its own access gate. Public launch requires an intentional access change after browser and mobile review. A custom domain, scheduler, mail notifications, and multiple administrator accounts can be added later.
