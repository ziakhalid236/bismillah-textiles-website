import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BedDouble, Hotel, Layers3, Scissors, Shirt } from 'lucide-react';
import { Link } from 'wouter';

const mapsEmbedUrl = 'https://maps.google.com/maps?q=Bismillah+Textiles+%28PVT%29+Limited+Khurrianwala+Faisalabad+Pakistan&output=embed';

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
};

function PageFrame({ number, title, lead, image, imageAlt, caption, children }: PageFrameProps) {
  return (
    <div className="content-page">
      <section className="interior-hero section-pad">
        <div className="interior-hero-copy">
          <div className="section-kicker"><span>{number}</span><span className="kicker-rule" /> BISMILLAH TEXTILES</div>
          <h1>{title}</h1>
          <p>{lead}</p>
          <Link className="button button-red" href="/contact-us/">Talk to our team <ArrowRight size={16} /></Link>
        </div>
        <figure className="interior-hero-visual">
          <img src={image} alt={imageAlt} />
          <figcaption><span>{caption}</span><span>KHURRIANWALA, PAKISTAN</span></figcaption>
        </figure>
      </section>
      <div className="page-content section-pad">{children}</div>
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
    <PageFrame number="01" title={<>A family business,<br /><em>built to last.</em></>} lead="Founded in 1989 in Faisalabad, Bismillah Textiles has grown into a vertically integrated home textile manufacturer." image="/images/about-factory-team.jpg" imageAlt="Bismillah Textiles team working on fabric in the factory" caption="ON THE FACTORY FLOOR">
      <section className="page-story-grid">
        <div><SectionTitle number="01" title="Our vision and philosophy" /><p>As a family business, our vision extends beyond financial quarters. We are driven by a generational responsibility to create value for our employees, customers and community.</p><p>Our goal is to manufacture quality textile products with integrity, conduct ourselves in a professional and courteous manner, and exceed our customers’ expectations through efficient service.</p></div>
       <figure className="ceo-card"><img src="/images/abdul-hafeez-sheikh-pasha.jpg" alt="Abdul Hafeez Sheikh Pasha, featured on the company website" /><figcaption><span>ABDUL HAFEEZ SHEIKH PASHA</span><span>LEADERSHIP PROFILE ON COMPANY WEBSITE</span></figcaption></figure>
      </section>
      <section className="page-section about-materials"><div className="about-materials-copy"><span className="micro-label">THE MATERIAL / YARN CONES</span><h2>From fine threads<br /><em>to finished fabric.</em></h2><p>Yarn cones are one of the building blocks of woven textiles, where precision at every stage helps shape the finished cloth.</p></div><figure className="about-materials-figure"><img src="/images/unsplash-thread-cones.jpg" alt="Natural thread wound on yarn cones" /><figcaption><span>THREAD CONES / MATERIAL DETAIL</span><a href="https://unsplash.com/photos/spools-of-thread-are-stacked-neatly-together-c7oXxJncV6o" target="_blank" rel="noreferrer">PHOTO: CAROLINE BADRAN / UNSPLASH <ArrowUpRight size={12} /></a></figcaption></figure></section>
      <section className="page-section ceo-message"><span className="micro-label">OUR APPROACH</span><h2>“Is this the way I would like my suppliers to deal with me?”</h2><p>Our mission is to build a strong company through quality and diversified products, professional and courteous conduct, integrity, and responsive service. We take pride in our customers’ satisfaction and in protecting the reputation we have built together.</p></section>
      <section className="page-section"><SectionTitle number="02" title="Our values" intro="The principles that shape how we work, serve and grow." /><FactGrid items={[
        { number: '01', title: 'Quality', text: 'We take quality seriously and consider it a defining strength of our products.' },
        { number: '02', title: 'Integrity', text: 'We aim to operate honestly, truthfully and consistently.' },
        { number: '03', title: 'Competitiveness', text: 'We work to become more efficient and adopt advanced technologies and techniques.' },
        { number: '04', title: 'Innovation', text: 'We develop new designs, fabrics and retail products with our customers.' },
      ]} /></section>
      <section className="page-section r-and-d"><div><span className="micro-label">FIBER TO FABRIC</span><h2>Research & development</h2><p>Our investment in a dedicated R&D facility supports innovation with a focus on sustainability and wellbeing.</p></div><div className="belief-list"><span>ENVIRONMENT</span><span>ETHICS</span><span>SOCIAL RESPONSIBILITY</span></div></section>
      <section className="page-section"><SectionTitle number="03" title="A team behind the work" /><div className="team-grid"><article><h3>Adham Sheikh</h3><span>Chief Executive Officer</span><span>Also listed as Director, Strategic Marketing on the company website</span><a href="mailto:adham@bismillah.com.pk">adham@bismillah.com.pk</a><a className="team-social" href="https://x.com/MAdhamSheikh" target="_blank" rel="noreferrer">X profile <ArrowUpRight size={13} /></a></article><article><h3>Uzair Anwar</h3><span>Chief Operating Officer</span><a href="mailto:uzair@bismillah.com.pk">uzair@bismillah.com.pk</a></article><article><h3>Javed Maqbool</h3><span>General Manager, Marketing</span><a href="mailto:javed@bismillah.com.pk">javed@bismillah.com.pk</a></article></div><p className="leadership-note">The company <a href="https://bismillah.com.pk/about-us/" target="_blank" rel="noreferrer">About page</a> still identifies Abdul Hafeez Sheikh Pasha as CEO and lists Adham as Director, Strategic Marketing. A <a href="https://www.linkedin.com/posts/bismillah-textiles_adham-sheikh-madhamsheikh-on-x-activity-7403818195259949056-WIpk" target="_blank" rel="noreferrer">company LinkedIn announcement</a> and Adham’s <a href="https://x.com/MAdhamSheikh" target="_blank" rel="noreferrer">X profile</a> identify Adham as CEO. Please confirm the current title directly with the company.</p></section>
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

const partners = ['Disney', 'Mainstays', 'Nautica', 'Next', 'DKNY', 'Missoni', 'Kate Spade', 'Threshold', 'Pottery Barn', 'Fieldcrest', 'Waverly', 'Woolrich', 'Wamsutta', 'Bed Bath & Beyond', 'Kmart', 'Carrefour', 'Dillard’s', 'Tchibo', 'Walmart', 'Macy’s', 'Target', 'Sears', 'Kohl’s', 'Williams-Sonoma'];

export function BrandsPage() {
  return (
    <PageFrame number="03" title={<>Made here.<br /><em>Known worldwide.</em></>} lead="Since 1989, Bismillah Textiles has supplied products to major textile brands and retailers around the world." image="/images/factory-courtyard.jpg" imageAlt="Bismillah Textiles campus and production buildings" caption="PARTNERSHIPS ACROSS SIX CONTINENTS">
      <section className="page-section"><SectionTitle number="01" title="Brands and retailers" intro="The company’s live website features these names among its manufactured brands and retail partners." /><div className="partner-grid">{partners.map((name, index) => <div className="partner-name" key={name}><span>{String(index + 1).padStart(2, '0')}</span>{name}</div>)}</div></section>
      <section className="page-section partnership-note"><div><span className="micro-label">BUILT ON LONG-TERM PARTNERSHIPS</span><h2>Quality work.<br /><em>Trusted relationships.</em></h2></div><p>Bismillah Textiles reports serving major textile retailers worldwide since 1989, with customers across six continents. For product and sourcing enquiries, contact our sales team.</p><a className="inline-link" href="mailto:sales@bismillah.com.pk">Contact sales <ArrowUpRight size={15} /></a></section>
    </PageFrame>
  );
}

export function ProductsPage() {
  return (
    <PageFrame number="04" title={<>Textiles for<br /><em>everyday living.</em></>} lead="Our vertically integrated facilities produce and export home textiles for established brands and retailers around the world." image="/images/1791855918484_1791856385398.jpg" imageAlt="Fabric being inspected inside the Bismillah Textiles facility" caption="MADE WITH CARE IN FAISALABAD">
      <section className="page-section"><SectionTitle number="01" title="Our product areas" intro="The live company website highlights four broad product categories." /><div className="product-grid">
        <article><BedDouble /><span>01 / HOME</span><h3>Home textiles</h3><p>Textile products made for the home, produced through integrated in-house processes.</p></article>
        <article><Layers3 /><span>02 / FABRIC</span><h3>Fabric</h3><p>Woven, dyed, printed and finished fabrics developed across a range of constructions.</p></article>
        <article><Hotel /><span>03 / HOSPITALITY</span><h3>Hospitality</h3><p>Textile products for hospitality customers, supported by the company’s production capabilities.</p></article>
        <article><Shirt /><span>04 / APPAREL</span><h3>Garments and apparel fabrics</h3><p>Apparel fabrics and related products within the company’s broader textile portfolio.</p></article>
      </div></section>
      <section className="page-section product-capability"><div><span className="micro-label">DESIGN TO DELIVERY</span><h2>Connected production,<br /><em>consistent quality.</em></h2></div><p>We bring weaving, processing and stitching together at our own facilities. To discuss a product or sourcing requirement, contact our sales department.</p><a className="button button-red" href="mailto:sales@bismillah.com.pk">Enquire about products <ArrowUpRight size={15} /></a></section>
    </PageFrame>
  );
}

export function CareersPage() {
  return (
    <PageFrame number="05" title={<>Build your future<br /><em>with our team.</em></>} lead="Bismillah Textiles describes a learning culture focused on employee development, opportunity and long-term growth." image="/images/1791855918484_1791856385398.jpg" imageAlt="Team members at work in the fabric inspection area" caption="PEOPLE MAKE THE WORK">
      <section className="page-story-grid careers-grid"><div><SectionTitle number="01" title="Career development" intro="A conducive learning culture recognizes the importance of learning, development and employee growth." /><p>The company says it identifies learning and development needs against its organizational goals, job requirements and long-term development. Its values emphasize creative thinkers, self-starters and people with an entrepreneurial mindset.</p></div><div className="career-callout"><Scissors /><span className="micro-label">CAREER OPPORTUNITIES</span><h2>Bring your skills<br />to the work.</h2><p>For current opportunities and application details, contact the careers team directly.</p><a className="button button-red" href="mailto:jobs@bismillah.com.pk">Email careers <ArrowUpRight size={15} /></a></div></section>
      <section className="page-section"><SectionTitle number="02" title="A workplace to grow" /><FactGrid items={[
        { number: '01', title: 'Learning', text: 'Development and grooming are recognized as part of a strong working culture.' },
        { number: '02', title: 'Opportunity', text: 'Employees are encouraged to use and grow their professional knowledge and skills.' },
        { number: '03', title: 'Progression', text: 'The company describes a focus on career development and advancement.' },
      ]} /></section>
    </PageFrame>
  );
}

export function ContactPage() {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Bismillah+Textiles+1+KM+Jaranwala+Road+Khurrianwala+Faisalabad+Pakistan';
  return (
    <PageFrame number="06" title={<>Find us in<br /><em>Khurrianwala.</em></>} lead="Visit or contact Bismillah Textiles at its manufacturing campus on Jaranwala Road, Faisalabad." image="/images/main-gate.jpg" imageAlt="Main entrance gate of Bismillah Textiles" caption="WELCOME TO OUR FACILITY">
      <section className="page-section"><SectionTitle number="01" title="Get in touch" intro="For visits, general enquiries, textile sourcing or career questions, reach the appropriate team below." /><div className="contact-grid">
        <article className="contact-card"><span className="micro-label">VISIT US</span><h3>Company address</h3><p>01 KM Jaranwala Road<br />Khurrianwala, Faisalabad<br />Pakistan</p><a className="inline-link" href={mapsUrl} target="_blank" rel="noreferrer">Open directions <ArrowUpRight size={15} /></a></article>
        <article className="contact-card"><span className="micro-label">CALL</span><h3>Telephone</h3><a href="tel:+92412428888">+92 41 242 8888</a><a href="tel:+92412428800">+92 41 242 8800</a><span className="contact-note">Main telephone and secondary line</span></article>
        <article className="contact-card"><span className="micro-label">GENERAL ENQUIRIES</span><h3>Write to us</h3><a href="mailto:info@bismillah.com.pk">info@bismillah.com.pk</a><a href="mailto:sales@bismillah.com.pk">sales@bismillah.com.pk</a><span className="contact-note">General and sales departments</span></article>
        <article className="contact-card"><span className="micro-label">CAREERS</span><h3>Join the team</h3><a href="mailto:jobs@bismillah.com.pk">jobs@bismillah.com.pk</a><span className="contact-note">Enquiries about current opportunities</span></article>
      </div></section>
      <figure className="contact-map"><MapEmbed /><figcaption><span>01 KM JARANWALA ROAD · KHURRIANWALA, FAISALABAD</span><a href={mapsUrl} target="_blank" rel="noreferrer">Open directions <ArrowUpRight size={14} /></a></figcaption></figure>
    </PageFrame>
  );
}

const certifications = ['SA 8000:2014', 'SLCP Certificate', 'Sedex members ethical trade audit report', 'ISO 9001:2015', 'ISO 14001:2015', 'OEKO-TEX (Made-ups)', 'OEKO-TEX (Fabrics)', 'OEKO-TEX (Commission)', 'Detox Test Report'];

export function CertificationsPage() {
  return (
    <PageFrame number="07" title={<>Quality is an<br /><em>evolving process.</em></>} lead="The company’s quality policy combines in-house process controls, experienced technicians and current production technology." image="/images/1791856048064_1791856385381.jpg" imageAlt="Textile machinery used in the production process" caption="QUALITY THROUGH EACH STAGE">
      <section className="page-story-grid"><div><SectionTitle number="01" title="Our quality policy" /><p>“Quality is an evolving process, not a fixed standard.” The company describes an extensive system of in-house quality and process control, alongside environmental, social and security requirements in its management systems.</p><p>Its policy also highlights the use of modern machinery, dyes and chemicals, supported by experienced technicians in the quality-control department.</p></div><div className="quality-note"><span className="micro-label">QUALITY / PROCESS / RESPONSIBILITY</span><h2>Built into<br /><em>the process.</em></h2><p>Quality checks and controls are applied across production, not only to the finished product.</p></div></section>
      <section className="page-section"><SectionTitle number="02" title="Certifications listed by the company" intro="These are the certifications and reports named on the current company website." /><div className="certification-grid">{certifications.map((item, index) => <div className="certification-item" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div><p className="small-print">For current scope, validity dates and certificate copies, please confirm directly with Bismillah Textiles.</p></section>
    </PageFrame>
  );
}

const newsItems = [
  { year: '2020', tag: 'RECOGNITION', title: 'Most Sustainable Textiles Manufacturer — Asia', text: 'Bismillah Textiles announced that it received the “Most Sustainable Textiles Manufacturer 2020 — Asia” award from the UK-based Corporate Vision magazine.' },
  { year: '2025', tag: 'TRADE FAIR', title: 'Our latest textile innovations — Heimtextil 2025', text: 'The company’s news page highlights its latest textile innovations presented at Heimtextil 2025.' },
  { year: '2024', tag: 'COMMUNITY', title: 'Planting on Independence Day', text: 'A Green Touch initiative marking Independence Day and reflecting the company’s stated commitment to sustainability and community wellbeing.' },
];

export function NewsPage() {
  return (
    <PageFrame number="08" title={<>Progress, people<br /><em>and new ideas.</em></>} lead="Updates from Bismillah Textiles, including recognition, industry events and community initiatives." image="/images/factory-courtyard.jpg" imageAlt="Bismillah Textiles site in Faisalabad" caption="NEWS FROM OUR COMPANY">
      <section className="page-section"><SectionTitle number="01" title="Latest news" intro="Stories and milestones published on the company’s live website." /><div className="news-grid">{newsItems.map((item, index) => <article className={`news-card news-card-${index + 1}`} key={item.year}><div className="news-card-top"><span>{item.tag}</span><time>{item.year}</time></div><h3>{item.title}</h3><p>{item.text}</p><a href="https://bismillah.com.pk/news/" target="_blank" rel="noreferrer">View company news <ArrowUpRight size={14} /></a></article>)}</div></section>
      <figure className="feature-photo"><img src="/images/main-gate.jpg" alt="Bismillah Textiles main gate" /><figcaption><span>ROOTED IN FAISALABAD</span><span>LOOKING AHEAD SINCE 1989</span></figcaption></figure>
    </PageFrame>
  );
}
