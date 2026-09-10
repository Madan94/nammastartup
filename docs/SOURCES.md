# Sources and data policy

Company identities and Chennai addresses were checked against the following official pages on 10 September 2026. Descriptions are short editorial summaries. Company-type labels are editorial categories, not funding-stage or registration claims.

| Company | Official evidence |
| --- | --- |
| Agnikul Cosmos | https://agnikul.in/careers/ |
| Garuda Aerospace | https://www.garudaaerospace.com/company/contact-us |
| Gofrugal | https://www.gofrugal.com/contact.html |
| HCL GUVI | https://www.guvi.in/contact/ |
| The ePlane Company | https://www.eplane.ai/connect/ |
| Mindgrove Technologies | https://www.mindgrovetech.in/contact |
| Planys Technologies | https://planystech.com/contact-us/ |
| Raptee.HV | https://www.rapteehv.com/careers/ |

The directory covers Chennai and its surrounding startup corridor. `src/data/chennai.ts` stores the sources and verification dates. Bootstrap preserves later administrator edits and hidden records.

## Automated imports

Only these exact URLs are fetched by the adapters:

- `https://agnikul.in/careers/`: Chennai role titles and the official careers link. No application data is collected. Unrecognized layouts cannot retire stored roles.
- `https://agnikul.in/feed/`: RSS headlines, links, and original dates. The first successful check contained no usable items.
- `https://www.eplane.ai/feed/`: RSS headlines, links, and original dates. The first check yielded five October 2025 stories, which retain those publication dates.

Fetches check robots policies, use an identifying user agent, reject redirects, apply timeouts, and cap response size. Crawl delays above the synchronous request budget defer imports. Failed responses preserve cached records and show their age. Database leases limit automatic attempts to once per six hours per category, triggered by visits.

An accessible page or RSS endpoint is not a general license to copy all publisher content. This directory displays minimal headline/role metadata, attribution, and links, not full articles or job descriptions. Review terms when changing an adapter. Google News RSS was excluded because its notice restricts reuse to personal, noncommercial feed readers. Public submissions never expand the fetch allowlist.

## Map evidence

`src/data/area-locations.json` records Nominatim results and OpenStreetMap objects for resolved neighbourhoods. The verification script spaces requests by at least 1.2 seconds and identifies itself. It is a maintenance command, not a per-visitor geocoder.

Markers are neighbourhood centroids, not surveyed offices. Companies sharing an area appear together in its popup. Kizhakottaiyur did not yield a verified result and remains unmapped. All records remain available in the grid and through address-based directions links.

Maps credit OpenStreetMap contributors. Standard OpenStreetMap tiles are used without prefetching or bulk downloads. Review the [tile policy](https://operations.osmfoundation.org/policies/tiles/) and [Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/) before changing traffic or geocoding behaviour.
