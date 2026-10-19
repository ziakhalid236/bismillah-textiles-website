import { ArrowRight, ArrowUpRight, CalendarDays, Globe2, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import './international-news.css';

type Bulletin = {
  date: string;
  tag: string;
  title: string;
  summary: string;
  source: string;
  href: string;
  internal?: boolean;
};

const bulletins: Bulletin[] = [
  {
    date: '22 SEP 2026',
    tag: 'MATERIALS',
    title: 'A clearer baseline for global fibre production.',
    summary: 'Textile Exchange’s Materials Market Report 2026 puts 2025 fibre production in context and separates global material supply from individual company performance.',
    source: 'Textile Exchange',
    href: 'https://textileexchange.org/knowledge-center/reports/materials-market-report-2026/',
  },
  {
    date: '12–15 JAN 2027',
    tag: 'TRADE FAIR / DESIGN',
    title: 'Heimtextil looks toward the next design cycle.',
    summary: 'The Frankfurt trade fair’s announced 27/28 trend framework, Home Maxxing, explores the performance of everyday living across home interiors.',
    source: 'Heimtextil',
    href: 'https://heimtextil.messefrankfurt.com/frankfurt/en.html',
  },
  {
    date: '31 DEC 2026',
    tag: 'STANDARDS',
    title: 'Materials standards move through transition.',
    summary: 'Textile Exchange’s Materials Matter criteria become effective at the end of 2026 and mandatory from the end of 2027, subject to the organisation’s transition rules.',
    source: 'Textile Exchange',
    href: 'https://textileexchange.org/standards/',
  },
  {
    date: '2025 DATA / 15 OCT 2026',
    tag: 'TRADE DATA',
    title: 'Pakistan’s home-textile trade in context.',
    summary: 'UN Comtrade HS 6302 records offer a destination-level lens for bed, table, toilet and kitchen linen. They are national trade records, not Bismillah revenue or customer data.',
    source: 'UN Comtrade',
    href: 'https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=586&period=2025&cmdCode=6302&flowCode=X&partner2Code=0&motCode=0&includeDesc=true',
  },
  {
    date: 'COMPANY UPDATE / 2025',
    tag: 'BISMILLAH TEXTILES',
    title: 'From Faisalabad to the international textile calendar.',
    summary: 'Bismillah Textiles’ company news records its Heimtextil 2025 presence. Read the company-published update separately from independent market data.',
    source: 'Bismillah Textiles',
    href: '/news/',
    internal: true,
  },
];

export function InternationalNewsPage() {
  return (
    <div className="international-news-page">
      <section className="international-news-hero section-pad">
        <div className="international-news-hero-copy">
          <div className="section-kicker"><span>10</span><span className="kicker-rule" /> INTERNATIONAL TEXTILE BRIEFING</div>
          <h1>What is shaping<br /><em>the industry.</em></h1>
          <p>Selected international developments in materials, standards, trade and design that matter to the home-textile value chain.</p>
          <div className="international-news-actions"><a className="button button-red" href="#bulletins">Read the brief <ArrowRight size={16} /></a><span>Updated 19 October 2026</span></div>
        </div>
        <aside className="international-news-hero-panel" aria-label="International textile briefing">
          <Globe2 size={24} aria-hidden="true" />
          <span className="micro-label">A GLOBAL VIEW / WITH LIMITS VISIBLE</span>
          <strong>Materials.<br />Markets.<br />Momentum.</strong>
          <p>We separate company updates from wider industry evidence so every signal has the right context.</p>
        </aside>
      </section>
      <section className="international-news-scope section-pad"><ShieldCheck size={20} aria-hidden="true" /><p><strong>Read the source.</strong> This page is a curated briefing, not a live wire service. Dates and links point to the publisher’s page; national trade records and global research should not be read as Bismillah Textiles’ own sales or performance.</p></section>
      <section className="international-news-list section-pad" id="bulletins">
        <div className="international-news-heading"><div><div className="section-kicker"><span>01</span><span className="kicker-rule" /> LATEST SIGNALS</div><h2>Five stories worth<br /><em>keeping in view.</em></h2></div><p>Concise context for buyers, partners and people following the textile industry from Pakistan to international markets.</p></div>
        <div className="international-news-grid">{bulletins.map((item, index) => {
          const content = <><div className="international-news-card-top"><span>{item.tag}</span><time><CalendarDays size={13} />{item.date}</time></div><h3>{item.title}</h3><p>{item.summary}</p><span className="international-news-card-link">{item.internal ? 'Read company news' : `Open ${item.source}`} <ArrowUpRight size={15} /></span></>;
          return item.internal ? <Link className={`international-news-card international-news-card-${index + 1} internal` } href={item.href} key={item.title}>{content}</Link> : <a className={`international-news-card international-news-card-${index + 1}`} href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}>{content}</a>;
        })}</div>
      </section>
      <section className="international-news-footer section-pad"><TrendingUp size={20} aria-hidden="true" /><div><span className="micro-label">KEEP EXPLORING</span><h2>For the company story,<br /><em>start in Faisalabad.</em></h2></div><Link className="button button-red" href="/markets-industry-insights/">See market insights <ArrowRight size={16} /></Link></section>
    </div>
  );
}
