# Release verification — 10 September 2026

The application was validated at commit `cb4f7eb299a0e15743af35545243795104cc4551` (build-session commit 49). Commit 50 records this evidence; it does not change application behaviour. The session base is `ca1dee4e7c46e93effea917bc754b3759b14c480`.

## Executed checks

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript with regenerated Next route types | Passed |
| Vitest | 18 tests passed in 4 files |
| Next production build | Passed |
| Next/SQLite production HTTP smoke | 45 checks passed |
| Vinext/Workers production build | Passed |
| Local Workers/D1 HTTP smoke | Same 45 checks passed |
| Production dependency audit | No known vulnerabilities reported |
| Git whitespace check | Passed |
| Known admin-secret scan | No matches in tracked source or packaged build output |
| GitHub CI for commit 49 | [Passed](https://github.com/Madan94/nammastartup/actions/runs/34437298757) |

Both HTTP runs used fresh, isolated databases and randomly generated test admin keys. Both imported **4 Agnikul jobs and 5 ePlane RSS stories** from live sources. Tests also checked catalog counts, public pages, two company metadata responses, an unknown company returning 404, legacy redirects, empty search results, unauthorized writes, request-origin rejection, invalid submissions, login cookie flags, duplicate and concurrent submissions, approval requirements, repeat review rejection, correction-target enforcement, hide/republish, private-record deletion, and logout.

Unit tests cover input and coordinate validation, directory filters, source parsing and robots rules, response limits, transaction rollback, pending publication, correction targeting, and concurrent review decisions. They use isolated fixtures; none of those fictional records are part of the real catalog.

## Hosted preview

The owner-only preview deployed successfully at:

https://namma-chennai-startup-map.madhanxdev.chatgpt.site

The provider confirmed deployment success and runtime environment revision 1. `ADMIN_ACCESS_KEY` is configured as a secret; the canonical site origin is configured separately. The live D1 binding `DB` has all seven tables: `companies`, `jobs`, `news`, `submissions`, `sync_runs`, `rate_limits`, and `audit`.

An unauthenticated HTTP request received the host's private-access response (401). This verifies that the preview is gated; it does **not** verify signed-in browser behaviour. No access bypass was created. The final documentation commit is published from the same application source after its remote push.

## Coverage and practical limits

- Eight company records have official source links and a manual verification date. Seven markers use verified neighbourhood centroids. Gofrugal's unresolved coordinates remain blank.
- Imported news preserves the publisher's actual dates, including October 2025 stories. It is not a claim of newly published news.
- Company verification remains a human review task. Automatic jobs/news refresh is visit-triggered, at most every six hours. Cached results survive source failures with freshness notices.
- Local D1 and local SQLite tests do not exercise the provider's signed-in access gate. No usable browser was available for this session, so map gestures, keyboard navigation, client hydration, mobile layouts, and signed-in hosted workflows have not been visually tested. The social card was inspected as an image.
- The preview has no custom domain, mail delivery, unattended refresh scheduler, payments, or multiple administrator accounts. The review queue displays the 200 most recent requests.

## Reproduce and inspect the session

Run the commands in [README.md](../README.md). The `--worker` smoke mode requires the Sites build first. Stop development servers before production builds so generated route/cache files are not being rewritten concurrently.

```powershell
git rev-list --count ca1dee4e7c46e93effea917bc754b3759b14c480..HEAD
git log --reverse --oneline ca1dee4e7c46e93effea917bc754b3759b14c480..HEAD
git ls-remote origin refs/heads/main
```

The completed build session contains exactly 50 commits, pushed throughout development. The final remote-head comparison and deployment result are reported in the build handoff. Credentials, local databases, temporary test data, and hosting archives remain ignored.
