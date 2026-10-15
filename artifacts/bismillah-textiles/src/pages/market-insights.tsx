import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Factory,
  Globe2,
  Leaf,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'wouter';
import './market-insights.css';

const fiberVolumes = [
  { name: 'All fibres', earlier: '132', earlierBar: 'mi-fibre-2024-all', latest: '139', latestBar: 'mi-fibre-2025-all' },
  { name: 'Polyester', earlier: '77.7', earlierBar: 'mi-fibre-2024-polyester', latest: '82.5', latestBar: 'mi-fibre-2025-polyester' },
  { name: 'Cotton', earlier: '25.4', earlierBar: 'mi-fibre-2024-cotton', latest: '25.7', latestBar: 'mi-fibre-2025-cotton' },
];

const exportMarkets = [
  { name: 'United States', label: 'US$1,049m', bar: 'mi-export-us' },
  { name: 'United Kingdom', label: 'US$607m', bar: 'mi-export-uk' },
  { name: 'Netherlands', label: 'US$434m', bar: 'mi-export-nl' },
  { name: 'Germany', label: 'US$400m', bar: 'mi-export-de' },
  { name: 'Italy', label: 'US$277m', bar: 'mi-export-it' },
  { name: 'Spain', label: 'US$261m', bar: 'mi-export-es' },
];

type Source = { type: string; name: string; detail: string; href: string; link: string; internal?: boolean };

const sources: Source[] = [
  {
    type: 'GLOBAL FIBRE DATA',
    name: 'Textile Exchange - Materials Market Report 2026',
    detail: 'Published 22 Sep 2026 · Data period: 2025 · Global fibre and materials production.',
    href: 'https://textileexchange.org/knowledge-center/reports/materials-market-report-2026/',
    link: 'Open report',
  },
  {
    type: 'TRADE DATA',
    name: 'UN Comtrade - Pakistan, HS 6302, calendar 2025',
    detail: 'Retrieved 15 Oct 2026 · Bed, table, toilet and kitchen linen · API marks the returned records as aggregated and non-reported.',
    href: 'https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=586&period=2025&cmdCode=6302&flowCode=X&partner2Code=0&motCode=0&includeDesc=true',
    link: 'Open data extract',
  },
  {
    type: 'STANDARDS',
    name: 'Textile Exchange - Standards transition',
    detail: 'Materials Matter criteria released 12 Dec 2025; effective 31 Dec 2026 and mandatory from 31 Dec 2027.',
    href: 'https://textileexchange.org/standards/',
    link: 'Read current status',
  },
  {
    type: 'TRADE FAIR & TRENDS',
    name: 'Heimtextil - 2027 event and Trends 27/28',
    detail: 'Next edition: 12-15 Jan 2027, Frankfurt · Trend framework: Home Maxxing - The Performance of Everyday Living.',
    href: 'https://heimtextil.messefrankfurt.com/frankfurt/en.html',
    link: 'Visit Heimtextil',
  },
  {
    type: 'PAKISTAN INDUSTRY',
    name: 'Pakistan Textile Exporters Association (PTEA)',
    detail: 'Association information and events · Public pages reviewed 15 Oct 2026; no current export series was visible in the pages reviewed.',
    href: 'https://ptea.org.pk/',
    link: 'Visit PTEA',
  },
  {
    type: 'COMPANY / ABOUT',
    name: 'Bismillah Textiles - About Us',
    detail: 'Company history, leadership and manufacturing approach are presented in the company profile on this site.',
    href: '/about-us/',
    link: 'Read company profile',
    internal: true,
  },
  {
    type: 'COMPANY / PRODUCTS',
    name: 'Bismillah Textiles - Products',
    detail: 'The product range and manufacturing context are presented on this site.',
    href: '/products/',
    link: 'View product page',
    internal: true,
  },
  {
    type: 'COMPANY / PARTNERS',
    name: 'Bismillah Textiles - Brands and Retailers',
    detail: 'Company-published brands and retail partners are listed on the local Brands and Retailers page.',
    href: '/brands-retailers/',
    link: 'View brands and retailers',
    internal: true,
  },
  {
    type: 'COMPANY / CERTIFICATIONS',
    name: 'Bismillah Textiles - Certifications',
    detail: 'The company-published certification list is available locally; scope and current validity require confirmation.',
    href: '/certifications/',
    link: 'View certifications',
    internal: true,
  },
  {
    type: 'COMPANY / NEWS',
    name: 'Bismillah Textiles - News',
    detail: 'Company updates are presented on this site, with years shown where original publication dates were unavailable.',
    href: '/news/',
    link: 'Read company news',
    internal: true,
  },
  {
    type: 'TRADE EXPLORER',
    name: 'ITC Trade Map',
    detail: 'The interactive page did not render data rows in this review. It is linked for users who can access the product and partner-level explorer.',
    href: 'https://www.trademap.org/',
    link: 'Open Trade Map',
  },
  {
    type: 'SHIPMENT DATABASE',
    name: 'Trademo - public platform overview',
    detail: 'Accessed 15 Oct 2026 · Platform shipment records are database observations, not audited company financial statements; no BTL-specific records are used here.',
    href: 'https://www.trademo.com/',
    link: 'Visit Trademo',
  },
];

function SourceLink({ href, children }: { href: string; children: string }) {
  return <a className="mi-source-link" href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={13} aria-hidden="true" /></a>;
}

function LocalSourceLink({ href, children }: { href: string; children: string }) {
  return <Link className="mi-source-link" href={href}>{children}<ArrowRight size={13} aria-hidden="true" /></Link>;
}

export function MarketInsightsPage() {
  return (
    <div className="insights-page">
      <section className="mi-hero section-pad">
        <div className="mi-hero-copy">
          <div className="section-kicker"><span>09</span><span className="kicker-rule" /> RESEARCH BULLETIN / 15 OCT 2026</div>
          <h1>Markets &amp; Industry<br /><em>Insights.</em></h1>
          <p>Signals for the home-textile value chain, grounded in public company information, primary industry research and trade data with its limits made visible.</p>
          <div className="mi-hero-actions">
            <a className="button button-red" href="#market-overview">Explore the data <ArrowRight size={16} /></a>
            <span>Updated 15 October 2026</span>
          </div>
        </div>
        <aside className="mi-hero-panel" aria-label="Global fibre production in 2025">
          <div className="mi-panel-top"><span>GLOBAL FIBRE OUTPUT / 2025</span><span>01 / 04</span></div>
          <div className="mi-panel-value">139<span>Mt</span></div>
          <p>estimated global fibre production across textile, clothing, leather and footwear applications.</p>
          <div className="mi-panel-divider" />
          <div className="mi-panel-foot"><strong>+7 Mt</strong><span>versus 2024</span></div>
          <small>Textile Exchange, Materials Market Report 2026. Published 22 Sep 2026; data period 2025.</small>
        </aside>
      </section>

      <nav className="mi-contents" aria-label="Page sections">
        <a href="#market-overview">Market overview</a>
        <a href="#export-markets">Export markets</a>
        <a href="#industry-signals">Industry signals</a>
        <a href="#sustainability">Sustainability</a>
        <a href="#events">Events</a>
        <a href="#sources">Sources &amp; dates</a>
      </nav>

      <div className="mi-scope-note">
        <ShieldCheck size={19} aria-hidden="true" />
        <p><strong>Evidence first.</strong> National trade flows are not Bismillah Textiles sales. Company statements, sector research and database estimates are labelled separately; no BTL market share, customer list or revenue is inferred.</p>
      </div>

      <section className="mi-section section-pad" id="market-overview">
        <div className="mi-section-heading">
          <div><div className="section-kicker"><span>01</span><span className="kicker-rule" /> GLOBAL HOME TEXTILE MARKET</div><h2>Read the material<br /><em>behind the market.</em></h2></div>
          <p>Home textiles sit within a much larger fibre system. Rather than combine differently defined commercial market estimates, this page uses a dated production baseline and clearly bounded trade codes.</p>
        </div>
        <div className="mi-market-grid">
          <article className="mi-chart-card mi-fibre-chart">
            <div className="mi-card-heading"><div><span className="micro-label">GLOBAL FIBRE PRODUCTION</span><h3>More material, still led by polyester.</h3></div><BarChart3 size={21} aria-hidden="true" /></div>
            <p className="mi-card-intro">Million tonnes by fibre category. Both years use the same 0-140 Mt scale.</p>
            <div className="mi-chart-legend"><span><i className="mi-legend-2024" />2024</span><span><i className="mi-legend-2025" />2025</span><span>Mt</span></div>
            <div className="mi-fibre-rows" role="img" aria-label="Global fibre production: all fibres 132 million tonnes in 2024 and 139 in 2025; polyester 77.7 and 82.5; cotton 25.4 and 25.7.">
              {fiberVolumes.map((item) => <div className="mi-fibre-row" key={item.name}>
                <div className="mi-fibre-label">{item.name}</div>
                <div className="mi-bar-line"><span className="mi-year-label">24</span><div className="mi-bar-track"><i className={`mi-bar-2024 ${item.earlierBar}`} /></div><strong>{item.earlier}</strong></div>
                <div className="mi-bar-line"><span className="mi-year-label">25</span><div className="mi-bar-track"><i className={`mi-bar-2025 ${item.latestBar}`} /></div><strong>{item.latest}</strong></div>
              </div>)}
            </div>
            <div className="mi-chart-foot"><span>Report coverage includes all applications; home textiles are a subset, not the full 139 Mt.</span><SourceLink href="https://textileexchange.org/knowledge-center/reports/materials-market-report-2026/">Source / 2026 report</SourceLink></div>
          </article>
          <aside className="mi-market-aside">
            <span className="micro-label">WHAT THE BASELINE SAYS</span>
            <div className="mi-aside-stat"><strong>59%</strong><span>of global fibre output was polyester in 2025; 88% of that polyester was fossil-based.</span></div>
            <div className="mi-aside-stat"><strong>18%</strong><span>of global fibre output was cotton in 2025.</span></div>
            <div className="mi-aside-stat"><strong>0.76%</strong><span>of global fibre production was textile-to-textile recycled fibre in 2025.</span></div>
            <p className="mi-small-note">These are global supply indicators, not home-textile sales, BTL performance or product-specific impact claims.</p>
          </aside>
        </div>
        <div className="mi-market-context">
          <div className="mi-context-mark"><Globe2 size={22} aria-hidden="true" /></div>
          <div><span className="micro-label">MARKET DEFINITION</span><h3>One label, several product boundaries.</h3><p>Commercial reports may include only bed and bath, or extend into curtains, upholstery, rugs and other furnishings. Textile Exchange's 2026 report is the first edition to estimate fibre volumes flowing into home-textile products specifically. Its figures describe fibre production, not retail market value.</p></div>
          <SourceLink href="https://textileexchange.org/knowledge-center/reports/materials-market-report-2026/">Read the scope</SourceLink>
        </div>
      </section>

      <section className="mi-section mi-export-section section-pad" id="export-markets">
        <div className="mi-section-heading">
          <div><div className="section-kicker"><span>02</span><span className="kicker-rule" /> INTERNATIONAL EXPORT MARKETS</div><h2>Where Pakistan's<br /><em>linen trade is recorded.</em></h2></div>
          <p>A product-level view of bed, table, toilet and kitchen linen offers a comparable trade lens. It does not identify BTL customers or the destinations of any individual manufacturer.</p>
        </div>
        <div className="mi-export-grid">
          <article className="mi-chart-card mi-export-chart">
            <div className="mi-card-heading"><div><span className="micro-label">PAKISTAN / HS 6302 / 2025</span><h3>Largest recorded destinations</h3></div><TrendingUp size={21} aria-hidden="true" /></div>
            <p className="mi-card-intro">Approximate trade value by destination, US$ millions. Bars share a common 0-1,100 scale.</p>
            <div className="mi-export-bars" role="img" aria-label="Pakistan HS 6302 2025 trade records: United States 1,049 million US dollars, United Kingdom 607 million, Netherlands 434 million, Germany 400 million, Italy 277 million, Spain 261 million.">
              {exportMarkets.map((market) => <div className="mi-export-row" key={market.name}><span>{market.name}</span><div className="mi-export-track"><i className={market.bar} /></div><strong>{market.label}</strong></div>)}
            </div>
            <div className="mi-chart-foot"><span>Calendar year 2025 · HS 6302 · UN Comtrade API extract retrieved 15 Oct 2026.</span><SourceLink href="https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=586&period=2025&cmdCode=6302&flowCode=X&partner2Code=0&motCode=0&includeDesc=true">Open data extract</SourceLink></div>
          </article>
          <aside className="mi-trade-note">
            <span className="mi-trade-number">~US$4.43bn</span>
            <span className="micro-label">WORLD TOTAL / HS 6302 / 2025</span>
            <p>The Comtrade API returned this as an aggregated, non-reported record. Treat the destination values as indicative mirror estimates, not a final Pakistan-reported customs total.</p>
            <div className="mi-trade-rule" />
            <p className="mi-trade-caveat"><strong>Not company revenue.</strong> It is a national product-code series, not an audited BTL shipment, sales or customer dataset.</p>
            <a href="https://www.trademap.org/" target="_blank" rel="noopener noreferrer">Explore ITC Trade Map <ArrowUpRight size={14} /></a>
          </aside>
        </div>
        <div className="mi-pakistan-context"><Factory size={21} aria-hidden="true" /><p><strong>Pakistan sector context:</strong> PTEA describes its remit as promoting exports across home textiles, made-ups and fabrics, alongside market inquiries, policy advocacy and trade delegation support. The association pages reviewed did not expose a current comparable export series, so no PTEA total is charted here.</p><SourceLink href="https://ptea.org.pk/">PTEA / official site</SourceLink></div>
      </section>

      <section className="mi-section section-pad" id="industry-signals">
        <div className="mi-section-heading">
          <div><div className="section-kicker"><span>03</span><span className="kicker-rule" /> TEXTILE INDUSTRY NEWS &amp; TRENDS</div><h2>Signals to watch.<br /><em>Claims kept in view.</em></h2></div>
          <p>Trend platforms are useful design prompts; company news is useful context. Neither is a substitute for measured demand or audited production data.</p>
        </div>
        <div className="mi-signal-grid">
          <article className="mi-signal-card mi-signal-card-dark"><div className="mi-signal-icon"><TrendingUp size={20} /></div><span className="micro-label">DESIGN OUTLOOK / HEIMTEXTIL 27/28</span><h3>Home Maxxing: performance of everyday living.</h3><p>Heimtextil's announced trend framework looks at interiors between functionality and wellbeing. Treat it as a curated design signal, not a measured global consumer preference.</p><SourceLink href="https://heimtextil.messefrankfurt.com/frankfurt/en/programme-events/trends.html">Explore the trend programme</SourceLink></article>
          <article className="mi-signal-card"><div className="mi-signal-icon"><Factory size={20} /></div><span className="micro-label">COMPANY-PUBLISHED UPDATES</span><h3>Manufacturing context, not a market claim.</h3><p>BTL describes in-house weaving, processing and stitching in Faisalabad, with R&amp;D focused on fibre-to-fabric. Its news page lists Heimtextil 2025 innovations and a 2024 planting initiative; neither is an independently measured performance claim.</p><LocalSourceLink href="/about-us/">Company profile</LocalSourceLink></article>
          <article className="mi-signal-card"><div className="mi-signal-icon"><Globe2 size={20} /></div><span className="micro-label">TRADE INTELLIGENCE / DATA LIMITS</span><h3>Shipment databases show records, not audited accounts.</h3><p>Trademo describes a large shipment-data platform. Public company-specific records were not verifiable in this review, so no BTL shipment counts or buyer claims are reproduced.</p><SourceLink href="https://www.trademo.com/">View Trademo</SourceLink></article>
        </div>
              </section>

      <section className="mi-sustainability" id="sustainability">
        <div className="mi-section section-pad">
          <div className="mi-section-heading mi-section-heading-light">
            <div><div className="section-kicker light-kicker"><span>04</span><span className="kicker-rule" /> SUSTAINABILITY &amp; MATERIALS</div><h2>Better claims begin<br /><em>with better evidence.</em></h2></div>
            <p>Production mix, recycled feedstock and certification scopes are different questions. The dates below make that distinction visible.</p>
          </div>
          <div className="mi-sustain-grid">
            <article className="mi-sustain-card"><div className="mi-sustain-icon"><Leaf size={20} /></div><span className="micro-label">GLOBAL MATERIAL SIGNAL / 2025</span><h3>Recycled input remains a small slice.</h3><p>Textile-to-textile recycled fibre reached 0.76% of global production in 2025, up from 0.61% in 2021. Recycled polyester was about 9.7 Mt, 97% from bottles; 37% of virgin cotton was produced through certified programmes.</p><SourceLink href="https://textileexchange.org/knowledge-center/reports/materials-market-report-2026/">Textile Exchange data</SourceLink></article>
            <article className="mi-sustain-card"><div className="mi-sustain-icon"><ShieldCheck size={20} /></div><span className="micro-label">STANDARD TRANSITION / 2025-2027</span><h3>Textile Exchange is harmonising its standards.</h3><p>The Materials Matter criteria were released 12 Dec 2025. The standard becomes effective 31 Dec 2026 and mandatory 31 Dec 2027; current standards may continue during the transition.</p><SourceLink href="https://textileexchange.org/standards/">Read transition details</SourceLink></article>
            <article className="mi-sustain-card mi-sustain-company"><div className="mi-sustain-icon"><Factory size={20} /></div><span className="micro-label">COMPANY-PUBLISHED SCOPE</span><h3>Check the certificate, scope and validity.</h3><p>Bismillah Textiles' certification list names GRS, OCS, GOTS and other schemes. That inventory is company-published; certificate scope and current validity should be confirmed against the linked records.</p><LocalSourceLink href="/certifications/">See BTL certifications</LocalSourceLink></article>
          </div>
          <p className="mi-sustain-foot">Textile Exchange figures describe global production, not BTL's material mix. Certification names alone do not substantiate a product-level environmental claim.</p>
        </div>
      </section>

      <section className="mi-section section-pad" id="events">
        <div className="mi-section-heading">
          <div><div className="section-kicker"><span>05</span><span className="kicker-rule" /> TRADE FAIRS &amp; INDUSTRY EVENTS</div><h2>Meet where the<br /><em>industry gathers.</em></h2></div>
          <p>Dates are linked to organisers' own pages. Check the event site before booking, as programmes and access details can change.</p>
        </div>
        <div className="mi-event-list">
          <article className="mi-event-card"><div className="mi-event-date"><span>JAN</span><strong>12-15</strong><span>2027</span></div><div className="mi-event-copy"><span className="micro-label">FRANKFURT AM MAIN / GERMANY</span><h3>Heimtextil 2027</h3><p>International trade fair for home and contract textiles and textile design. Its announced Trends 27/28 frame is titled Home Maxxing - The Performance of Everyday Living.</p><SourceLink href="https://heimtextil.messefrankfurt.com/frankfurt/en.html">Official event information</SourceLink></div><div className="mi-event-icon"><CalendarDays size={23} /></div></article>
          <article className="mi-event-card"><div className="mi-event-date mi-event-date-muted"><span>OCT</span><strong>12-16</strong><span>2026</span></div><div className="mi-event-copy"><span className="micro-label">VANCOUVER / CANADA</span><h3>Textile Exchange Conference 2026</h3><p>Conference theme: The Implementation Era. The programme focuses on putting materials and sustainability pathways into practice across supply systems.</p><SourceLink href="https://textileexchange.org/conference-2026/">Official conference information</SourceLink></div><div className="mi-event-icon"><CalendarDays size={23} /></div></article>
        </div>
        <div className="mi-event-company"><span className="micro-label">COMPANY REFERENCE</span><p>Bismillah Textiles' news section includes the Heimtextil 2025 update and Independence Day 2024 community initiative. Only available company-reported details are shown.</p><LocalSourceLink href="/news/">Company news</LocalSourceLink></div>
      </section>

      <section className="mi-sources-section mi-section section-pad" id="sources">
        <div className="mi-section-heading">
          <div><div className="section-kicker"><span>06</span><span className="kicker-rule" /> RESEARCH DESK</div><h2>Sources, dates<br /><em>&amp; definitions.</em></h2></div>
          <p>Publication dates and data periods are kept separate. Where a source did not expose a date or readable data table, that limitation is stated rather than filled in.</p>
        </div>
        <div className="mi-source-grid">
          {sources.map((source) => <article className="mi-source-card" key={source.name}><span className="micro-label">{source.type}</span><h3>{source.name}</h3><p>{source.detail}</p>{source.internal ? <LocalSourceLink href={source.href}>{source.link}</LocalSourceLink> : <SourceLink href={source.href}>{source.link}</SourceLink>}</article>)}
        </div>
        <div className="mi-method-note"><BookOpen size={20} aria-hidden="true" /><div><span className="micro-label">HOW TO READ THIS PAGE</span><p>Commercial home-textile market estimates were not combined because definitions differ. Charts instead use Textile Exchange's global fibre-production series and UN Comtrade's HS 6302 series, with the latter explicitly marked as a mirror estimate. This page does not duplicate the Brands and Retailers listing.</p></div><Link href="/products/">Explore BTL products <ArrowRight size={14} /></Link></div>
        <div className="mi-footnote"><span>Research checked 15 October 2026</span><span>Company information is attributed to Bismillah Textiles; sector data is attributed to each publisher.</span></div>
      </section>
    </div>
  );
}
