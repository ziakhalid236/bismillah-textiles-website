import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import pageMetadata from './page-metadata.json';
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
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
];

function Home() {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bismillah+Textiles+1+KM+Jaranwala+Road+Khurrianwala+Faisalabad+Pakistan';
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
          <div className="work-banner">
            <div className="work-banner-image"><img src="/images/1791855918484_1791856385398.jpg" alt="Textile inspection floor at Bismillah Textiles" /></div>
            <div className="work-banner-copy"><span className="micro-label">HOME TEXTILES / MADE WITH CARE</span><h3>Comfort begins<br />with the cloth.</h3><p>From fabric development to finished home textiles, our teams bring each stage together under one roof.</p><Link className="light-link" href="/products/">Explore our products <ArrowUpRight size={15} /></Link></div>
            <div className="banner-index">BTL<br />02</div>
          </div>
          <div className="product-notes"><div><span className="note-number">A—</span><h4>Since 1989</h4><p>Built in Faisalabad, Pakistan.</p></div><div><span className="note-number">B—</span><h4>2,500+ people</h4><p>A skilled team across our operations.</p></div><div><span className="note-number">C—</span><h4>Six continents</h4><p>Serving brands and retailers worldwide.</p></div></div>
          <Link className="leader-card" href="/about-us/" aria-label="Meet our leadership and read about Abdul Hafeez Sheikh Pasha">
            <div className="leader-card-photo"><img src="/images/abdul-hafeez-sheikh-pasha.jpg" alt="Abdul Hafeez Sheikh Pasha" /></div>
            <div className="leader-card-copy"><span className="micro-label">A FAMILY BUSINESS / OUR LEADERSHIP</span><h3>Meet the people behind our work.</h3><p>Explore the story, values and leadership profile of Bismillah Textiles.</p><span className="leader-card-link">Meet our team <ArrowRight size={16} /></span></div>
            <span className="leader-card-index">BTL / 03</span>
          </Link>
        </section>

        <section className="facility" id="facility">
          <div className="facility-heading section-pad"><div className="section-kicker light-kicker"><span>02</span><span className="kicker-rule" /> A LOOK INSIDE</div><div className="facility-title-row"><h2>Work you can<br /><em>see for yourself.</em></h2><p>From wide-width weaving to finishing and stitching, explore the real spaces and equipment behind our work.</p></div></div>
          <div className="gallery">
            <figure className="gallery-large"><img src="/images/1791856251182_1791856385300.jpg" alt="Rows of textile machinery on the production floor" /><figcaption><span>01 / PRODUCTION FLOOR</span><span>Textile machinery in operation</span></figcaption></figure>
            <figure className="gallery-small"><img src="/images/1791856226013_1791856385316.jpg" alt="Spools and equipment in the textile facility" /><figcaption><span>02 / THREAD & PREPARATION</span></figcaption></figure>
            <figure className="gallery-small"><img src="/images/1791856048064_1791856385381.jpg" alt="Fabric on a textile machine" /><figcaption><span>03 / ON THE FLOOR</span></figcaption></figure>
            <figure className="gallery-wide"><img src="/images/main-gate.jpg" alt="The main entrance gate at Bismillah Textiles" /><figcaption><span>04 / THE MAIN GATE</span><span>01 KM Jaranwala Road, Khurrianwala</span></figcaption></figure>
          </div>
          <div className="facility-bottom"><span>PHOTOGRAPHED AT BISMILLAH TEXTILES</span><Link href="/manufacturing-facilities/">See all facilities <ArrowUpRight size={15} /></Link></div>
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
    <RoutedErrorBoundary><SiteFrame /></RoutedErrorBoundary>
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