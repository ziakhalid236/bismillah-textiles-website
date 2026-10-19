const COOKIE_NAME = 'btl_admin_session';
const SESSION_MS = 8 * 60 * 60 * 1000;
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
const MEDIA_KINDS = new Set(['product', 'certificate', 'brand', 'site']);
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
const CERTIFICATE_TYPES = new Set([...IMAGE_TYPES, 'application/pdf']);

function origins(env) {
  return (env.ALLOWED_ORIGINS || 'https://bismillah-textiles-website.vercel.app')
    .split(',').map((value) => value.trim()).filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = origin && origins(env).includes(origin) ? origin : null;
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Vary': 'Origin',
  };
  if (allowed) headers['Access-Control-Allow-Origin'] = allowed;
  return headers;
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

function json(data, status = 200, request, env, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...securityHeaders(), ...corsHeaders(request, env), ...extra },
  });
}

function error(message, status, request, env) { return json({ message }, status, request, env); }

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomToken() {
  return `${crypto.randomUUID()}${crypto.randomUUID().replaceAll('-', '')}`;
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.get('Cookie') || '').split(';').map((part) => {
    const index = part.indexOf('=');
    return index < 0 ? [part.trim(), ''] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function cookieHeader(token, maxAge) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/api/admin; HttpOnly; Secure; SameSite=None`;
}

function requestOriginAllowed(request, env) {
  const origin = request.headers.get('Origin');
  return !origin || origins(env).includes(origin);
}

function productFromRow(row) {
  return { id: row.id, name: row.name, sku: row.sku, category: row.category, status: row.status, description: row.description, imageUrl: row.image_url || '', updated: row.updated_at };
}

function categoryFromRow(row) {
  return { id: row.id, name: row.name, description: row.description, active: Boolean(row.active), updated: row.updated_at };
}

function pageFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    path: row.path,
    summary: row.summary,
    body: row.body,
    heroImageUrl: row.hero_image_url || '',
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    status: row.status,
    updated: row.updated_at,
  };
}

function publicMediaUrl(request, id) {
  return `${new URL(request.url).origin}/api/public/media/file/${encodeURIComponent(id)}`;
}

function mediaFromRow(row, request) {
  return {
    id: row.id,
    kind: row.kind,
    label: row.label || row.original_name,
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    status: row.status,
    url: publicMediaUrl(request, row.id),
    updated: row.updated_at,
  };
}

async function body(request) {
  try { return await request.json(); } catch (parseError) { return null; }
}

function validStatus(value) { return value === 'Published' || value === 'Draft'; }
function text(value, max = 20000) { return typeof value === 'string' && value.trim().length > 0 && value.length <= max; }
function validPath(value) { return typeof value === 'string' && /^\/[a-z0-9/-]*$/i.test(value) && value.length <= 200; }
function validKind(value) { return MEDIA_KINDS.has(value); }
function mediaTypeAllowed(kind, mimeType) { return kind === 'certificate' ? CERTIFICATE_TYPES.has(mimeType) : IMAGE_TYPES.has(mimeType); }

function extensionFor(mimeType, originalName) {
  const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'application/pdf': 'pdf' };
  return map[mimeType] || originalName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
}

async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || typeof encoded !== 'string') return false;
  const [algorithm, iterationsText, saltText, expectedText] = encoded.split('$');
  if (algorithm !== 'pbkdf2-sha256') return false;
  const iterations = Number(iterationsText);
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000) return false;
  try {
    const salt = Uint8Array.from(atob(saltText.replaceAll('-', '+').replaceAll('_', '/')), (char) => char.charCodeAt(0));
    const expected = Uint8Array.from(atob(expectedText.replaceAll('-', '+').replaceAll('_', '/')), (char) => char.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
    const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, expected.length * 8));
    if (actual.length !== expected.length) return false;
    return actual.every((byte, index) => byte === expected[index]);
  } catch (verificationError) { return false; }
}

async function session(request, env) {
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return null;
  const hash = await sha256(token);
  return env.DB.prepare('SELECT username, expires_at FROM admin_sessions WHERE token_hash = ? AND expires_at > ?').bind(hash, new Date().toISOString()).first();
}

async function requireSession(request, env) {
  const current = await session(request, env);
  return current || null;
}

async function publicMediaList(request, env, kind) {
  if (!validKind(kind)) return error('A valid media kind is required.', 400, request, env);
  const { results } = await env.DB.prepare("SELECT * FROM media_assets WHERE kind = ? AND status = 'Published' ORDER BY updated_at DESC").bind(kind).all();
  return json(results.map((row) => mediaFromRow(row, request)), 200, request, env, { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' });
}

async function publicMediaFile(request, env, id) {
  const row = await env.DB.prepare("SELECT * FROM media_assets WHERE id = ? AND status = 'Published' LIMIT 1").bind(id).first();
  if (!row) return error('Media not found.', 404, request, env);
  const object = await env.MEDIA?.get(row.object_key);
  if (!object) return error('Media file not found.', 404, request, env);
  return new Response(object.body, {
    status: 200,
    headers: {
      ...securityHeaders(),
      ...corsHeaders(request, env),
      'Content-Type': row.mime_type,
      'Content-Length': String(row.size_bytes),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="${(row.original_name || 'media').replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
    },
  });
}

async function publicRoute(request, env, path) {
  if (path === '/api/public/products') {
    const { results } = await env.DB.prepare("SELECT * FROM products WHERE status = 'Published' ORDER BY name ASC").all();
    return json(results.map(productFromRow), 200, request, env, { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' });
  }
  if (path === '/api/public/categories') {
    const { results } = await env.DB.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY name ASC').all();
    return json(results.map(categoryFromRow), 200, request, env, { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' });
  }
  if (path === '/api/public/pages') {
    const pagePath = new URL(request.url).searchParams.get('path');
    if (!validPath(pagePath)) return error('A valid page path is required.', 400, request, env);
    const row = await env.DB.prepare("SELECT * FROM site_pages WHERE path = ? AND status = 'Published' LIMIT 1").bind(pagePath).first();
    return row ? json(pageFromRow(row), 200, request, env, { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' }) : error('Published page not found.', 404, request, env);
  }
  if (path === '/api/public/media') return publicMediaList(request, env, new URL(request.url).searchParams.get('kind'));
  const publicMediaMatch = path.match(/^\/api\/public\/media\/file\/([^/]+)$/);
  if (publicMediaMatch && request.method === 'GET') return publicMediaFile(request, env, decodeURIComponent(publicMediaMatch[1]));
  return error('Not found.', 404, request, env);
}

async function adminRoute(request, env, path) {
  if (path === '/api/admin/auth/login' && request.method === 'POST') {
    if (!requestOriginAllowed(request, env)) return error('Request origin is not allowed.', 403, request, env);
    const input = await body(request);
    const valid = input && text(input.username, 120) && typeof input.password === 'string' && input.password.length > 0;
    if (!valid || !env.ADMIN_USERNAME || (!env.ADMIN_PASSWORD && !env.ADMIN_PASSWORD_HASH)) return error('Admin authentication is not configured.', 503, request, env);
    const passwordOk = env.ADMIN_PASSWORD ? input.password === env.ADMIN_PASSWORD : await verifyPassword(input.password, env.ADMIN_PASSWORD_HASH);
    const ok = input.username.trim() === env.ADMIN_USERNAME && passwordOk;
    if (!ok) return error('Username or password is incorrect.', 401, request, env);
    const token = randomToken();
    const expiresAt = new Date(Date.now() + SESSION_MS).toISOString();
    await env.DB.prepare('INSERT INTO admin_sessions (token_hash, username, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), env.ADMIN_USERNAME, expiresAt).run();
    return json({ username: env.ADMIN_USERNAME, expiresAt }, 200, request, env, { 'Set-Cookie': cookieHeader(token, SESSION_MS / 1000) });
  }
  if (path === '/api/admin/auth/session' && request.method === 'GET') {
    const current = await session(request, env);
    return current ? json({ username: current.username }, 200, request, env) : error('Authentication required.', 401, request, env);
  }
  if (path === '/api/admin/auth/logout' && request.method === 'POST') {
    if (!requestOriginAllowed(request, env)) return error('Request origin is not allowed.', 403, request, env);
    const token = parseCookies(request)[COOKIE_NAME];
    if (token) await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    return new Response(null, { status: 204, headers: { ...securityHeaders(), ...corsHeaders(request, env), 'Set-Cookie': cookieHeader('', 0) } });
  }

  const current = await requireSession(request, env);
  if (!current) return error('Authentication required.', 401, request, env);
  if (!requestOriginAllowed(request, env)) return error('Request origin is not allowed.', 403, request, env);

  if (path === '/api/admin/media' && request.method === 'GET') {
    const kind = new URL(request.url).searchParams.get('kind');
    const query = validKind(kind) ? env.DB.prepare('SELECT * FROM media_assets WHERE kind = ? ORDER BY updated_at DESC').bind(kind) : env.DB.prepare('SELECT * FROM media_assets ORDER BY updated_at DESC');
    const { results } = await query.all();
    return json(results.map((row) => mediaFromRow(row, request)), 200, request, env);
  }

  if (path === '/api/admin/media' && request.method === 'POST') {
    if (!env.MEDIA) return error('Media storage is not configured.', 503, request, env);
    const form = await request.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') || '');
    const label = String(form.get('label') || '').trim();
    const status = String(form.get('status') || 'Published');
    if (!(file instanceof File) || !validKind(kind) || !mediaTypeAllowed(kind, file.type) || !Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_MEDIA_BYTES || !validStatus(status)) return error('File, media type, status or size is invalid.', 400, request, env);
    const id = crypto.randomUUID();
    const originalName = file.name || 'upload';
    const objectKey = `${kind}/${id}.${extensionFor(file.type, originalName)}`;
    const now = new Date().toISOString();
    try {
      await env.MEDIA.put(objectKey, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
      await env.DB.prepare('INSERT INTO media_assets (id,kind,object_key,original_name,label,mime_type,size_bytes,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id, kind, objectKey, originalName, label || originalName, file.type, file.size, status, now, now).run();
    } catch (uploadError) {
      await env.MEDIA.delete(objectKey).catch(() => undefined);
      return error('Media upload could not be saved.', 500, request, env);
    }
    return json(mediaFromRow(await env.DB.prepare('SELECT * FROM media_assets WHERE id = ?').bind(id).first(), request), 201, request, env);
  }

  const mediaMatch = path.match(/^\/api\/admin\/media\/([^/]+)$/);
  if (mediaMatch && request.method === 'PUT') {
    const id = decodeURIComponent(mediaMatch[1]);
    const input = await body(request);
    if (!input || (input.label !== undefined && (!text(input.label, 160))) || !validStatus(input.status)) return error('Media metadata is invalid.', 400, request, env);
    const result = await env.DB.prepare('UPDATE media_assets SET label=?,status=?,updated_at=? WHERE id=?').bind(input.label.trim(), input.status, new Date().toISOString(), id).run();
    if (!result.meta.changes) return error('Media not found.', 404, request, env);
    return json(mediaFromRow(await env.DB.prepare('SELECT * FROM media_assets WHERE id = ?').bind(id).first(), request), 200, request, env);
  }
  if (mediaMatch && request.method === 'DELETE') {
    const id = decodeURIComponent(mediaMatch[1]);
    const row = await env.DB.prepare('SELECT * FROM media_assets WHERE id = ?').bind(id).first();
    if (!row) return error('Media not found.', 404, request, env);
    await env.DB.prepare("UPDATE products SET image_url = '', updated_at = ? WHERE image_url LIKE ?").bind(new Date().toISOString(), `%/api/public/media/file/${encodeURIComponent(id)}`).run();
    await env.MEDIA?.delete(row.object_key);
    await env.DB.prepare('DELETE FROM media_assets WHERE id = ?').bind(id).run();
    return json({ deleted: true, id }, 200, request, env);
  }

  const input = await body(request);
  if (path === '/api/admin/products' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY name ASC').all();
    return json(results.map(productFromRow), 200, request, env);
  }
  if (path === '/api/admin/products' && request.method === 'POST') {
    if (!input || !text(input.id, 80) || !text(input.name, 160) || !text(input.sku, 80) || !text(input.category, 120) || !validStatus(input.status) || typeof input.description !== 'string' || input.description.length > 4000 || (input.imageUrl !== undefined && (!text(input.imageUrl, 2000) || !input.imageUrl.trim().toLowerCase().startsWith('https://')))) return error('Product data is invalid.', 400, request, env);
    const now = new Date().toISOString();
    try { await env.DB.prepare('INSERT INTO products (id,name,sku,category,status,description,image_url,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(input.id.trim(), input.name.trim(), input.sku.trim(), input.category.trim(), input.status, input.description, input.imageUrl?.trim() || '', now, now).run(); } catch (insertError) { return error('A record with that SKU already exists.', 409, request, env); }
    return json(productFromRow(await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(input.id.trim()).first()), 201, request, env);
  }
  const productMatch = path.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (productMatch && request.method === 'PUT') {
    if (!input || !text(input.name, 160) || !text(input.sku, 80) || !text(input.category, 120) || !validStatus(input.status) || typeof input.description !== 'string' || input.description.length > 4000 || (input.imageUrl !== undefined && (!text(input.imageUrl, 2000) || !input.imageUrl.trim().toLowerCase().startsWith('https://')))) return error('Product data is invalid.', 400, request, env);
    const id = decodeURIComponent(productMatch[1]);
    try { const result = await env.DB.prepare('UPDATE products SET name=?,sku=?,category=?,status=?,description=?,image_url=?,updated_at=? WHERE id=?').bind(input.name.trim(), input.sku.trim(), input.category.trim(), input.status, input.description, input.imageUrl?.trim() || '', new Date().toISOString(), id).run(); if (!result.meta.changes) return error('Product not found.', 404, request, env); } catch (updateError) { return error('A record with that SKU already exists.', 409, request, env); }
    return json(productFromRow(await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()), 200, request, env);
  }

  if (path === '/api/admin/categories' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    return json(results.map(categoryFromRow), 200, request, env);
  }
  if (path === '/api/admin/categories' && request.method === 'POST') {
    if (!input || !text(input.id, 80) || !text(input.name, 120) || typeof input.description !== 'string' || input.description.length > 2000 || typeof input.active !== 'boolean') return error('Category data is invalid.', 400, request, env);
    const now = new Date().toISOString();
    try { await env.DB.prepare('INSERT INTO categories (id,name,description,active,created_at,updated_at) VALUES (?,?,?,?,?,?)').bind(input.id.trim(), input.name.trim(), input.description, input.active ? 1 : 0, now, now).run(); } catch (insertError) { return error('A category with that name already exists.', 409, request, env); }
    return json(categoryFromRow(await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(input.id.trim()).first()), 201, request, env);
  }
  const categoryMatch = path.match(/^\/api\/admin\/categories\/([^/]+)$/);
  if (categoryMatch && request.method === 'PUT') {
    if (!input || !text(input.name, 120) || typeof input.description !== 'string' || input.description.length > 2000 || typeof input.active !== 'boolean') return error('Category data is invalid.', 400, request, env);
    const id = decodeURIComponent(categoryMatch[1]);
    const previous = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
    if (!previous) return error('Category not found.', 404, request, env);
    const now = new Date().toISOString();
    try { await env.DB.batch([env.DB.prepare('UPDATE categories SET name=?,description=?,active=?,updated_at=? WHERE id=?').bind(input.name.trim(), input.description, input.active ? 1 : 0, now, id), env.DB.prepare('UPDATE products SET category=?,updated_at=? WHERE category=?').bind(input.name.trim(), now, previous.name)]); } catch (updateError) { return error('A category with that name already exists.', 409, request, env); }
    return json(categoryFromRow(await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first()), 200, request, env);
  }

  if (path === '/api/admin/pages' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM site_pages ORDER BY title ASC').all();
    return json(results.map(pageFromRow), 200, request, env);
  }
  if (path === '/api/admin/pages' && request.method === 'POST') {
    if (!input || !text(input.id, 80) || !text(input.title, 160) || !validPath(input.path) || typeof input.summary !== 'string' || input.summary.length > 1000 || typeof input.body !== 'string' || input.body.length > 20000 || !validStatus(input.status) || (input.heroImageUrl !== undefined && input.heroImageUrl !== '' && !input.heroImageUrl.startsWith('https://')) || typeof (input.seoTitle ?? '') !== 'string' || typeof (input.seoDescription ?? '') !== 'string') return error('Page data is invalid.', 400, request, env);
    const now = new Date().toISOString();
    try { await env.DB.prepare('INSERT INTO site_pages (id,title,path,summary,body,hero_image_url,seo_title,seo_description,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(input.id.trim(), input.title.trim(), input.path, input.summary, input.body, input.heroImageUrl?.trim() || '', input.seoTitle?.trim() || '', input.seoDescription?.trim() || '', input.status, now, now).run(); } catch (insertError) { return error('A page with that path already exists.', 409, request, env); }
    return json(pageFromRow(await env.DB.prepare('SELECT * FROM site_pages WHERE id = ?').bind(input.id.trim()).first()), 201, request, env);
  }
  const pageMatch = path.match(/^\/api\/admin\/pages\/([^/]+)$/);
  if (pageMatch && request.method === 'PUT') {
    if (!input || !text(input.title, 160) || !validPath(input.path) || typeof input.summary !== 'string' || input.summary.length > 1000 || typeof input.body !== 'string' || input.body.length > 20000 || !validStatus(input.status) || (input.heroImageUrl !== undefined && input.heroImageUrl !== '' && !input.heroImageUrl.startsWith('https://')) || typeof (input.seoTitle ?? '') !== 'string' || typeof (input.seoDescription ?? '') !== 'string') return error('Page data is invalid.', 400, request, env);
    const id = decodeURIComponent(pageMatch[1]);
    try { const result = await env.DB.prepare('UPDATE site_pages SET title=?,path=?,summary=?,body=?,hero_image_url=?,seo_title=?,seo_description=?,status=?,updated_at=? WHERE id=?').bind(input.title.trim(), input.path, input.summary, input.body, input.heroImageUrl?.trim() || '', input.seoTitle?.trim() || '', input.seoDescription?.trim() || '', input.status, new Date().toISOString(), id).run(); if (!result.meta.changes) return error('Page not found.', 404, request, env); } catch (updateError) { return error('A page with that path already exists.', 409, request, env); }
    return json(pageFromRow(await env.DB.prepare('SELECT * FROM site_pages WHERE id = ?').bind(id).first()), 200, request, env);
  }
  return error('Not found.', 404, request, env);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...securityHeaders(), ...corsHeaders(request, env) } });
    const url = new URL(request.url);
    if (url.pathname === '/api/healthz') return json({ ok: true, service: 'bismillah-textiles-admin-api', database: Boolean(env.DB), media: Boolean(env.MEDIA) }, 200, request, env);
    try {
      if (url.pathname.startsWith('/api/public/')) return await publicRoute(request, env, url.pathname);
      if (url.pathname.startsWith('/api/admin/')) return await adminRoute(request, env, url.pathname);
      return error('Not found.', 404, request, env);
    } catch (caught) {
      console.error(caught);
      return error('Internal server error.', 500, request, env);
    }
  },
};
