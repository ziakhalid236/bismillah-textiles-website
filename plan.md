# Bismillah Textiles — Production plan and operating rules

## Purpose

Maintain a credible company website and a real admin CMS for products, managed pages and media. The site is not a demo storefront: it has no prices, cart or checkout, and public content must remain buyer-facing, factual and connected to the live data system.

## Source of truth

Frontend source lives in `artifacts/bismillah-textiles`. The Cloudflare Worker in `cloudflare-api` is the source of truth for authenticated admin mutations, public published records, D1 data and private R2 media. The Vercel deployment is produced from the GitHub `main` branch.

## Content rules

Keep important company information, product categories, manufacturing capability, quality documentation, company news and market context. Consolidate only genuinely related content into hubs; preserve compatibility URLs when a page is merged. Location copy should use Faisalabad, Punjab, Pakistan in general branding and use Khurrianwala only when presenting the physical address or map destination.

## Admin rules

Never commit credentials or fake records. Admin mutations must remain authenticated. Uploaded media must go through the Worker, be stored in private R2, receive D1 metadata and be publicly served only when referenced and published. Any future schema change requires a migration and a live verification without deleting existing records.

## Delivery rules

Run `pnpm run build:vercel` and `git diff --check` before every push. Do not change the official domain or DNS without explicit approval. After a frontend push, verify the Vercel deployment and check the public API health endpoint before reporting completion.
