import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(appDir, 'dist', 'public');
const template = await readFile(path.join(outputDir, 'index.html'), 'utf8');
const metadata = JSON.parse(await readFile(path.join(appDir, 'src', 'page-metadata.json'), 'utf8'));
const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function replaceTag(html, prefix, replacement) {
  const start = html.indexOf(prefix);
  if (start < 0) throw new Error('Missing HTML tag: ' + prefix);
  const end = html.indexOf('>', start);
  if (end < 0) throw new Error('Unclosed HTML tag: ' + prefix);
  return html.slice(0, start) + replacement + html.slice(end + 1);
}
for (const [route, page] of Object.entries(metadata.pages)) {
  if (route === '/404/') continue;
  const canonical = new URL(route, metadata.siteOrigin).toString();
  const image = new URL('/share.png', metadata.siteOrigin).toString();
  let html = template;
  const titleStart = html.indexOf('<title>');
  const titleEnd = html.indexOf('</title>', titleStart) + '</title>'.length;
  html = html.slice(0, titleStart) + '<title>' + escapeAttribute(page.title) + '</title>' + html.slice(titleEnd);
  html = replaceTag(html, '<meta name="description"', '<meta name="description" content="' + escapeAttribute(page.description) + '" />');
  html = replaceTag(html, '<meta name="robots"', '<meta name="robots" content="' + escapeAttribute(page.robots ?? 'index, follow') + '" />');
  html = replaceTag(html, '<meta property="og:title"', '<meta property="og:title" content="' + escapeAttribute(page.title) + '" />');
  html = replaceTag(html, '<meta property="og:description"', '<meta property="og:description" content="' + escapeAttribute(page.description) + '" />');
  html = replaceTag(html, '<meta property="og:url"', '<meta property="og:url" content="' + escapeAttribute(canonical) + '" />');
  html = replaceTag(html, '<meta property="og:image"', '<meta property="og:image" content="' + escapeAttribute(image) + '" />');
  html = replaceTag(html, '<meta name="twitter:title"', '<meta name="twitter:title" content="' + escapeAttribute(page.title) + '" />');
  html = replaceTag(html, '<meta name="twitter:description"', '<meta name="twitter:description" content="' + escapeAttribute(page.description) + '" />');
  html = replaceTag(html, '<meta name="twitter:image"', '<meta name="twitter:image" content="' + escapeAttribute(image) + '" />');
  html = replaceTag(html, '<link rel="canonical"', '<link rel="canonical" href="' + escapeAttribute(canonical) + '" />');
  const destination = route === '/' ? path.join(outputDir, 'index.html') : path.join(outputDir, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
console.log('Generated route-specific HTML metadata for ' + Object.keys(metadata.pages).filter((route) => route !== '/404/').length + ' pages.');
