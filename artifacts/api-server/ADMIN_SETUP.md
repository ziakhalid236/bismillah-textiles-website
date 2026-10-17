# Admin API Setup

The admin API uses PostgreSQL via the existing Drizzle package. It does not provide a default account or password. Configure credentials and origins explicitly before starting the API.

## Local setup

1. Provision a PostgreSQL database and export `DATABASE_URL` in the shell running the API.
2. Generate a password hash in an interactive terminal:

   ```sh
   pnpm --filter @workspace/api-server admin:hash-password
   ```

   The password is entered without terminal echo. Store the resulting hash as `ADMIN_PASSWORD_HASH`; do not store the plaintext password in the repository.
3. Export `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_APP_ORIGINS`. For local Vite use `ADMIN_APP_ORIGINS=http://localhost:5000`; add the exact Codespaces forwarded origin when using its browser URL.
4. Create the tables and start the API:

   ```sh
   pnpm --filter @workspace/db push
   pnpm --filter @workspace/api-server db:seed-admin
   PORT=3000 pnpm --filter @workspace/api-server dev
   ```
The admin API accepts browser requests only from exact origins in `ADMIN_APP_ORIGINS`, requires an allowed `Origin` on sign-in and state-changing auth requests, limits sign-in attempts, and stores only a hash of each random session token in PostgreSQL. Production cookies are `HttpOnly`, `Secure`, and `SameSite=None` for a separately hosted API; HTTPS is mandatory. Prefer hosting the API on a subdomain of the website's custom domain to keep the browser requests same-site.

5. In a second terminal, start the Vite site with `pnpm --filter @workspace/bismillah-textiles dev`. Vite proxies `/api` to `http://127.0.0.1:3000` by default. Set `API_PROXY_TARGET` to override that target.

## Production deployment

The repository includes a Vercel function at `api/[...path].ts` that serves the Express API on the same origin as the static website. In Vercel, configure `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_APP_ORIGINS` as Production environment variables. Set `ADMIN_APP_ORIGINS` to the exact website origin, for example `https://bismillah-textiles-website.vercel.app`. Configure the production `DATABASE_URL` locally, run `pnpm --filter @workspace/db push` once to create tables, then seed with `pnpm --filter @workspace/api-server db:seed-admin`. Redeploy the website after the Vercel variables are saved. Keep `VITE_API_BASE_URL` unset so browser requests use same-origin `/api` routes. Do not commit database URLs, password hashes, or plaintext passwords.

If you instead host the API separately, configure `VITE_API_BASE_URL` to its HTTPS origin and add that origin to the website's Content-Security-Policy `connect-src` directive in `vercel.json`.

The API accepts browser requests only from exact origins in `ADMIN_APP_ORIGINS`, requires an allowed `Origin` on sign-in and state-changing auth requests, limits sign-in attempts, and stores only a hash of each random session token in PostgreSQL. Production cookies are `HttpOnly`, `Secure`, and `SameSite=None` for a separately hosted API; HTTPS is mandatory.

Admin records and publication status are persisted by the API. The current public React pages still render their existing bundled content; connecting published database records to public product/page rendering is a separate migration step and is not implied by the admin's saved status.