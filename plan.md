# Bismillah Textiles — Product Carousel and Managed Media

## Scope

Implement the approved production scope without changing `bismillah.com.pk`, DNS, or existing official-domain mapping:

1. Rework the homepage product showcase into a reference-led, image-first horizontal carousel with one dominant card, a visible next-card peek on mobile, left/right controls, pagination, keyboard support, touch scrolling, no prices, and no shopping/cart icon.
2. Keep admin sign-in backed by Cloudflare Worker secrets (`ADMIN_USERNAME` plus a secret password/hash). Never commit or display credentials.
3. Add authenticated direct gallery uploads for product images, certificates, and brand logos. Files are stored in the private Cloudflare R2 bucket through the Worker; public routes stream only explicitly referenced/published media.
4. Add admin media-library CRUD, product image assignment, certificate/brand asset assignment, validation, size/type limits, and safe object-key handling.
5. Harden security: strict origin checks, authenticated mutations, private R2 access, no public bucket exposure, safe response headers, bounded upload sizes, and no secret leakage.

## Design

- **Design movement:** Editorial textile catalogue inspired by the supplied mobile reference: warm paper, rich burgundy controls, restrained olive/ink text, and premium image-led product cards.
- **Core principles:** product photography leads; copy is concise and buyer-facing; controls are obvious but quiet; every interaction works on touch and keyboard.
- **Color philosophy:** ivory and sand create a tactile textile-paper base; burgundy is the ownable action color; olive/ink signals trust and manufacturing discipline.
- **Layout paradigm:** a horizontal product rail rather than a vertical list, with the active card fully readable and adjacent cards intentionally peeking into view.
- **Signature elements:** thin gold rule/eyebrow, rounded editorial card corners, burgundy pill/arrow controls, and a four-dot carousel indicator.
- **Interaction philosophy:** swipe/drag or arrows move one card at a time; active state is clear; reduced-motion users get a non-animated transition.
- **Animation:** short ease-out card translation and opacity only; no autoplay that steals focus; pause/disable movement when reduced motion is requested.
- **Typography:** existing serif display face for product titles, existing sans for metadata/body; large title, compact category index, readable description, one burgundy CTA.
- **Brand essence:** Bismillah Textiles is a vertically integrated textile manufacturer for brands, retailers, hospitality and apparel partners — composed, capable, dependable.
- **Brand voice:** factual and confident, e.g. “Built around the way you buy.” and “Made with control from yarn to finished textile.”
- **Signature brand color:** deep Bismillah burgundy.

## Implementation structure

- `artifacts/bismillah-textiles/src/pages/product-catalog.tsx`: carousel state, managed image assignment, accessible controls.
- `artifacts/bismillah-textiles/src/pages/product-catalog.css` and `src/site-enhancements.css`: responsive reference-led card rail.
- `artifacts/bismillah-textiles/src/pages/admin-panel.tsx` and `admin-panel.css`: media library, file pickers, upload status, product assignment and asset management.
- `cloudflare-api/src/index.js`: authenticated media upload/read/delete routes, product image assignment, R2 object streaming, strict validation and security headers.
- `cloudflare-api/wrangler.jsonc`: preserve D1/R2 bindings and allowed production origin.
- D1 migration: media records and asset references, preserving current products/categories/pages.
- R2 bucket: `bismillah-textiles-media`, private; no public bucket URL.

## Delivery

Commit source changes to GitHub, deploy the Worker through the connected Cloudflare account, let GitHub/Vercel produce the production frontend deployment, and verify API health, public product image behavior, authenticated admin responses, upload validation and public routes. Do not touch the official custom domain or DNS.
