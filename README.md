# Bismillah Textiles website

Production website and connected admin CMS for Bismillah Textiles (PVT) Limited.

## Current architecture

- Frontend: `artifacts/bismillah-textiles`
- Admin API: Cloudflare Worker in `cloudflare-api`
- Database: Cloudflare D1, accessed only through the Worker
- Media: private Cloudflare R2 bucket, streamed through authenticated/public Worker routes
- Hosting: Vercel through the connected GitHub repository
- Repository: `ziakhalid236/bismillah-textiles-website`

## Public information structure

- `/`: homepage
- `/about-us/`: company, leadership, values and R&D
- `/manufacturing-facilities/`: integrated production capabilities
- `/products/`: combined products, brands and retail partners page
- `/contact-us/`: combined contact and certifications page
- `/news/`: company news plus links to market and international insight pages
- `/markets-industry-insights/`: evidence-led market and trade context
- `/international-news/`: international textile briefing

Compatibility aliases remain for existing links: `/brands-retailers/` renders the combined products page and `/certifications/` renders the combined contact page. The public Careers page has been removed.

## Admin and live data

Admin UI: `/admin/`. It authenticates against the Cloudflare Worker and loads products, categories, managed pages and media from the live D1/R2-backed API. It must never contain demo credentials or fake production records. The UI displays live database status and loaded record counts after authentication.

Worker health endpoint: `https://bismillah-textiles-admin-api.ziakhalid236.workers.dev/api/healthz`

## Verification

```bash
pnpm install --frozen-lockfile
pnpm run build:vercel
```

The build runs typecheck, frontend production build, route metadata generation and API build. Do not change the official custom domain or DNS without explicit approval.
