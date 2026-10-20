import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import AdminPanel from '@/pages/admin-panel';
import pageMetadata from './page-metadata.json';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import {
  AboutPage,
  BrandsPage,
  CareersPage,
  CertificationsPage,
  ContactPage,
  FacilitiesPage,
  MapEmbed,
  NewsPage,
  ProductsPage,
} from '@/pages/company-pages';
import { MarketInsightsPage } from '@/pages/market-insights';
import { InternationalNewsPage } from '@/pages/international-news';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const sitePages = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us/' },
  { label: 'Manufacturing Facilities', path: '/manufacturing-facilities/' },
  { label: 'Brands and Retailers', path: '/brands-retailers/' },
  { label: 'Products', path: '/products/' },
  { label: 'Careers', path: '/careers/' },
  { label: 'Contact Us', path: '/contact-us/' },
  { label: 'Certifications', path: '/certifications/' },
  { label: 'News', path: '/news/' },
  { label: 'Markets & Industry Insights', path: '/markets-industry-insights/' },
  { label: 'International News', path: '/international-news/' },
];

const PUBLIC_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://bismillah-textiles-admin-api.ziakhalid236.workers.dev').replace(/\/$/, '');

const homepageProductSpotlight = [
  { number: '01', group: 'HOME TEXTILES', title: 'Sheet sets', detail: 'Flat sheets, fitted sheets and pillowcases, made from our own woven fabric.', image: '/images/products/sheet-sets.jpg' },
  { number: '02', group: 'FABRIC', title: 'Printed fabric', detail: 'Customer-defined printed constructions developed through our integrated processing house.', image: '/images/products/printed-fabric.jpg' },
  { number: '03', group: 'HOSPITALITY', title: 'Hospitality bed linen', detail: 'Crisp plain and striped bed linen for hospitality programmes and repeatable quality.', image: '/images/products/hospitality-bed-linen.jpg' },
  { number: '04', group: 'HOME TEXTILES', title: 'Duvet sets', detail: 'Duvet covers and matching pillowcases in woven and printed constructions.', image: '/images/products/duvet-sets.jpg' },
  { number: '05', group: 'FABRIC', title: 'Jacquard fabric', detail: 'Figured woven fabric produced on our own air-jet looms.', image: '/images/products/jacquard-fabric.jpg' },
  { number: '06', group: 'HOME TEXTILES', title: 'Curtains', detail: 'Window curtains and panels made from woven, dyed and printed fabrics.', image: '/images/products/curtains.jpg' },
];

function ProductMarquee() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = homepageProductSpotlight.length;
  const move = (direction: number) => setActiveIndex((current) => (current + direction + total) % total);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => move(1), 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div className="home-product-carousel" role="group" aria-roledescription="carousel" aria-label="Featured product range" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}>
      <div className="home-product-carousel-viewport">
        <div className="home-product-track" style={{ transform: `translateX(calc((100vw - var(--home-product-card-width)) / 2 - ${activeIndex} * (var(--home-product-card-width) + var(--home-product-gap)))` }}>
          {homepageProductSpotlight.map((product, index) => (
            <article className={index === activeIndex ? 'home-product-card is-active' : 'home-product-card'} key={product.title} aria-hidden={index !== activeIndex}>
              <Link className="home-product-card-image" href="/products/" tabIndex={index === activeIndex ? undefined : -1} aria-label={`Explore ${product.title}`}>
                <img src={product.image} alt={index === activeIndex ? `${product.title} product render` : ''} loading={index === activeIndex ? 'eager' : 'lazy'} />
                <span className="home-product-card-chip">{product.group}</span>
                <span className="home-product-card-cta">VIEW RANGE <ArrowUpRight size={14} /></span>
              </Link>
              <div className="home-product-card-copy">
                <span className="micro-label">RANGE {product.number}</span>
                <h3>{product.title}</h3>
                <p>{product.detail}</p>
                <Link className="inline-link" href="/products/" tabIndex={index === activeIndex ? undefined : -1}>View all products <ArrowRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <button className="home-product-control home-product-control--prev" type="button" onClick={() => move(-1)} aria-label="Previous featured product"><ChevronLeft size={23} /></button>
      <button className="home-product-control home-product-control--next" type="button" onClick={() => move(1)} aria-label="Next featured product"><ChevronRight size={23} /></button>
      <div className="home-product-pagination" aria-label="Choose featured product">
        {homepageProductSpotlight.map((product, index) => <button key={product.title} className={index === activeIndex ? 'is-active' : undefined} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show ${product.title}`} aria-current={index === activeIndex ? 'true' : undefined} />)}
      </div>
    </div>
  );
}

const homepagePageTeasers = [
  { number: '01', label: 'ABOUT US', title: 'A family business, built to last.', detail: 'Meet the leadership, values and philosophy behind Bismillah Textiles.', image: '/images/about-factory-team.jpg', imageAlt: 'Bismillah Textiles team inside the manufacturing facility', href: '/about-us/' },
  { number: '02', label: 'MANUFACTURING', title: 'One connected way of making.', detail: 'See how weaving, dyeing, processing and stitching work together in-house.', image: '/images/1791856251182_1791856385300.jpg', imageAlt: 'Textile machinery on the Bismillah Textiles production floor', href: '/manufacturing-facilities/' },
  { number: '03', label: 'BRANDS & RETAILERS', title: 'Made here. Known worldwide.', detail: 'Explore the long-term brand and retail partnerships around our work.', image: '/images/brands/next-retailer.jpg', imageAlt: 'Textile retail display representing Bismillah Textiles partnerships', href: '/brands-retailers/' },
  { number: '04', label: 'CAREERS', title: 'Build your future with our team.', detail: 'Learning, opportunity and progression across a growing textile operation.', image: '/images/about-factory-team.jpg', imageAlt: 'People working together at Bismillah Textiles', href: '/careers/' },
  { number: '05', label: 'CONTACT', title: 'Find us in Khurrianwala.', detail: 'Reach the sales, general enquiries or careers team and plan a visit.', image: '/images/main-gate.jpg', imageAlt: 'Main entrance gate at Bismillah Textiles', href: '/contact-us/' },
  { number: '06', label: 'CERTIFICATIONS', title: 'Quality is an evolving process.', detail: 'See the systems, standards and certificates that support our process.', image: '/images/1791856048064_1791856385381.jpg', imageAlt: 'Textile production equipment used in quality-controlled manufacturing', href: '/certifications/' },
  { number: '07', label: 'NEWS', title: 'Progress, people and new ideas.', detail: 'Catch up on company updates, community initiatives and recognition.', image: '/images/factory-courtyard.jpg', imageAlt: 'Bismillah Textiles facility in Faisalabad', href: '/news/' },
  { number: '08', label: 'MARKET INSIGHTS', title: 'Signals to watch. Claims kept in view.', detail: 'Read the latest textile market context with sources and limits made visible.', image: '/images/1791855918484_1791856385398.jpg', imageAlt: 'Fabric inspection inside the Bismillah Textiles facility', href: '/markets-industry-insights/' },
  { number: '09', label: 'INTERNATIONAL NEWS', title: 'The global signals worth keeping in view.', detail: 'Follow international developments in materials, standards, trade and textile design.', image: '/images/1791856251182_1791856385300.jpg', imageAlt: 'Textile machinery on the Bismillah Textiles production floor', href: '/international-news/' },
];

const homepageBrandPartners = [
  { name: 'Disney', image: '/images/brands/disney.png' },
  { name: 'Nautica', image: '/images/brands/nautica.png' },
  { name: 'Next', image: '/images/brands/next-manufactured.png' },
  { name: 'DKNY', image: '/images/brands/dkny.png' },
  { name: 'Walmart', image: '/images/brands/walmart.png' },
  { name: 'Carrefour', image: '/images/brands/carrefour.png' },
  { name: 'Target', image: '/images/brands/target.png' },
  { name: 'Macy’s', image: '/images/brands/macys.png' },
];

const homepageCertificationHighlights = [
  { name: 'ISO 14001:2015 · valid to Jun 2028', image: '/images/certifications/iso14001.png', href: 'https://bismillah.com.pk/wp-content/uploads/2022/05/ISO-14001-2015-EMS.pdf' },
  { name: 'ZDHC Supplier to Zero · valid to Jan 2027', image: '/images/certifications/zdhc.png', href: 'https://bismillah.com.pk/wp-content/uploads/ZDHC-Report.pdf' },
];

function Home() {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bismillah+Textiles+1+KM+Jaranwala+Road+Khurrianwala+Faisalabad+Pakistan';
  const [managedBrands, setManagedBrands] = useState<{ name: string; image: string }[]>([]);
  const [managedCertificates, setManagedCertificates] = useState<{ name: string; image: string; href: string }[]>([]);

  useEffect(() => {
    let active = true;
    const loadMedia = async (kind: 'brand' | 'certificate') => {
      try {
        const response = await fetch(`${PUBLIC_API_BASE_URL}/api/public/media?kind=${kind}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!response.ok) return;
        const assets = await response.json() as { label: string; url: string }[];
        if (!active) return;
        if (kind === 'brand') setManagedBrands(assets.map((asset) => ({ name: asset.label, image: asset.url })));
        else setManagedCertificates(assets.map((asset) => ({ name: asset.label, image: asset.url, href: asset.url })));
      } catch { /* Keep the curated local fallback when the media service is unavailable. */ }
    };
    void Promise.all([loadMedia('brand'), loadMedia('certificate')]);
    return () => { active = false; };
  }, []);

  const brandPartners = managedBrands.length ? managedBrands : homepageBrandPartners;
  const certificationHighlights = managedCertificates.length ? managedCertificates : homepageCertificationHighlights;
  return (
    <div className="home-content">
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> MADE IN KHURRIANWALA</div>
            <h1>We make the<br /><em>everyday</em> feel<br />exceptional.</h1>
            <p className="hero-lede">Founded in 1989, we bring weaving, processing and stitching together at our home in Faisalabad, Pakistan.</p>
            <div className="hero-actions"><a className="button button-red" href="#work">Explore our work <ArrowDown size={16} /></a><a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">Visit our facility <ArrowUpRight size={15} /></a></div>
            <div className="hero-foot"><span className="hero-coordinate">01 KM JARANWALA ROAD · KHURRIANWALA</span><span className="hero-mark">BTL <span>／</span> 01</span></div>
          </div>
          <div className="hero-visual">
            <img className="hero-image" src="/images/factory-courtyard.jpg" alt="Bismillah Textiles facility in Khurrianwala, Faisalabad" />
            <div className="image-stamp"><span>MADE</span><span>IN-HOUSE</span><span className="stamp-rule" /><span>SINCE 1989</span></div>
            <div className="photo-caption"><span>01 — OUR PLACE OF WORK</span><span>FAISALABAD, PAKISTAN</span></div>
          </div>
          <span className="vertical-note">BISMILLAH TEXTILES · PVT LIMITED</span>
        </section>

        <section className="intro section-pad" id="work">
          <div className="section-kicker"><span>01</span><span className="kicker-rule" /> WHAT WE DO</div>
          <div className="intro-grid">
            <h2>Made for the<br /><em>spaces we live in.</em></h2>
            <div className="intro-text"><p>Founded in 1989, Bismillah Textiles has grown into a vertically integrated home textile manufacturer with more than 2,500 employees.</p><p>We weave, process and stitch our products in-house, serving brands and retailers across six continents.</p><Link className="inline-link" href="/manufacturing-facilities/">Explore our manufacturing <ArrowRight size={16} /></Link></div>
          </div>
          <div className="product-notes"><div><span className="note-number">A—</span><h4>Since 1989</h4><p>Built in Faisalabad, Pakistan.</p></div><div><span className="note-number">B—</span><h4>2,500+ people</h4><p>A skilled team across our operations.</p></div><div><span className="note-number">C—</span><h4>Six continents</h4><p>Serving brands and retailers worldwide.</p></div></div>
          <Link className="quality-story-card" href="/manufacturing-facilities/" aria-label="Explore Bismillah Textiles integrated manufacturing process">
            <div className="quality-story-card-image"><img src="/images/1791856251182_1791856385300.jpg" alt="Textile machinery operating inside the Bismillah Textiles facility" loading="lazy" /></div>
            <div className="quality-story-card-copy"><span className="micro-label">THE BTL DIFFERENCE / INTEGRATED PRODUCTION</span><h3>One connected way<br /><em>of making.</em></h3><p>Weaving, processing and stitching work together under one roof, giving every finished textile a clear connection back to the people, machines and quality controls behind it.</p><span className="quality-story-card-link">Explore our manufacturing <ArrowRight size={16} /></span></div>
            <span className="quality-story-card-index">BTL / 02</span>
          </Link>
          <Link className="leader-card" href="/about-us/" aria-label="Meet our leadership and read about Abdul Hafeez Sheikh Pasha">
            <div className="leader-card-photo"><img src="/images/abdul-hafeez-sheikh-pasha.jpg" alt="Abdul Hafeez Sheikh Pasha" /></div>
            <div className="leader-card-copy"><span className="micro-label">A FAMILY BUSINESS / OUR LEADERSHIP</span><h3>Meet the people behind our work.</h3><p>Explore the story, values and leadership profile of Bismillah Textiles.</p><span className="leader-card-link">Meet our team <ArrowRight size={16} /></span></div>
            <span className="leader-card-index">BTL / 03</span>
          </Link>

          <section className="home-discovery" aria-labelledby="home-discovery-title">
            <div className="home-discovery-heading">
              <div><div className="section-kicker"><span>04</span><span className="kicker-rule" /> EXPLORE THE RANGE</div><h2 id="home-discovery-title">A closer look at<br /><em>what we make.</em></h2></div>
              <p>From everyday bedding to hospitality programmes and market context, start with the part of Bismillah Textiles that matters to you.</p>
            </div>
            <div className="home-product-marquee-wrap">
              <ProductMarquee />
              <p className="home-product-marquee-note"><ArrowRight size={14} /> Swipe, use the arrows, or choose a range below.</p>
            </div>
            <div className="home-directory" aria-label="Explore all company pages">
              <div className="home-directory-intro"><span className="micro-label">THE BTL DIRECTORY</span><h3>Every page has a reason to visit.</h3><p>Follow the story from our people and process to the products, partnerships and signals shaping the industry.</p></div>
              <div className="home-directory-grid">{homepagePageTeasers.map((page) => <Link className="home-directory-card" href={page.href} key={page.href}><span className="home-directory-card-copy"><span className="micro-label">{page.label}</span><h4>{page.title}</h4><p>{page.detail}</p><span className="home-directory-link">Explore page <ArrowRight size={15} /></span></span><span className="home-directory-number">{page.number}</span><span className="home-directory-card-media"><img src={page.image} alt={page.imageAlt} loading="lazy" /></span></Link>)}</div>
            </div>
            <section className="home-brand-showcase" aria-labelledby="home-brand-title">
              <div className="home-brand-heading"><div><div className="section-kicker"><span>05</span><span className="kicker-rule" /> SELECTED PARTNERS</div><h2 id="home-brand-title">Made for names<br /><em>people know.</em></h2></div><p>We manufacture for established brands and retailers across international markets. Partner names are shown as a company-published selection.</p></div>
              <div className="home-brand-logo-grid">{brandPartners.map((partner) => <div className="home-brand-logo" key={partner.name}><img src={partner.image} alt={`${partner.name} logo`} loading="lazy" /></div>)}</div>
              <Link className="inline-link" href="/brands-retailers/">See all brands and retailers <ArrowRight size={15} /></Link>
            </section>
            <section className="home-certification-showcase" aria-labelledby="home-certification-title">
              <div className="home-certification-heading"><div><div className="section-kicker"><span>06</span><span className="kicker-rule" /> QUALITY SYSTEMS</div><h2 id="home-certification-title">Proof behind<br /><em>the process.</em></h2></div><p>Selected certificate previews sourced from the official Bismillah Textiles certifications list. Open each card for the source document.</p></div>
              <div className="home-certification-grid">{certificationHighlights.map((certificate) => <a className="home-certification-card" href={certificate.href} target="_blank" rel="noopener noreferrer" key={certificate.name}><img src={certificate.image} alt={`${certificate.name} certificate preview`} loading="lazy" /><span>{certificate.name} <ArrowUpRight size={14} /></span></a>)}</div>
              <Link className="inline-link" href="/certifications/">View certifications <ArrowRight size={15} /></Link>
            </section>
          </section>
        </section>

        <section className="visit" id="visit">
          <div className="visit-info"><div className="section-kicker light-kicker"><span>03</span><span className="kicker-rule" /> FIND THE MILL</div><h2>Come see where<br /><em>the work happens.</em></h2><p className="visit-intro">Visit Bismillah Textiles in Khurrianwala. Call ahead or open directions to find your way to the facility.</p>
            <div className="visit-details"><div className="detail-row"><MapPin /><div><span className="detail-label">ADDRESS</span><span>01 KM Jaranwala Road</span><span>Khurrianwala, Faisalabad, Pakistan</span></div></div><div className="detail-row"><Phone /><div><span className="detail-label">PHONE</span><a href="tel:+92412428888">+92 41 242 8888</a></div></div><div className="detail-row"><Mail /><div><span className="detail-label">GENERAL ENQUIRIES</span><a href="mailto:info@bismillah.com.pk">info@bismillah.com.pk</a></div></div></div>
            <div className="visit-actions"><a className="button button-cream" href={mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a><a className="phone-link" href="tel:+92412428888"><Phone size={15} /> Call +92 41 242 8888</a></div>
          </div>
            <div className="map-wrap"><MapEmbed /><a className="map-overlay-link" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> OPEN IN GOOGLE MAPS <ArrowUpRight size={14} /></a></div>
        </section>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminPanel} />
      <Route component={() => <RoutedErrorBoundary><SiteFrame /></RoutedErrorBoundary>} />
    </Switch>
  );
}

function SiteFrame() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const currentMeta = pageMetadata.pages[location as keyof typeof pageMetadata.pages] ?? pageMetadata.pages['/404/'];
    const isNotFound = currentMeta === pageMetadata.pages['/404/'];
    const canonicalUrl = pageMetadata.siteOrigin + (isNotFound ? '/404/' : location);
    document.title = currentMeta.title;
    const ensureMeta = (name: string, content: string, property = false) => {
      const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    ensureMeta('description', currentMeta.description);
    ensureMeta('robots', isNotFound ? 'noindex, follow' : 'index, follow');
    ensureMeta('og:title', currentMeta.title, true);
    ensureMeta('og:description', currentMeta.description, true);
    ensureMeta('og:image', pageMetadata.siteOrigin + '/share.png', true);
    ensureMeta('og:url', canonicalUrl, true);
    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', currentMeta.title);
    ensureMeta('twitter:description', currentMeta.description);
    ensureMeta('twitter:image', pageMetadata.siteOrigin + '/share.png');
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    setMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [location]);

  return (
    <div className="site-shell">
      <div className="topline"><span>KHURRIANWALA, PAKISTAN</span><span className="topline-right"><span className="live-dot" /> Vertically integrated since 1989</span></div>
      <header className="main-header">
        <Link href="/" className="brand" aria-label="Bismillah Textiles home"><img src="/images/BTL-New-Logo-01_1791856385213.png" alt="Bismillah Textiles (Private) Limited" /></Link>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          <div className="nav-menu-grid">{sitePages.map((page) => <Link href={page.path} key={page.path} onClick={() => setMenuOpen(false)} aria-current={location === page.path ? 'page' : undefined}>{page.label}</Link>)}</div>
          <a className="nav-contact" href="tel:+92412428888" onClick={() => setMenuOpen(false)}><Phone size={15} /> Talk to our team</a>
        </nav>
        <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about-us/" component={AboutPage} />
          <Route path="/manufacturing-facilities/" component={FacilitiesPage} />
          <Route path="/brands-retailers/" component={BrandsPage} />
          <Route path="/products/" component={ProductsPage} />
          <Route path="/careers/" component={CareersPage} />
          <Route path="/contact-us/" component={ContactPage} />
          <Route path="/certifications/" component={CertificationsPage} />
          <Route path="/news/" component={NewsPage} />
          <Route path="/markets-industry-insights/" component={MarketInsightsPage} />
          <Route path="/international-news/" component={InternationalNewsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="footer">
        <Link href="/" className="footer-brand">BISMILLAH<span>TEXTILES (PRIVATE) LIMITED</span></Link>
        <span className="footer-tagline">TEXTILES, MADE IN KHURRIANWALA.</span>
        <nav className="footer-nav" aria-label="Footer navigation">{sitePages.slice(1).map((page) => <Link href={page.path} key={page.path}>{page.label}</Link>)}</nav>
        <nav className="footer-social" aria-label="Social media">
          <a href="https://www.facebook.com/BismillahTextilesOfficial/" target="_blank" rel="noopener noreferrer">FACEBOOK <ArrowUpRight size={12} /></a>
          <a href="https://pk.linkedin.com/company/bismillah-textiles" target="_blank" rel="noopener noreferrer">LINKEDIN <ArrowUpRight size={12} /></a>
        </nav>
        <a href="tel:+92412428888">PHONE +92 41 242 8888 <ArrowUpRight size={13} /></a>
        <span className="copyright">© BISMILLAH TEXTILES (PVT) LIMITED</span>
      </footer>
      <a href="tel:+92412428888" className="mobile-call" aria-label="Call Bismillah Textiles"><Phone size={19} aria-hidden="true" /></a>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
