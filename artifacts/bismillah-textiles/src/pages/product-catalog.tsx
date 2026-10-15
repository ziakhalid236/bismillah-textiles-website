import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import "./product-catalog.css";

type Category = "Home textiles" | "Fabric" | "Hospitality" | "Garments & apparel fabrics";

const photos = {
  sheets: { id: "1601276174812-63280a55656e", alt: "White bed linen in a sunlit bedroom" },
  comforter: { id: "1608118939885-ac618d5d101a", alt: "Striped bedding and pillow on a bed" },
  bedPack: { id: "1564019472231-4586c552dc27", alt: "White pillows and a bed comforter" },
  quilt: { id: "1759176170553-7c078c66c514", alt: "Close-up of a white quilted mattress top" },
  duvet: { id: "1633865082308-b858e086c1f6", alt: "White duvet and pillows on a bed" },
  mattress: { id: "1759176170879-6bd7073ab4f4", alt: "Quilted white mattress texture" },
  cushions: { id: "1559051668-9024c9b5e84b", alt: "Assorted decorative pillows" },
  placeMats: { id: "1600294421265-c354b772e790", alt: "Red and white woven check fabric" },
  curtain: { id: "1628428988888-8a8e1c47ca9e", alt: "Decorative draped curtain fabric" },
  kitchenCurtain: { id: "1731425389838-f4ab10da8303", alt: "Sunlight and shadows falling across a curtain" },
  showerCurtain: { id: "1551433755-ab835b5e2a2d", alt: "Pink and white shower curtain" },
  tableLinen: { id: "1683803197203-0d743a38e41c", alt: "A table dressed with a tablecloth" },
  embroidery: { id: "1680034976848-d9fe95466aba", alt: "Colorful embroidery stitched into white cloth" },
  jacquard: { id: "1623310658847-33f12eaab710", alt: "Folded printed fabrics in several patterns" },
  matelasse: { id: "1570362685387-3cf5499c3fdc", alt: "Textured gray and green woven textile" },
  dobby: { id: "1643313262988-cdc5f50c6019", alt: "Close-up view of a gray woven fabric" },
  plainWeave: { id: "1705493625048-f3ae8452d249", alt: "Close-up of a woven material" },
  yarnStripe: { id: "1601056639638-c53c50e13ead", alt: "Red, white and black striped textile" },
  printed: { id: "1540292370723-60cf448886c3", alt: "Colorful printed textile with soft abstract pattern" },
  dyed: { id: "1705248383815-c6bc07898592", alt: "A range of colored fabric swatches" },
  upholstery: { id: "1624628795660-a24ce3673add", alt: "Brown and beige striped furnishing fabric" },
  hotelBed: { id: "1698746044340-ae5559412fd5", alt: "White bed linen in a hotel-style bedroom" },
  hotelCurtain: { id: "1646295451727-3b120dfa3263", alt: "Close-up of a patterned curtain" },
  apparelKnit: { id: "1619459074324-33d5f591c53e", alt: "Brown and black knit textile" },
  apparelPrint: { id: "1761516126149-b570f4e8c899", alt: "Floral printed textile pattern" },
  apparelStripe: { id: "1624516268152-1e48624026ed", alt: "Colorful dyed textile stripes" },
  sewing: { id: "1673201229733-69d19c5c4a87", alt: "A garment being stitched on a sewing machine" },
  looms: { id: "1758270804188-8ca0b6d254bc", alt: "Industrial looms weaving white fabric" },
} as const;

type PhotoKey = keyof typeof photos;
type Product = {
  id: string;
  number: string;
  group: string;
  category: Category;
  title: string;
  description: string;
  features: string[];
  photo: PhotoKey;
};

const products: Product[] = [
  { id: "sheet-sets", number: "01", group: "HOME", category: "Home textiles", title: "Sheet sets", description: "Flat sheets, fitted sheets and pillowcases, cut and stitched in-house from our own woven fabric.", features: ["Hemstitch", "Pintuck", "Piping", "Embroidery"], photo: "sheets" },
  { id: "comforter-sets", number: "02", group: "HOME", category: "Home textiles", title: "Comforter sets", description: "Coordinated comforter and pillow sham sets, supported by in-house quilting and wadding.", features: ["Quilted", "Filled", "Coordinated sets"], photo: "comforter" },
  { id: "bed-in-a-bag", number: "03", group: "HOME", category: "Home textiles", title: "Bed-in-a-bag", description: "Complete bedding packs, supplied filled or unfilled depending on the programme.", features: ["Filled", "Unfilled", "Retail-ready"], photo: "bedPack" },
  { id: "quilted-bedding", number: "04", group: "HOME", category: "Home textiles", title: "Quilted & wadded bedding", description: "Quilts and quilted products made on computerized single-needle and continuous multi-needle quilting lines.", features: ["Computerized quilting", "In-house wadding"], photo: "quilt" },
  { id: "duvet-sets", number: "05", group: "HOME", category: "Home textiles", title: "Duvet sets", description: "Duvet covers and matching pillowcases in woven and printed constructions.", features: ["Woven", "Printed", "Coordinated sets"], photo: "duvet" },
  { id: "mattress-covers", number: "06", group: "HOME", category: "Home textiles", title: "Mattress covers", description: "Fitted and quilted mattress covers for home and retail programmes.", features: ["Quilted", "Fitted styles"], photo: "mattress" },
  { id: "cushions-bolsters", number: "07", group: "HOME", category: "Home textiles", title: "Cushions, bolsters & neck rolls", description: "Decorative cushions, bolsters and neck rolls made to coordinate with bedding and furnishing ranges.", features: ["Filled", "Decorative"], photo: "cushions" },
  { id: "place-mats", number: "08", group: "HOME", category: "Home textiles", title: "Place mats", description: "Fabric place mats and table accessories in woven and printed designs.", features: ["Woven", "Printed"], photo: "placeMats" },
  { id: "curtains", number: "09", group: "HOME", category: "Home textiles", title: "Curtains", description: "Window curtains and panels made from woven, dyed and printed fabrics.", features: ["Woven", "Printed", "Embroidered"], photo: "curtain" },
  { id: "kitchen-curtains", number: "10", group: "HOME", category: "Home textiles", title: "Kitchen curtains", description: "Short-length curtains and tiers for kitchens and smaller windows.", features: ["Tier styles", "Valance styles"], photo: "kitchenCurtain" },
  { id: "shower-curtains", number: "11", group: "HOME", category: "Home textiles", title: "Shower curtains", description: "Fabric shower curtains for home programmes in printed and woven designs.", features: ["Fabric", "Printed & woven"], photo: "showerCurtain" },
  { id: "table-cloths", number: "12", group: "HOME", category: "Home textiles", title: "Table cloths", description: "Table cloths and related table linen in woven and printed designs.", features: ["Woven", "Printed"], photo: "tableLinen" },
  { id: "embroidered-accessories", number: "13", group: "HOME", category: "Home textiles", title: "Embroidered & decorative accessories", description: "Decorative home accessories produced with the company’s high-speed multi-needle embroidery capability.", features: ["Multi-needle embroidery", "Up to 400 x 1,200 mm"], photo: "embroidery" },
  { id: "jacquard-fabric", number: "14", group: "FABRIC", category: "Fabric", title: "Jacquard fabric", description: "Figured woven fabric produced on the company’s air-jet looms.", features: ["Air-jet woven", "120 to 600 thread count"], photo: "jacquard" },
  { id: "matelasse", number: "15", group: "FABRIC", category: "Fabric", title: "Matelassé", description: "Raised, quilted-look woven fabric for bedding and decorative use.", features: ["Air-jet woven", "Home & decor"], photo: "matelasse" },
  { id: "dobby-fabric", number: "16", group: "FABRIC", category: "Fabric", title: "Dobby fabric", description: "Small-scale geometric woven textures made on dobby looms.", features: ["Air-jet woven", "120 to 600 thread count"], photo: "dobby" },
  { id: "plain-weave", number: "17", group: "FABRIC", category: "Fabric", title: "Plain weave", description: "Plain woven base cloth across a range of constructions.", features: ["Air-jet woven", "120 to 600 thread count"], photo: "plainWeave" },
  { id: "yarn-dyed-fabric", number: "18", group: "FABRIC", category: "Fabric", title: "Yarn-dyed fabric", description: "Stripes and checks woven from yarn dyed in the in-house cone-dyeing facility.", features: ["In-house cone dyeing", "180,000 kg / month capacity"], photo: "yarnStripe" },
  { id: "printed-fabric", number: "19", group: "FABRIC", category: "Fabric", title: "Printed fabric", description: "Fabric printed in the processing house on rotary printing machines.", features: ["Rotary printing", "3 rotary printing machines"], photo: "printed" },
  { id: "dyed-bleached-fabric", number: "20", group: "FABRIC", category: "Fabric", title: "Dyed & bleached fabric", description: "Continuously bleached and dyed cloth for customer-defined ranges.", features: ["2 bleaching ranges", "2 continuous dyeing ranges"], photo: "dyed" },
  { id: "upholstery-fabric", number: "21", group: "FABRIC", category: "Fabric", title: "Upholstery & decorative fabric", description: "Heavier decorative fabrics for furnishing and soft-furnishing programmes.", features: ["Woven", "Furnishing"], photo: "upholstery" },
  { id: "hospitality-bed-linen", number: "22", group: "HOSPITALITY", category: "Hospitality", title: "Hospitality bed linen", description: "Plain and striped bed linen for hospitality customers, made on weaving and stitching lines.", features: ["Plain & stripe", "Cut and sew"], photo: "hotelBed" },
  { id: "hospitality-curtains", number: "23", group: "HOSPITALITY", category: "Hospitality", title: "Hospitality curtains & drapes", description: "Curtains and drapes for hospitality projects, made to specification.", features: ["Made to specification"], photo: "hotelCurtain" },
  { id: "hotel-quilts", number: "24", group: "HOSPITALITY", category: "Hospitality", title: "Quilted bedding for hotels", description: "Quilted and filled bedding for hotel programmes.", features: ["Quilted", "Filled"], photo: "hotelBed" },
  { id: "woven-apparel-fabric", number: "25", group: "APPAREL", category: "Garments & apparel fabrics", title: "Apparel fabrics - woven", description: "Woven apparel fabrics within the broader textile portfolio.", features: ["Woven", "Dyed"], photo: "apparelKnit" },
  { id: "printed-apparel-fabric", number: "26", group: "APPAREL", category: "Garments & apparel fabrics", title: "Apparel fabrics - printed", description: "Printed fabrics suited to apparel programmes.", features: ["Rotary printed"], photo: "apparelPrint" },
  { id: "yarn-dyed-apparel", number: "27", group: "APPAREL", category: "Garments & apparel fabrics", title: "Apparel fabrics - yarn-dyed", description: "Yarn-dyed checks and stripes for garment programmes.", features: ["Yarn-dyed"], photo: "apparelStripe" },
  { id: "cut-sew-garments", number: "28", group: "APPAREL", category: "Garments & apparel fabrics", title: "Cut-and-sew garments", description: "Cut-and-sew capability from the company’s stitching units, available on request.", features: ["18 stitching units"], photo: "sewing" },
];

const categoryCopy: { title: Category; number: string; description: string }[] = [
  { title: "Home textiles", number: "01", description: "Bedding, window, bath and table products made through integrated in-house processes." },
  { title: "Fabric", number: "02", description: "Woven, dyed, printed and finished fabrics across a range of constructions." },
  { title: "Hospitality", number: "03", description: "Bed linen, drapes and quilted products for hospitality programmes." },
  { title: "Garments & apparel fabrics", number: "04", description: "Apparel fabrics and cut-and-sew capability within the broader textile portfolio." },
];

const processNotes: Record<Category, string> = {
  "Home textiles": "Bismillah Textiles describes its production as vertically integrated, bringing weaving, processing and stitching together in-house, with published quilting, wadding and embroidery capabilities.",
  Fabric: "The official facilities page lists 136 wider-width air-jet looms, constructions from 120 to 600 thread count, in-house cone dyeing, bleaching, rotary printing and continuous dyeing.",
  Hospitality: "Hospitality ranges are supported by the company’s integrated weaving, processing and stitching operations, with quilting and wadding available in-house.",
  "Garments & apparel fabrics": "The official facilities page lists 18 stitching units and cut-to-pack capacity of more than 4 million meters per month.",
};

const filters = ["All", ...categoryCopy.map((item) => item.title)] as const;

type Filter = (typeof filters)[number];

function imageUrl(key: PhotoKey, width = 960) {
  const photo = photos[key];
  const height = Math.round(width * 0.75);
  return `https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=${width}&h=${height}&q=78`;
}

export function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const visibleProducts = activeFilter === "All" ? products : products.filter((product) => product.category === activeFilter);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <div className="product-catalog-page">
      <section className="catalog-hero" aria-labelledby="catalog-title">
        <div className="catalog-hero-copy">
          <p className="catalog-kicker"><span /> Made in Khurrianwala</p>
          <h1 id="catalog-title">Textiles for <em>everyday living.</em></h1>
          <p className="catalog-lede">Our vertically integrated facilities produce and export home textiles for established brands and retailers around the world.</p>
          <a className="catalog-primary-link" href="mailto:sales@bismillah.com.pk?subject=Product%20enquiry">Talk to our team <ArrowUpRight aria-hidden="true" size={17} /></a>
          <div className="catalog-hero-caption"><span>Made with care in Faisalabad</span><span>Khurrianwala, Pakistan</span></div>
        </div>
        <figure className="catalog-hero-visual">
          <img src={imageUrl("looms", 1500)} alt="Illustrative view of industrial textile looms" width="1500" height="1125" fetchPriority="high" decoding="async" />
          <figcaption><span>Production, connected</span><span>Illustrative photography</span></figcaption>
        </figure>
      </section>

      <section className="catalog-section catalog-areas" aria-labelledby="areas-title">
        <div className="catalog-section-heading">
          <p className="catalog-kicker"><span /> Company profile</p>
          <h2 id="areas-title">Our product areas</h2>
          <p>Four complementary categories, supported by in-house manufacturing.</p>
        </div>
        <div className="catalog-area-grid">
          {categoryCopy.map((area) => (
            <article className="catalog-area-card" key={area.title}>
              <span className="catalog-area-number">{area.number} / {area.title === "Garments & apparel fabrics" ? "APPAREL" : area.title.toUpperCase()}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span className="catalog-area-count">{products.filter((product) => product.category === area.title).length} products</span>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section catalog-products" id="product-range" aria-labelledby="products-title">
        <div className="catalog-section-heading catalog-product-heading">
          <div>
            <p className="catalog-kicker"><span /> Product range</p>
            <h2 id="products-title">What we make</h2>
            <p>Browse by category. For constructions, thread counts, sizes or custom programmes, contact our sales team.</p>
          </div>
          <span className="catalog-total">{products.length} product lines</span>
        </div>

        <div className="catalog-filter-row" role="group" aria-label="Filter products by category">
          <div className="catalog-filter-scroll">
            {filters.map((filter) => {
              const count = filter === "All" ? products.length : products.filter((product) => product.category === filter).length;
              return <button key={filter} type="button" className={activeFilter === filter ? "catalog-filter is-active" : "catalog-filter"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}<span>{count}</span></button>;
            })}
          </div>
          <p className="catalog-results" aria-live="polite">Showing {visibleProducts.length} of {products.length}</p>
        </div>

        <div className="catalog-product-grid">
          {visibleProducts.map((product) => {
            const photo = photos[product.photo];
            return (
              <article className="catalog-product-card" key={product.id}>
                <button className="catalog-card-image" type="button" onClick={() => setSelected(product)} aria-label={`View details for ${product.title}`}>
                  <img src={imageUrl(product.photo, 960)} srcSet={`${imageUrl(product.photo, 560)} 560w, ${imageUrl(product.photo, 960)} 960w, ${imageUrl(product.photo, 1400)} 1400w`} sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 980px) 46vw, 30vw" alt={`Illustrative ${product.title.toLowerCase()} photo: ${photo.alt}`} width="960" height="720" loading="lazy" decoding="async" />
                  <span className="catalog-photo-label">Representative image</span>
                </button>
                <div className="catalog-card-copy">
                  <p className="catalog-product-index">{product.number} / {product.group}</p>
                  <h3>{product.title}</h3>
                  <p className="catalog-product-description">{product.description}</p>
                  <ul className="catalog-tag-list" aria-label="Product features">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <button className="catalog-details-button" type="button" onClick={() => setSelected(product)}>View product details <ArrowUpRight aria-hidden="true" size={15} /></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="catalog-capacity" aria-labelledby="capacity-title">
        <div className="catalog-capacity-inner">
          <div className="catalog-capacity-heading">
            <p className="catalog-kicker"><span /> Connected production</p>
            <h2 id="capacity-title">From yarn to finished textile.</h2>
            <p>Published capabilities from Bismillah Textiles’ official facilities information.</p>
          </div>
          <div className="catalog-capacity-grid">
            <div><strong>136</strong><span>wider-width air-jet looms</span></div>
            <div><strong>1M+</strong><span>meters/month weaving capacity</span></div>
            <div><strong>180,000 kg</strong><span>monthly cone-dyeing capacity</span></div>
            <div><strong>4M+</strong><span>meters/month processing capacity</span></div>
          </div>
        </div>
      </section>

      <section className="catalog-contact" aria-labelledby="catalog-contact-title">
        <div>
          <p className="catalog-kicker"><span /> Design to delivery</p>
          <h2 id="catalog-contact-title">Connected production, <em>consistent quality.</em></h2>
          <p>Tell us what you are sourcing. Our sales team can confirm construction, dimensions, finish and programme requirements.</p>
        </div>
        <a className="catalog-primary-link" href="mailto:sales@bismillah.com.pk?subject=Product%20enquiry">Enquire about products <ArrowUpRight aria-hidden="true" size={17} /></a>
      </section>
      <p className="catalog-image-disclaimer">Product photographs are illustrative, sourced from Unsplash and are not verified Bismillah Textiles product samples. <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>.</p>

      {selected && (
        <div className="catalog-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title" ref={dialogRef}>
            <button ref={closeButtonRef} type="button" className="catalog-modal-close" onClick={() => setSelected(null)} aria-label="Close product details"><X aria-hidden="true" size={20} /><span>Close</span></button>
            <div className="catalog-modal-image"><img src={imageUrl(selected.photo, 1400)} alt={`Illustrative ${selected.title.toLowerCase()} photo: ${photos[selected.photo].alt}`} width="1400" height="1050" decoding="async" /></div>
            <div className="catalog-modal-content">
              <p className="catalog-product-index">{selected.number} / {selected.category}</p>
              <h2 id="catalog-modal-title">{selected.title}</h2>
              <p className="catalog-modal-summary">{selected.description}</p>
              <div className="catalog-modal-block"><h3>Product options</h3><ul className="catalog-tag-list">{selected.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
              <div className="catalog-modal-block"><h3>Manufacturing context</h3><p>{processNotes[selected.category]}</p></div>
              <p className="catalog-modal-note">Composition, construction, dimensions, colours, minimums and lead times are confirmed for each customer programme. Contact sales for a product-specific specification.</p>
              <div className="catalog-modal-actions">
                <a className="catalog-primary-link" href={`mailto:sales@bismillah.com.pk?subject=${encodeURIComponent(`Product enquiry: ${selected.title}`)}&body=${encodeURIComponent(`Hello Bismillah Textiles,\n\nPlease share the product-specific specifications and programme options for ${selected.title}.\n\nThank you.`)}`}>Request specifications <ArrowUpRight aria-hidden="true" size={16} /></a>
                <a className="catalog-phone-link" href="tel:+92412428888">Call +92 41 242 8888</a>
              </div>
              <p className="catalog-modal-credit">Representative Unsplash photo; not a verified BTL product sample. <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">License details</a>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}