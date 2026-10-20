import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BedDouble, Hotel, Layers3, Scissors, Shirt } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ProductCatalog } from './product-catalog';

const mapsEmbedUrl = 'https://maps.google.com/maps?q=Bismillah+Textiles+%28PVT%29+Limited+Khurrianwala+Faisalabad+Pakistan&output=embed';
const PUBLIC_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://bismillah-textiles-admin-api.ziakhalid236.workers.dev').replace(/\/$/, '');

type ManagedPage = { title: string; path: string; summary: string; body: string; heroImageUrl?: string };

function useManagedPage(path: string): ManagedPage | null {
  const [managed, setManaged] = useState<ManagedPage | null>(null);
  useEffect(() => {
    let active = true;
    fetch(`${PUBLIC_API_BASE_URL}/api/public/pages?path=${encodeURIComponent(path)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<ManagedPage> : null)
      .then((page) => { if (active && page) setManaged(page); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [path]);
  return managed;
}

export function MapEmbed() {
  return <iframe className="map-embed" src={mapsEmbedUrl} title="Interactive Google Map showing Bismillah Textiles in Khurrianwala, Faisalabad" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
}

type PageFrameProps = {
  number: string;
  title: ReactNode;
  lead: string;
  image: string;
  imageAlt: string;
  caption: string;
  children: ReactNode;
  showCta?: boolean;
};

function PageFrame({ number, title, lead, image, imageAlt, caption, children, showCta = true }: PageFrameProps) {
  const [location] = useLocation();
  const managed = useManagedPage(location);
  const visibleTitle = managed?.title || title;
  const visibleLead = managed?.summary || lead;
  const visibleImage = managed?.heroImageUrl || image;
  return (
    <div className="content-page">
      <section className="interior-hero section-pad">
        <div className="interior-hero-copy">
          <div className="section-kicker"><span>{number}</span><span className="kicker-rule" /> BISMILLAH TEXTILES</div>
          <h1>{visibleTitle}</h1>
          <p>{visibleLead}</p>
          {showCta && <Link className="button button-red" href="/contact-us/">Talk to our team <ArrowRight size={16} /></Link>}
        </div>
        <figure className="interior-hero-visual">
          <img src={visibleImage} alt={imageAlt} />
          <figcaption><span>{caption}</span><span>KHURRIANWALA, PAKISTAN</span></figcaption>
        </figure>
      </section>
      <div className="page-content section-pad">
        {managed?.body && <section className="managed-page-copy" aria-label="Page introduction"><p>{managed.body}</p></section>}
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ number, title, intro }: { number: string; title: string; intro?: string }) {
  return (
    <div className="page-section-heading">
      <div className="section-kicker"><span>{number}</span><span className="kicker-rule" /> COMPANY PROFILE</div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function FactGrid({ items }: { items: { number: string; title: string; text: string }[] }) {
  return <div className="fact-grid">{items.map((item) => <article className="fact-card" key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>;
}

export function AboutPage() {
  return (
    <PageFrame number="01" title={<>A family business,<br /><em>built to last.</em></>} lead="Bismillah Textiles was founded in 1989 in Faisalabad, Pakistan. Since then, we have grown into an established vertically integrated home textile manufacturer. We weave, process, and stitch all our products at our modern facilities in Pakistan." image="/images/about-factory-team.jpg" imageAlt="Bismillah Textiles team working on fabric in the factory" caption="ON THE FACTORY FLOOR">
      <section className="page-story-grid">
        <div><SectionTitle number="01" title="Our vision and philosophy" /><p>As a family business, our vision extends beyond financial quarters; we are driven by a generational responsibility to create value for our employees, customers, and community.</p><p>Our goal is to manufacture quality textile products with integrity, conduct ourselves in a professional and courteous manner, and exceed our customers’ expectations through efficient service.</p></div>
        <figure className="ceo-card"><img src="/images/abdul-hafeez-sheikh-pasha.jpg" alt="Abdul Hafeez Sheikh Pasha, CEO of Bismillah Textiles" /><figcaption><span>ABDUL HAFEEZ SHEIKH PASHA</span><span>CEO / BISMILLAH TEXTILES (PVT) LIMITED</span></figcaption></figure>
      </section>
      <section className="page-section about-materials"><div className="about-materials-copy"><span className="micro-label">OUR APPROACH / CEO MESSAGE</span><h2>“Is this the way I would like my suppliers to deal with me?”</h2><p>Our mission is to build a strong company through quality and diversified products, professional and courteous conduct, integrity, and responsive service to our customers.</p></div><figure className="about-materials-figure"><img src="/images/1791856226013_1791856385316.jpg" alt="Yarn preparation machinery at Bismillah Textiles" /><figcaption><span>YARN PREPARATION / BISMILLAH TEXTILES</span></figcaption></figure></section>
      <section className="page-section"><SectionTitle number="02" title="Our values" intro="The principles that shape how we work, serve and grow." /><FactGrid items={[
        { number: '01', title: 'Quality', text: 'We take quality seriously, with no compromises. We believe it is a defining and differentiating factor, and take pride in the quality of our products.' },
        { number: '02', title: 'Integrity', text: 'We strive to operate with a strong moral compass and conduct ourselves honestly, truthfully, and consistently.' },
        { number: '03', title: 'Competitiveness', text: 'We work to become more efficient manufacturers and leaders in adopting newer, advanced technologies and techniques.' },
        { number: '04', title: 'Innovation', text: 'We invest in developments for our customers and share our manufacturing expertise to develop new designs, fabrics, and retail products.' },
      ]} /></section>
      <section className="page-section r-and-d"><div><span className="micro-label">FIBER TO FABRIC</span><h2>Research & development</h2><p>Keeping in line with our vision, we have invested in a state-of-the-art research and development facility. Our goal is to innovate from fiber to fabric with a focus on sustainability and wellbeing.</p></div><div className="belief-list"><article><span>ENVIRONMENT</span><p>We strive to conserve resources and develop an environmentally sustainable manufacturing process.</p></article><article><span>ETHICS</span><p>We promote high ethical values among our employees and a moral compass that does not waver.</p></article><article><span>SOCIAL RESPONSIBILITY</span><p>Giving back to our community is part of our familial values and an important reason we come to work every day.</p></article></div></section>
      <section className="page-section"><SectionTitle number="03" title="Key team members" /><div className="team-grid"><article><h3>Abdul Hafeez Sheikh Pasha</h3><span>CEO, Bismillah Textiles (PVT) Limited</span></article><article><h3>Adham Sheikh</h3><span>Director, Strategic Marketing</span><a href="mailto:adham@bismillah.com.pk">adham@bismillah.com.pk</a></article><article><h3>Uzair Anwar</h3><span>COO</span><a href="mailto:uzair@bismillah.com.pk">uzair@bismillah.com.pk</a></article><article><h3>Javed Maqbool</h3><span>GM Marketing</span><a href="mailto:javed@bismillah.com.pk">javed@bismillah.com.pk</a></article></div></section>
    </PageFrame>
  );
}

const facilityDetails = [
  { number: '01', name: 'Weaving', capacity: '136 air-jet looms', detail: 'Installed capacity exceeds one million metres per month. We weave jacquard, matelasse, dobby, plain and other fabrics from 120 to 600 thread count.' },
  { number: '02', name: 'Yarn dyeing', capacity: '180,000 kg / month', detail: 'An in-house cone-dyeing facility produces quality dyed yarn and distinctive combinations of designs.' },
  { number: '03', name: 'Processing', capacity: 'Over 4 million metres / month', detail: 'Two continuous bleaching ranges, three rotary printing machines and two continuous dyeing ranges.' },
  { number: '04', name: 'Cut and sew', capacity: '18 stitching units', detail: 'A modern stitching facility with cut-to-pack capacity of over four million metres per month.' },
  { number: '05', name: 'Embroidery', capacity: 'Up to 400 × 1,200 mm', detail: 'High-speed, multi-needle embroidery machinery supports a range of detailed designs.' },
  { number: '06', name: 'Wadding and quilting', capacity: '500,000 metres quilted / month', detail: 'Eighteen single-needle computerized quilters and two multi-needle continuous machines; wadding production exceeds 175,000 kg per month.' },
];

export function FacilitiesPage() {
  return (
    <PageFrame number="02" title={<>One connected<br /><em>way of making.</em></>} lead="We weave, process and stitch in-house at our modern manufacturing facilities in Faisalabad, Pakistan." image="/images/1791856251182_1791856385300.jpg" imageAlt="Weaving machinery on the Bismillah Textiles production floor" caption="FROM YARN TO FINISHED FABRIC">
      <section className="page-section"><SectionTitle number="01" title="Manufacturing facilities" intro="An integrated set of operations connects each stage of textile production." /><div className="facility-cards">{facilityDetails.map((item) => <article className="facility-card" key={item.name}><span className="micro-label">{item.number} / PROCESS</span><h3>{item.name}</h3><strong>{item.capacity}</strong><p>{item.detail}</p></article>)}</div></section>
      <figure className="feature-photo"><img src="/images/main-gate.jpg" alt="Main gate at the Bismillah Textiles facility" /><figcaption><span>THE MAIN GATE</span><span>01 KM JARANWALA ROAD · KHURRIANWALA</span></figcaption></figure>
      <section className="page-section"><SectionTitle number="02" title="A real view of our work" intro="Explore selected views of the campus and production floor behind our day-to-day manufacturing." /><div className="process-photo-grid"><figure><img src="/images/1791855918484_1791856385398.jpg" alt="Fabric inspection area inside the textile facility" /><figcaption>FABRIC INSPECTION</figcaption></figure><figure><img src="/images/1791856226013_1791856385316.jpg" alt="Yarn preparation machinery inside the mill" /><figcaption>YARN PREPARATION</figcaption></figure><figure><img src="/images/1791856048064_1791856385381.jpg" alt="Textile machinery inside the production hall" /><figcaption>PRODUCTION FLOOR</figcaption></figure></div></section>
    </PageFrame>
  );
}

type Partner = { name: string; logo: string };

const manufacturedBrands: Partner[] = [
  { name: 'Disney', logo: '/images/brands/disney.png' },
  { name: 'Mainstays', logo: '/images/brands/mainstays.png' },
  { name: 'Nautica', logo: '/images/brands/nautica.png' },
  { name: 'Next', logo: '/images/brands/next-manufactured.png' },
  { name: 'DKNY', logo: '/images/brands/dkny.png' },
  { name: 'Missoni', logo: '/images/brands/missoni.png' },
  { name: 'Kate Spade', logo: '/images/brands/kate-spade.png' },
  { name: 'Threshold', logo: '/images/brands/threshold.png' },
  { name: 'Pottery Barn', logo: '/images/brands/pottery-barn.png' },
  { name: 'Fieldcrest', logo: '/images/brands/fieldcrest.png' },
  { name: 'Waverly', logo: '/images/brands/waverly.png' },
  { name: 'Woolrich', logo: '/images/brands/woolrich.png' },
  { name: 'Wamsutta', logo: '/images/brands/wamsutta.png' },
];

const retailPartners: Partner[] = [
  { name: 'Bed Bath & Beyond', logo: '/images/brands/bed-bath-beyond.png' },
  { name: 'Kmart', logo: '/images/brands/kmart.png' },
  { name: 'Carrefour', logo: '/images/brands/carrefour.png' },
  { name: 'Dillard’s', logo: '/images/brands/dillards.png' },
  { name: 'Next', logo: '/images/brands/next-retailer.jpg' },
  { name: 'Tchibo', logo: '/images/brands/tchibo.png' },
  { name: 'Walmart', logo: '/images/brands/walmart.png' },
  { name: 'Macy’s', logo: '/images/brands/macys.png' },
  { name: 'Target', logo: '/images/brands/target.png' },
  { name: 'Sears', logo: '/images/brands/sears.png' },
  { name: 'Kohl’s', logo: '/images/brands/kohls.png' },
  { name: 'Williams-Sonoma', logo: '/images/brands/williams-sonoma.png' },
  { name: 'Lidl Supermarkets', logo: '/images/brands/lidl-supermarkets.png' },
];

function PartnerGroup({ title, partners }: { title: string; partners: Partner[] }) {
  return (
    <section className="brand-group">
      <h3>{title}</h3>
      <div className="partner-grid">
        {partners.map((partner) => (
          <figure className="partner-card" key={partner.name + partner.logo}>
            <div className="partner-logo-frame"><img src={partner.logo} alt={partner.name + ' logo'} loading="lazy" /></div>
            <figcaption>{partner.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function BrandsPage() {
  return (
    <PageFrame number="03" title={<>Made here.<br /><em>Known worldwide.</em></>} lead="Since 1989, Bismillah Textiles has supplied products to textile brands and retailers around the world." image="/images/factory-courtyard.jpg" imageAlt="Bismillah Textiles campus and production buildings" caption="PARTNERSHIPS ACROSS SIX CONTINENTS">
      <section className="page-section"><SectionTitle number="01" title="Brands and retailers" intro="Brands we manufacture for and retailers we proudly serve." /><PartnerGroup title="Brands Manufactured" partners={manufacturedBrands} /><PartnerGroup title="Retailers" partners={retailPartners} /></section>
      <section className="page-section partnership-note"><div><span className="micro-label">BUILT ON LONG-TERM PARTNERSHIPS</span><h2>Quality work.<br /><em>Trusted relationships.</em></h2></div><p>Since 1989, we have supplied products to major textile retailers around the world.</p><a className="inline-link" href="mailto:sales@bismillah.com.pk">Contact sales <ArrowUpRight size={15} /></a></section>
    </PageFrame>
  );
}

export function ProductsPage() {
  return (
    <PageFrame number="04" title={<>Textiles for<br /><em>everyday living.</em></>} lead="Our vertically integrated facilities produce and export home textiles for established brands and retailers around the world." image="/images/1791855918484_1791856385398.jpg" imageAlt="Fabric being inspected inside the Bismillah Textiles facility" caption="MADE WITH CARE IN FAISALABAD">
      <section className="page-section"><SectionTitle number="01" title="Our product areas" intro="Our product range spans four broad categories." /><div className="product-grid">
        <article><BedDouble /><span>01 / HOME</span><h3>Home textiles</h3><p>Textile products made for the home, produced through our integrated in-house processes.</p></article>
        <article><Layers3 /><span>02 / FABRIC</span><h3>Fabric</h3><p>Woven, dyed, printed and finished fabrics developed across a range of constructions.</p></article>
        <article><Hotel /><span>03 / HOSPITALITY</span><h3>Hospitality</h3><p>Textile products for hospitality customers, supported by our production capabilities.</p></article>
        <article><Shirt /><span>04 / APPAREL</span><h3>Garments and apparel fabrics</h3><p>Apparel fabrics and related products within our broader textile portfolio.</p></article>
      </div></section>
      <ProductCatalog />
      <section className="page-section product-capability"><div><span className="micro-label">DESIGN TO DELIVERY</span><h2>Connected production,<br /><em>consistent quality.</em></h2></div><p>We bring weaving, processing and stitching together at our own facilities. To discuss a product or sourcing requirement, contact our sales department.</p><a className="button button-red" href="mailto:sales@bismillah.com.pk">Enquire about products <ArrowUpRight size={15} /></a></section>
    </PageFrame>
  );
}

export function CareersPage() {
  return (
    <PageFrame number="05" title={<>Build your future<br /><em>with our team.</em></>} lead="We offer opportunities for learning, development and career progression across our textile operations in Pakistan." image="/images/1791855918484_1791856385398.jpg" imageAlt="Team members at work in the fabric inspection area" caption="PEOPLE MAKE THE WORK">
      <section className="page-story-grid careers-grid"><div><SectionTitle number="01" title="Career development" intro="We value a learning culture that supports employee development and growth." /><p>We identify learning and development needs in relation to our company goals, job requirements and long-term development. We look for innovative, creative thinkers and self-starters with an entrepreneurial mindset.</p></div><div className="career-callout"><Scissors /><span className="micro-label">CAREER OPPORTUNITIES</span><h2>Bring your skills<br />to the work.</h2><p>For career enquiries, contact the careers team by email.</p><a className="button button-red" href="mailto:jobs@bismillah.com.pk">Email careers <ArrowUpRight size={15} /></a></div></section>
      <section className="page-section"><SectionTitle number="02" title="A workplace to grow" /><FactGrid items={[
        { number: '01', title: 'Learning', text: 'We recognize learning, development and employee grooming.' },
        { number: '02', title: 'Opportunity', text: 'Employees are encouraged to develop and use their professional knowledge and skills.' },
        { number: '03', title: 'Progression', text: 'We focus on career development and advancement.' },
      ]} /></section>
    </PageFrame>
  );
}

export function ContactPage() {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bismillah+Textiles+01+KM+Jaranwala+Road+Khurrianwala+Faisalabad+Pakistan';
  return (
    <PageFrame number="06" title={<>Find us in<br /><em>Khurrianwala.</em></>} lead="Contact Bismillah Textiles or visit our manufacturing campus at 01 KM Jaranwala Road, Khurrianwala, Faisalabad." image="/images/main-gate.jpg" imageAlt="Main entrance gate of Bismillah Textiles" caption="WELCOME TO OUR FACILITY" showCta={false}>
      <section className="page-section"><SectionTitle number="01" title="Get in touch" intro="Contact the appropriate team for textile enquiries, general questions or careers." /><div className="contact-grid">
        <article className="contact-card"><span className="micro-label">VISIT US</span><h3>Company address</h3><p>01 KM Jaranwala Road<br />Khurrianwala, Faisalabad<br />Pakistan</p><a className="inline-link" href={mapsUrl} target="_blank" rel="noreferrer">Open directions <ArrowUpRight size={15} /></a></article>
        <article className="contact-card"><span className="micro-label">PROSPECTIVE TEXTILE BUYERS</span><h3>Javed Maqbool</h3><p>GM Marketing<br />+92 41 242 8888 Ext. 102</p><a href="tel:+92412428888;ext=102">Call the textile sales contact</a><a href="mailto:javed@bismillah.com.pk">javed@bismillah.com.pk</a><a href="mailto:sales@bismillah.com.pk">sales@bismillah.com.pk</a></article>
        <article className="contact-card"><span className="micro-label">GENERAL ENQUIRIES</span><h3>Say hello</h3><a href="tel:+92412428888">+92 41 242 8888</a><a href="mailto:info@bismillah.com.pk">info@bismillah.com.pk</a></article>
        <article className="contact-card"><span className="micro-label">CAREERS</span><h3>Join the team</h3><a href="mailto:jobs@bismillah.com.pk">jobs@bismillah.com.pk</a></article>
      </div></section>
      <figure className="contact-map"><MapEmbed /><figcaption><span>01 KM JARANWALA ROAD · KHURRIANWALA, FAISALABAD</span><a href={mapsUrl} target="_blank" rel="noreferrer">Open directions <ArrowUpRight size={14} /></a></figcaption></figure>
    </PageFrame>
  );
}

const certifications = [
  'ISO 14001:2015 — valid until 06 June 2028',
  'ZDHC Supplier to Zero, Level 1 — acknowledgement valid until 30 January 2027',
];

const certificationPreviews = [
  { name: 'ISO 14001:2015 · valid until 06 June 2028', image: '/images/certifications/iso14001.png', href: 'https://bismillah.com.pk/wp-content/uploads/2022/05/ISO-14001-2015-EMS.pdf' },
  { name: 'ZDHC Supplier to Zero · valid until 30 January 2027', image: '/images/certifications/zdhc.png', href: 'https://bismillah.com.pk/wp-content/uploads/ZDHC-Report.pdf' },
];

export function CertificationsPage() {
  return (
    <PageFrame number="07" title={<>Quality is an<br /><em>evolving process.</em></>} lead="Our quality policy combines in-house process controls, experienced technicians and current production technology." image="/images/1791856048064_1791856385381.jpg" imageAlt="Textile machinery used in the production process" caption="QUALITY THROUGH EACH STAGE">
      <section className="page-story-grid"><div><SectionTitle number="01" title="Our quality policy" /><p>“Quality is an evolving process, not a fixed standard.” We operate an extensive system of in-house quality and process control, alongside environmental, social and security requirements in our management systems.</p><p>Our policy also emphasizes modern machinery, dyes and chemicals, supported by experienced technicians in our quality-control department.</p></div><div className="quality-note"><span className="micro-label">QUALITY / PROCESS / RESPONSIBILITY</span><h2>Built into<br /><em>the process.</em></h2><p>Quality checks and controls are applied across production, not only to the finished product.</p></div></section>
      <section className="page-section"><SectionTitle number="02" title="Our certifications" intro="Current documents published by Bismillah Textiles and checked for validity before display." /><div className="certification-preview-grid">{certificationPreviews.map((item) => <a className="certification-preview-card" href={item.href} target="_blank" rel="noopener noreferrer" key={item.name}><img src={item.image} alt={`${item.name} certificate preview`} /><span>{item.name}<ArrowUpRight size={14} /></span></a>)}</div><div className="certification-grid">{certifications.map((item, index) => <div className="certification-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div><p className="small-print">Expired documents are not displayed. Validity is based on the dates shown in the linked official documents.</p></section>
    </PageFrame>
  );
}

const newsItems = [
  { year: '2025', tag: 'TRADE FAIR', title: 'Our latest textile innovations — Heimtextil 2025', summary: 'We presented our latest textile innovations at Heimtextil 2025.', details: 'This company-reported update does not list individual products or show an article publication date; no further details are inferred.' },
  { year: '2024', tag: 'COMMUNITY', title: 'Planting on Independence Day', summary: 'A Green Touch initiative marked Independence Day and reflected our community and sustainability commitments.', details: 'The available company update does not provide participant counts or follow-up outcomes.' },
  { year: '2020', tag: 'RECOGNITION', title: 'Most Sustainable Textiles Manufacturer — Asia', summary: 'Corporate Vision magazine reported the award in 2020.', details: 'This is a company-reported recognition from UK-based Corporate Vision magazine. Award criteria and independent verification are not presented here.' },
];

export function NewsPage() {
  return (
    <PageFrame number="08" title={<>Progress, people<br /><em>and new ideas.</em></>} lead="Updates from Bismillah Textiles, including recognition, industry events and community initiatives." image="/images/factory-courtyard.jpg" imageAlt="Bismillah Textiles site in Faisalabad" caption="NEWS FROM OUR COMPANY">
      <section className="page-section"><SectionTitle number="01" title="Latest news" intro="Our latest stories and milestones." /><div className="news-grid">{newsItems.map((item, index) => <article className={`news-card news-card-${index + 1}`} key={item.year}><div className="news-card-top"><span>{item.tag}</span><time>{item.year}</time></div><h3>{item.title}</h3><p>{item.summary}</p><details className="news-read-more"><summary>Read more</summary><p>{item.details}</p></details></article>)}</div></section>
      <figure className="feature-photo"><img src="/images/main-gate.jpg" alt="Bismillah Textiles main gate" /><figcaption><span>ROOTED IN FAISALABAD</span><span>LOOKING AHEAD SINCE 1989</span></figcaption></figure>
      <section className="page-section news-insights-hub"><SectionTitle number="02" title="News, markets and industry context" intro="Related briefings are grouped here so the main navigation stays focused without removing any research or company content." /><div className="news-insights-links"><Link href="/markets-industry-insights/"><span className="micro-label">MARKETS &amp; INDUSTRY INSIGHTS</span><h3>Read the evidence behind the market.</h3><p>Global fibre data, Pakistan trade context, standards and sourcing notes with dates and limits visible.</p><span className="inline-link">Open market insights <ArrowRight size={15} /></span></Link><Link href="/international-news/"><span className="micro-label">INTERNATIONAL TEXTILE BRIEFING</span><h3>Follow the signals shaping the industry.</h3><p>Selected developments in materials, standards, trade and design from international sources.</p><span className="inline-link">Open international briefing <ArrowRight size={15} /></span></Link></div></section>
    </PageFrame>
  );
}
