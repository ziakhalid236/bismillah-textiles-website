# Bismillah Textiles website audit notes

## External references

- GitHub OAuth scopes: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
- GitHub CLI quickstart: https://docs.github.com/github-cli/github-cli/quickstart
- GitHub personal access tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

## Vercel verification

- Project: `bismillah-textiles-website`
- Project ID: `prj_XzZw6k459eq1HPrh7eRzaFXceAn3`
- Linked GitHub repository in deployment metadata: `ziakhalid236/bismillah-textiles-website`
- Failed deployment at commit `e4bed26830373f9adb8ae0fa8e85d24a097eb7ba`: `lint_or_type_error` in `artifacts/api-server/src/app.ts` and related imports.
- New deployment at commit `7732f7b7af75ebd6d93238d32a732db48eb418f6`: `BLOCKED` by Vercel account configuration, not by a build error.
- Existing public URL served static pages successfully, but `/api/healthz` returned 404 because the previous deployment did not include the API function.

## Local verification

- `pnpm run typecheck`: passed after the deployment fixes.
- `pnpm run build:vercel`: passed and produced `artifacts/api-server/dist/vercel.mjs`.
