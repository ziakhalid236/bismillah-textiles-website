import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * PRODUCT CATALOG
 * ---------------
 * To add or edit a product, change the `products` list below.
 *
 * PHOTOS: put a photo in  src/assets/products/  named after the product id,
 * e.g.  sheet-sets.jpg  (.jpeg / .png / .webp also work). It is picked up automatically
 * when the site is built, no code change needed. If no photo exists for a product,
 * a textile swatch illustration is shown instead.
 */


// Photos found at build time in src/assets/products/ (file name = product id).
const photoModules = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const photos: Record<string, string> = {};
for (const [file, url] of Object.entries(photoModules)) {
  const name = file.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase();
  photos[name] = url;
}

export type CategoryId = 'home' | 'fabric' | 'hospitality' | 'apparel';

type SwatchKind =
  | 'stripe' | 'pintuck' | 'hemstitch' | 'jacquard' | 'matelasse' | 'dobby' | 'plain'
  | 'yarndye' | 'print' | 'quilt' | 'curtain' | 'table' | 'embroidery' | 'upholstery'
  | 'bag' | 'satin' | 'shower';

type Product = {
  id: string;
  category: CategoryId;
  name: string;
  summary: string;
  specs: string[];
  swatch: SwatchKind;
  colors: [string, string, string];
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'home', label: 'Home textiles' },
  { id: 'fabric', label: 'Fabric' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'apparel', label: 'Garments & apparel fabrics' },
];

const products: Product[] = [
  // ---------- HOME TEXTILES ----------
  { id: 'sheet-sets', category: 'home', name: 'Sheet sets', swatch: 'hemstitch', colors: ['#f4ecde', '#c6a66c', '#8d111b'],
    summary: 'Flat sheets, fitted sheets and pillowcases, cut and stitched in-house from our own woven fabric.',
    specs: ['Hemstitch', 'Pintuck', 'Piping', 'Embroidery'] },
  { id: 'comforter-sets', category: 'home', name: 'Comforter sets', swatch: 'quilt', colors: ['#e9e1d5', '#52665e', '#302522'],
    summary: 'Coordinated comforter and pillow sham sets, supported by our quilting and wadding lines.',
    specs: ['Quilted', 'Filled', 'Coordinated sets'] },
  { id: 'bed-in-a-bag', category: 'home', name: 'Bed-in-a-bag', swatch: 'bag', colors: ['#f4ecde', '#8d111b', '#52665e'],
    summary: 'Complete bedding packs, supplied filled or unfilled depending on the programme.',
    specs: ['Filled', 'Unfilled', 'Retail-ready'] },
  { id: 'quilted-wadding', category: 'home', name: 'Quilted & wadded bedding', swatch: 'matelasse', colors: ['#efe8dc', '#b9ab98', '#302522'],
    summary: 'Quilted products made on computerized single-needle and multi-needle continuous quilting machines.',
    specs: ['Computerized quilting', 'In-house wadding'] },
  { id: 'curtains', category: 'home', name: 'Curtains', swatch: 'curtain', colors: ['#52665e', '#e9e1d5', '#302522'],
    summary: 'Window curtains and panels made from our woven, dyed and printed fabrics.',
    specs: ['Woven', 'Printed', 'Embroidered'] },
  { id: 'kitchen-curtains', category: 'home', name: 'Kitchen curtains', swatch: 'table', colors: ['#f4ecde', '#8d111b', '#c6a66c'],
    summary: 'Short-length curtains and tiers for kitchens and small windows.',
    specs: ['Tier & valance styles'] },
  { id: 'shower-curtains', category: 'home', name: 'Shower curtains', swatch: 'shower', colors: ['#dfe6e2', '#52665e', '#302522'],
    summary: 'Fabric shower curtains for bath and home programmes.',
    specs: ['Fabric', 'Printed & woven'] },
  { id: 'table-linen', category: 'home', name: 'Table cloths', swatch: 'table', colors: ['#f7f0e7', '#c6a66c', '#8d111b'],
    summary: 'Table cloths and related table linen in woven and printed designs.',
    specs: ['Woven', 'Printed'] },
  { id: 'embroidered-decor', category: 'home', name: 'Embroidered & decorative accessories', swatch: 'embroidery', colors: ['#f4ecde', '#8d111b', '#c6a66c'],
    summary: 'Decorative home accessories using our high-speed multi-needle embroidery capability.',
    specs: ['Multi-needle embroidery', 'Up to 400 × 1,200 mm'] },

  // ---------- FABRIC ----------
  { id: 'jacquard', category: 'fabric', name: 'Jacquard fabric', swatch: 'jacquard', colors: ['#302522', '#c6a66c', '#e9e1d5'],
    summary: 'Figured woven fabric produced on our air-jet looms.',
    specs: ['Air-jet woven', '120 – 600 thread count'] },
  { id: 'matelasse', category: 'fabric', name: 'Matelassé', swatch: 'matelasse', colors: ['#efe8dc', '#b9ab98', '#302522'],
    summary: 'Raised, quilted-look woven fabric for bedding and decorative use.',
    specs: ['Air-jet woven', 'Home & decor'] },
  { id: 'dobby', category: 'fabric', name: 'Dobby fabric', swatch: 'dobby', colors: ['#f4ecde', '#7a5a1f', '#302522'],
    summary: 'Small geometric woven textures made on dobby looms.',
    specs: ['Air-jet woven', '120 – 600 thread count'] },
  { id: 'plain-weave', category: 'fabric', name: 'Plain weave', swatch: 'plain', colors: ['#f7f0e7', '#d9d0c5', '#8d111b'],
    summary: 'Plain woven base cloth in a wide range of constructions.',
    specs: ['Air-jet woven', '120 – 600 thread count'] },
  { id: 'yarn-dyed', category: 'fabric', name: 'Yarn-dyed fabric', swatch: 'yarndye', colors: ['#8d111b', '#52665e', '#f4ecde'],
    summary: 'Stripes and checks woven from yarn dyed in our own cone-dyeing facility.',
    specs: ['In-house cone dyeing', '180,000 kg / month dyeing capacity'] },
  { id: 'printed-fabric', category: 'fabric', name: 'Printed fabric', swatch: 'print', colors: ['#f4ecde', '#8d111b', '#52665e'],
    summary: 'Fabric printed on rotary printing machines in our processing house.',
    specs: ['Rotary printing', '3 rotary printing machines'] },
  { id: 'dyed-bleached', category: 'fabric', name: 'Dyed & bleached fabric', swatch: 'plain', colors: ['#52665e', '#dfe6e2', '#302522'],
    summary: 'Continuously bleached and dyed cloth from our processing ranges.',
    specs: ['2 bleaching ranges', '2 continuous dyeing ranges'] },
  { id: 'upholstery', category: 'fabric', name: 'Upholstery & decorative fabric', swatch: 'upholstery', colors: ['#52665e', '#c6a66c', '#302522'],
    summary: 'Heavier decorative fabrics for furnishing and soft-furnishing programmes.',
    specs: ['Woven', 'Furnishing'] },

  // ---------- HOSPITALITY ----------
  { id: 'hotel-bed-linen', category: 'hospitality', name: 'Hospitality bed linen', swatch: 'satin', colors: ['#fbf8f2', '#d9d0c5', '#8d111b'],
    summary: 'Bed linen for hospitality customers, made on our weaving and stitching lines.',
    specs: ['Plain & stripe', 'Cut and sew'] },
  { id: 'hotel-curtains', category: 'hospitality', name: 'Hospitality curtains & drapes', swatch: 'curtain', colors: ['#302522', '#c6a66c', '#e9e1d5'],
    summary: 'Curtains and drapes for hospitality projects.',
    specs: ['Made to specification'] },
  { id: 'hotel-quilted', category: 'hospitality', name: 'Quilted bedding for hotels', swatch: 'quilt', colors: ['#f4ecde', '#b9ab98', '#302522'],
    summary: 'Quilted and filled bedding for hotel programmes.',
    specs: ['Quilted', 'Filled'] },

  // ---------- APPAREL ----------
  { id: 'apparel-plain', category: 'apparel', name: 'Apparel fabrics — woven', swatch: 'plain', colors: ['#52665e', '#dfe6e2', '#302522'],
    summary: 'Woven apparel fabrics within our broader textile portfolio.',
    specs: ['Woven', 'Dyed'] },
  { id: 'apparel-print', category: 'apparel', name: 'Apparel fabrics — printed', swatch: 'print', colors: ['#f4ecde', '#7a5a1f', '#8d111b'],
    summary: 'Printed fabrics suited to apparel use.',
    specs: ['Rotary printed'] },
  { id: 'apparel-yarn', category: 'apparel', name: 'Apparel fabrics — yarn-dyed', swatch: 'yarndye', colors: ['#302522', '#c6a66c', '#f4ecde'],
    summary: 'Yarn-dyed checks and stripes for garments.',
    specs: ['Yarn-dyed'] },
  { id: 'garments', category: 'apparel', name: 'Cut-and-sew garments', swatch: 'stripe', colors: ['#f4ecde', '#8d111b', '#302522'],
    summary: 'Cut-and-sew capability from our stitching units, available on request.',
    specs: ['18 stitching units'] },
];

function Swatch({ kind, colors, uid }: { kind: SwatchKind; colors: [string, string, string]; uid: string }) {
  const [a, b, c] = colors;
  const p = 'pat-' + uid;
  const body = (() => {
    switch (kind) {
      case 'stripe':
      case 'satin':
        return (<><defs><pattern id={p} width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill={a} /><rect width="8" height="24" fill={b} opacity={kind === 'satin' ? 0.25 : 1} /><rect x="8" width="1.5" height="24" fill={c} opacity=".5" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'hemstitch':
        return (<><rect width="400" height="300" fill={a} /><rect x="40" y="40" width="320" height="220" fill="none" stroke={b} strokeWidth="2" /><rect x="52" y="52" width="296" height="196" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="3 5" /><rect x="64" y="64" width="272" height="172" fill={b} opacity=".12" /></>);
      case 'pintuck':
        return (<><rect width="400" height="300" fill={a} />{Array.from({ length: 14 }).map((_, i) => <g key={i}><line x1={30 + i * 26} y1="0" x2={30 + i * 26} y2="300" stroke={b} strokeWidth="2" /><line x1={32 + i * 26} y1="0" x2={32 + i * 26} y2="300" stroke="#fff" strokeOpacity=".6" strokeWidth="1" /></g>)}</>);
      case 'jacquard':
        return (<><defs><pattern id={p} width="48" height="48" patternUnits="userSpaceOnUse"><rect width="48" height="48" fill={a} /><path d="M24 4 L44 24 L24 44 L4 24 Z" fill="none" stroke={b} strokeWidth="2" /><path d="M24 14 L34 24 L24 34 L14 24 Z" fill={b} opacity=".55" /><circle cx="0" cy="0" r="4" fill={c} opacity=".5" /><circle cx="48" cy="48" r="4" fill={c} opacity=".5" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'matelasse':
      case 'quilt':
        return (<><defs><pattern id={p} width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="60" height="60" fill={a} /><rect x="2" y="2" width="56" height="56" rx="14" fill={b} opacity=".22" /><rect x="2" y="2" width="56" height="56" rx="14" fill="none" stroke={c} strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="4 3" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'dobby':
        return (<><defs><pattern id={p} width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill={a} /><rect width="8" height="8" fill={b} opacity=".35" /><rect x="8" y="8" width="8" height="8" fill={c} opacity=".35" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'plain':
        return (<><defs><pattern id={p} width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill={a} /><path d="M0 3H6M3 0V6" stroke={b} strokeOpacity=".5" strokeWidth="1" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'yarndye':
        return (<><defs><pattern id={p} width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill={c} /><rect width="60" height="14" y="8" fill={a} opacity=".8" /><rect width="14" height="60" x="8" fill={b} opacity=".7" /><rect width="60" height="3" y="38" fill={a} opacity=".8" /><rect width="3" height="60" x="38" fill={b} opacity=".7" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'print':
        return (<><defs><pattern id={p} width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill={a} /><g fill={b}><circle cx="16" cy="16" r="6" /><circle cx="48" cy="48" r="6" /></g><g fill={c} opacity=".8"><circle cx="16" cy="9" r="3" /><circle cx="16" cy="23" r="3" /><circle cx="9" cy="16" r="3" /><circle cx="23" cy="16" r="3" /><circle cx="48" cy="41" r="3" /><circle cx="48" cy="55" r="3" /><circle cx="41" cy="48" r="3" /><circle cx="55" cy="48" r="3" /></g></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'curtain':
        return (<><rect width="400" height="300" fill={a} />{Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${i * 44} 0 Q${i * 44 + 22} 150 ${i * 44} 300 L${i * 44 + 44} 300 Q${i * 44 + 66} 150 ${i * 44 + 44} 0 Z`} fill={i % 2 ? b : c} opacity=".28" />)}<rect width="400" height="10" fill={c} /></>);
      case 'table':
        return (<><defs><pattern id={p} width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill={a} /><rect width="25" height="25" fill={b} opacity=".25" /><rect x="25" y="25" width="25" height="25" fill={c} opacity=".25" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'embroidery':
        return (<><rect width="400" height="300" fill={a} /><g fill="none" stroke={b} strokeWidth="2.5" strokeLinecap="round"><path d="M200 70 C150 70 120 110 160 140 C200 170 200 200 200 230" /><path d="M200 70 C250 70 280 110 240 140 C200 170 200 200 200 230" /><path d="M200 150 C160 130 120 150 130 190" /><path d="M200 150 C240 130 280 150 270 190" /></g><g fill={c}><circle cx="200" cy="70" r="7" /><circle cx="130" cy="190" r="5" /><circle cx="270" cy="190" r="5" /></g></>);
      case 'upholstery':
        return (<><defs><pattern id={p} width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill={a} /><path d="M0 20 Q10 0 20 20 T40 20" fill="none" stroke={b} strokeWidth="2.5" /><path d="M0 36 Q10 16 20 36 T40 36" fill="none" stroke={c} strokeWidth="1.5" opacity=".6" /></pattern></defs><rect width="400" height="300" fill={`url(#${p})`} /></>);
      case 'bag':
        return (<><rect width="400" height="300" fill={a} /><rect x="90" y="50" width="220" height="200" rx="10" fill={b} opacity=".18" stroke={b} strokeWidth="2" /><rect x="90" y="50" width="220" height="30" fill={b} opacity=".45" /><rect x="140" y="110" width="120" height="60" fill={c} opacity=".35" /><path d="M150 28 H250" stroke={b} strokeWidth="6" strokeLinecap="round" /></>);
      case 'shower':
        return (<><rect width="400" height="300" fill={a} /><rect width="400" height="8" fill={c} />{Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={20 + i * 33} cy="22" r="5" fill="none" stroke={c} strokeWidth="2" />)}{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 45} y="34" width="22" height="266" fill={b} opacity=".2" />)}</>);
    }
  })();
  return <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={kind + ' textile swatch'}>{body}</svg>;
}

function ProductMedia({ product }: { product: Product }) {
  const photo = photos[product.id];
  if (photo) return <img src={photo} alt={product.name} loading="lazy" />;
  return <Swatch kind={product.swatch} colors={product.colors} uid={product.id} />;
}

export function ProductCatalog() {
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const visible = useMemo(() => (active === 'all' ? products : products.filter((p) => p.category === active)), [active]);
  const countFor = (id: CategoryId) => products.filter((p) => p.category === id).length;

  return (
    <section className="page-section product-catalog" id="catalog">
      <div className="page-section-heading">
        <div className="section-kicker"><span>02</span><span className="kicker-rule" /> PRODUCT RANGE</div>
        <h2>What we make</h2>
        <p>Browse our range by category. For constructions, thread counts, sizes or custom programmes, contact our sales team.</p>
      </div>
      <div className="catalog-filters" role="group" aria-label="Filter products by category">
        <button type="button" className={active === 'all' ? 'is-active' : ''} aria-pressed={active === 'all'} onClick={() => setActive('all')}>All <em>{products.length}</em></button>
        {categories.map((c) => (
          <button type="button" key={c.id} className={active === c.id ? 'is-active' : ''} aria-pressed={active === c.id} onClick={() => setActive(c.id)}>{c.label} <em>{countFor(c.id)}</em></button>
        ))}
      </div>
      <div className="catalog-grid">
        {visible.map((p, i) => (
          <article className="catalog-card" key={p.id}>
            <div className="catalog-media">
              <ProductMedia product={p} />
              <span className="catalog-tag">{categories.find((c) => c.id === p.category)?.label.toUpperCase()}</span>
            </div>
            <div className="catalog-body">
              <span className="micro-label">{String(i + 1).padStart(2, '0')} / {p.category.toUpperCase()}</span>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <ul className="catalog-specs">{p.specs.map((s) => <li key={s}>{s}</li>)}</ul>
              <a className="inline-link" href={'mailto:sales@bismillah.com.pk?subject=' + encodeURIComponent('Enquiry: ' + p.name)}>Enquire about this product <ArrowUpRight size={14} /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
