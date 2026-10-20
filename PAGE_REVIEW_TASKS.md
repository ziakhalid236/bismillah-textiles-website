# Bismillah Textiles — Page Review Task Board

Each page is reviewed against the same acceptance criteria: live preview, source code, desktop layout, mobile layout, card hierarchy, image loading, accessibility, internal/external links, build and deployment verification.

## Task sequence

- [x] Home `/` — statistic cards, product carousel, story cards, directory cards, partner/certification cards. Initial fixes applied and proof cards refined.
- [x] About Us `/about-us/` — hero, CEO card, values, R&D, team cards. Audit complete; no blocking card defect found.
- [x] Manufacturing Facilities `/manufacturing-facilities/` — facility/process cards, feature image, process gallery. Audit complete; existing layout verified.
- [x] Brands & Retailers `/brands-retailers/` — partner logo cards and responsive grids. Audit complete; existing layout verified.
- [x] Products `/products/` — product-area cards, catalog cards, filters, mobile rail, modal, partners and CTAs. Focused catalog card redesign applied and locally verified.
- [ ] Careers `/careers/` — career callout, fact cards, CTA and route verification.
- [x] Contact `/contact-us/` — contact cards, map, certification preview cards and links. Shared card fix applied.
- [x] Certifications `/certifications/` — quality story, certification preview cards, validity and PDF links. Shared card fix applied.
- [x] News `/news/` — news cards, read-more controls and insight cards. Shared card fix applied.
- [ ] Markets & Industry Insights `/markets-industry-insights/` — charts, signal cards, event/source cards and mobile overflow.
- [x] International Textile News `/international-news/` — hero panel, five briefing cards and mobile layout. Existing layout verified.

## Completion gate

A page is only marked complete after its code changes pass `pnpm run build:vercel`, `git diff --check`, route checks, and a live preview review after Vercel redeployment.
