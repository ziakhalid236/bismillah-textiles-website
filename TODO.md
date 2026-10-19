# Bismillah Textiles — Approved Delivery TODO

## 1. Reference-led homepage product carousel

- [ ] Replace the current product showcase with an image-first horizontal carousel matching the supplied mobile reference: one dominant product card, the next card visibly peeking on the right, left/right controls, pagination dots, and responsive behavior.
- [ ] Keep product cards free of prices, currency, shopping bags, carts, and commerce UI.
- [ ] Preserve buyer-facing product title, category/index, short description, and a product-details action.
- [ ] Support touch swipe/drag, arrow buttons, keyboard focus/arrow navigation, accessible labels, and reduced-motion behavior.

## 2. Secure admin authentication

- [ ] Keep the admin login page with username and password fields.
- [ ] Authenticate only through Cloudflare Worker secrets; do not commit, print, or expose credentials.
- [ ] Preserve secure HttpOnly, Secure, SameSite=None session cookies for the HTTPS Vercel-to-Cloudflare deployment.
- [ ] Return generic authentication errors and reject disallowed origins.

## 3. Direct gallery media management

- [ ] Add an authenticated admin media library with direct file selection/upload rather than URL-only image assignment.
- [ ] Store product images, certificates, brand logos, and other approved media in the private R2 bucket `bismillah-textiles-media`.
- [ ] Add media metadata and references in D1, including media type, object key, MIME type, size, checksum/identifier, created time, and publish/use state.
- [ ] Allow product image assignment and certificate/logo asset assignment from the gallery.
- [ ] Add authenticated delete/unassign operations with safe object-key validation.
- [ ] Enforce allowed image/document MIME types, bounded file size, generated server-side object keys, and no executable uploads.

## 4. Public media delivery and content safety

- [ ] Stream only referenced/published media through Worker routes; do not make the R2 bucket public.
- [ ] Add safe cache and content-disposition/content-type headers for public media.
- [ ] Keep public product data limited to published records and referenced media.
- [ ] Keep the official custom domain and DNS untouched.

## 5. Production delivery

- [ ] Run typecheck/build and source hygiene checks.
- [ ] Commit and push the completed implementation to GitHub.
- [ ] Deploy the Cloudflare Worker and apply the D1 migration without deleting existing content.
- [ ] Deploy the frontend through the existing Vercel GitHub integration.
- [ ] Verify health, CORS, public products, admin unauthenticated behavior, upload rejection rules, route rendering, and the production deployment record.
