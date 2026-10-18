# Bismillah Textiles Admin API

Cloudflare Worker API for the Vercel-hosted Bismillah Textiles frontend.

## Bindings

- `DB`: Cloudflare D1 database `bismillah-textiles-admin`
- `MEDIA`: reserved for the R2 media bucket after R2 is enabled in the Cloudflare Dashboard

## Required Worker secrets

The API intentionally does not ship with a default admin password. Configure these secrets in Cloudflare before using `/admin`:

```bash
wrangler secret put ADMIN_USERNAME
wrangler secret put ADMIN_PASSWORD_HASH
```

`ADMIN_PASSWORD_HASH` format:

```text
pbkdf2-sha256$600000$<base64url-salt>$<base64url-derived-key>
```

The Worker allows the Vercel production origin through `ALLOWED_ORIGINS` and uses secure, HttpOnly, cross-site cookies for the admin session.

## API routes

- `GET /api/healthz`
- `GET /api/public/products`
- `GET /api/public/categories`
- `GET /api/public/pages?path=/about-us/`
- `POST /api/admin/auth/login`
- `GET /api/admin/auth/session`
- `POST /api/admin/auth/logout`
- Admin CRUD for `/api/admin/products`, `/categories`, and `/pages`

R2 upload support is intentionally separate because this Cloudflare account currently reports R2 as not enabled. Once enabled, add an R2 bucket binding named `MEDIA` and add authenticated upload/delete routes rather than exposing the bucket publicly.
