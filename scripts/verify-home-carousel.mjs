import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../artifacts/bismillah-textiles/src/App.tsx', import.meta.url), 'utf8');
const css = await readFile(new URL('../artifacts/bismillah-textiles/src/site-enhancements.css', import.meta.url), 'utf8');

const requiredAppMarkers = [
  'home-product-carousel',
  'home-product-carousel-viewport',
  'home-product-track',
  'home-product-card is-active',
  'Previous featured product',
  'Next featured product',
  'home-product-pagination',
];
const requiredCssMarkers = [
  '.home-product-carousel{',
  '.home-product-carousel-viewport{',
  '.home-product-track{display:flex',
  '.home-product-card{display:flex',
  '.home-product-card.is-active{',
  '@media(max-width:640px)',
  '@media(prefers-reduced-motion:reduce)',
];

const missingApp = requiredAppMarkers.filter((marker) => !app.includes(marker));
const missingCss = requiredCssMarkers.filter((marker) => !css.includes(marker));
if (missingApp.length || missingCss.length) {
  console.error('Homepage carousel regression check failed.');
  if (missingApp.length) console.error(`Missing App markers: ${missingApp.join(', ')}`);
  if (missingCss.length) console.error(`Missing CSS markers: ${missingCss.join(', ')}`);
  process.exit(1);
}
console.log('Homepage carousel regression check passed.');
