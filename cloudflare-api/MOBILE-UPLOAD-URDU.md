# Bismillah Textiles — موبائل سے Cloudflare Worker upload کرنے کی ہدایات

## آپ کو کون سی file upload کرنی ہے؟

اس package میں اصل Worker file یہ ہے:

```text
src/index.js
```

Cloudflare Dashboard کے code editor میں اسی file کا مکمل code paste کریں۔ `wrangler.jsonc` configuration reference کے لیے ہے؛ اسے Worker code editor میں paste نہ کریں۔

## Cloudflare Dashboard میں کہاں جانا ہے؟

1. موبائل browser میں `dash.cloudflare.com` کھولیں اور اپنے Cloudflare account میں login کریں۔
2. **Workers & Pages** کھولیں۔
3. Worker `bismillah-textiles-admin-api` منتخب کریں۔ اگر Worker نظر نہ آئے تو **Create application → Workers → Create Worker** سے یہی نام استعمال کریں۔
4. **Edit code** یا **Edit Code** کھولیں۔
5. موجودہ code مکمل select/delete کریں۔
6. اس package کے `src/index.js` کی مکمل contents paste کریں۔
7. **Save and deploy** دبائیں۔

اگر Dashboard upload file کا option دے تو `src/index.js` upload کریں۔ اگر upload option نہ آئے تو file کو text editor میں کھول کر پورا code copy/paste کرنا درست طریقہ ہے۔

## D1 binding

Worker Settings → Variables and Bindings → D1 Database میں یہ binding add کریں:

- Variable name: `DB`
- Database: `bismillah-textiles-admin`

## R2 binding

اسی جگہ R2 Bucket میں یہ binding add کریں:

- Variable name: `MEDIA`
- Bucket: `bismillah-textiles-media`

## Public variable

Variables میں یہ non-secret variable add کریں:

- Name: `ALLOWED_ORIGINS`
- Value: `https://bismillah-textiles-website.vercel.app`

## Admin secrets

Secrets کے طور پر یہ دو values add کریں:

- `ADMIN_USERNAME`: اپنا admin username
- `ADMIN_PASSWORD_HASH`: password کا PBKDF2 hash

اہم: اپنا password GitHub، chat یا عام variable میں نہ رکھیں۔ صرف Cloudflare Secret کے طور پر save کریں۔ اس package میں کوئی default password شامل نہیں ہے۔

## Deploy کے بعد test

یہ URL کھولیں:

```text
https://bismillah-textiles-admin-api.ziakhalid236.workers.dev/api/healthz
```

Expected response:

```json
{"ok":true,"service":"bismillah-textiles-admin-api","database":true}
```

اس کے بعد Vercel میں یہ variable Production environment کے لیے add کریں:

```text
VITE_API_BASE_URL=https://bismillah-textiles-admin-api.ziakhalid236.workers.dev
```

Type: `Config` منتخب کریں، `Secret` نہیں۔ پھر Vercel پر نیا production deployment کریں۔

## اہم احتیاط

صرف اسی Cloudflare account میں upload کریں جس میں یہ D1 database اور R2 bucket موجود ہیں۔ غلط account میں upload کرنے سے `DB` اور `MEDIA` bindings کام نہیں کریں گی۔
