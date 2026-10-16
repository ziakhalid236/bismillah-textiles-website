import { useEffect, useState, type FormEvent } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import './admin-panel.css';

type Status = 'Published' | 'Draft';
type Section = 'overview' | 'products' | 'categories' | 'content';

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: Status;
  description: string;
  updated: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

type ContentPage = {
  id: string;
  title: string;
  path: string;
  summary: string;
  body: string;
  status: Status;
  updated: string;
};

const initialProducts: Product[] = [
  { id: 'p-01', name: 'Sheet sets', sku: 'BTL-HM-001', category: 'Home textiles', status: 'Published', description: 'Flat sheets, fitted sheets and pillowcases, cut and stitched in-house from our own woven fabric.', updated: 'Today, 10:42 AM' },
  { id: 'p-02', name: 'Comforter sets', sku: 'BTL-HM-002', category: 'Home textiles', status: 'Published', description: 'Coordinated comforter and pillow sham sets, supported by in-house quilting and wadding.', updated: 'Yesterday' },
  { id: 'p-03', name: 'Jacquard fabric', sku: 'BTL-FB-001', category: 'Fabric', status: 'Published', description: 'Figured woven fabric produced on the company’s air-jet looms.', updated: 'Oct 14, 2026' },
  { id: 'p-04', name: 'Hospitality bed linen', sku: 'BTL-HT-001', category: 'Hospitality', status: 'Published', description: 'Plain and striped bed linen for hospitality customers, made on weaving and stitching lines.', updated: 'Oct 12, 2026' },
  { id: 'p-05', name: 'Printed apparel fabric', sku: 'BTL-AP-002', category: 'Garments & apparel fabrics', status: 'Draft', description: 'Printed fabrics suited to apparel programmes.', updated: 'Oct 11, 2026' },
  { id: 'p-06', name: 'Quilted bedding', sku: 'BTL-HM-004', category: 'Home textiles', status: 'Draft', description: 'Quilts and quilted products made on computerized quilting lines.', updated: 'Oct 9, 2026' },
];

const initialCategories: Category[] = [
  { id: 'c-01', name: 'Home textiles', description: 'Bedding, window, bath and table products.', active: true },
  { id: 'c-02', name: 'Fabric', description: 'Woven, dyed, printed and finished fabrics.', active: true },
  { id: 'c-03', name: 'Hospitality', description: 'Bed linen, drapes and quilted products for hospitality.', active: true },
  { id: 'c-04', name: 'Garments & apparel fabrics', description: 'Apparel fabrics and cut-and-sew capability.', active: true },
];

const initialPages: ContentPage[] = [
  { id: 'home', title: 'Home page', path: '/', summary: 'Company introduction and manufacturing overview.', body: 'Founded in 1989, Bismillah Textiles brings weaving, processing and stitching together at our home in Faisalabad, Pakistan. We serve brands and retailers across six continents.', status: 'Published', updated: 'Today, 9:18 AM' },
  { id: 'about', title: 'About us', path: '/about-us/', summary: 'Company story, values and leadership.', body: 'A family business built on quality, professional service and long-standing relationships. Our teams bring each stage of textile manufacturing together under one roof.', status: 'Published', updated: 'Oct 15, 2026' },
  { id: 'facilities', title: 'Manufacturing facilities', path: '/manufacturing-facilities/', summary: 'Weaving, processing, stitching and finishing.', body: 'Explore the integrated operations, equipment and people behind our textile manufacturing in Khurrianwala.', status: 'Published', updated: 'Oct 14, 2026' },
  { id: 'news', title: 'News', path: '/news/', summary: 'Company updates and industry events.', body: 'Share a company update, event announcement or community initiative with our customers and partners.', status: 'Draft', updated: 'Oct 10, 2026' },
];

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'content', label: 'Site content', icon: FileText },
];

const sectionTitles: Record<Section, { title: string; eyebrow: string; description: string }> = {
  overview: { title: 'Good morning, Ayesha', eyebrow: 'Workspace overview', description: 'A clear view of the content shaping your public profile.' },
  products: { title: 'Products', eyebrow: 'Catalog management', description: 'Manage the product lines shown to brands and retail partners.' },
  categories: { title: 'Categories', eyebrow: 'Catalog structure', description: 'Organize product lines into clear, buyer-friendly ranges.' },
  content: { title: 'Site content', eyebrow: 'Page editor', description: 'Update the words and key details across your company profile.' },
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The demo remains usable when browser storage is unavailable.
  }
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`admin-status admin-status--${status.toLowerCase()}`}><span />{status}</span>;
}

function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return window.sessionStorage.getItem('btl-admin-demo-session') === 'active';
    } catch {
      return false;
    }
  });
  const [section, setSection] = useState<Section>('overview');
  const [products, setProducts] = useState(() => readLocal('btl-admin-products', initialProducts));
  const [categories, setCategories] = useState(() => readLocal('btl-admin-categories', initialCategories));
  const [pages, setPages] = useState(() => readLocal('btl-admin-pages', initialPages));
  const [productDialog, setProductDialog] = useState<{ product?: Product } | null>(null);
  const [categoryDialog, setCategoryDialog] = useState<{ category?: Category } | null>(null);
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [productSearch, setProductSearch] = useState('');
  const [productStatus, setProductStatus] = useState('All statuses');

  useEffect(() => writeLocal('btl-admin-products', products), [products]);
  useEffect(() => writeLocal('btl-admin-categories', categories), [categories]);
  useEffect(() => writeLocal('btl-admin-pages', pages), [pages]);

  const pageInfo = sectionTitles[section];
  const publishedCount = products.filter((product) => product.status === 'Published').length;
  const draftCount = products.filter((product) => product.status === 'Draft').length;
  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? pages[0];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus = productStatus === 'All statuses' || product.status === productStatus;
    return matchesSearch && matchesStatus;
  });

  function enterDemo() {
    try {
      window.sessionStorage.setItem('btl-admin-demo-session', 'active');
    } catch {
      // Keep the demo gate in component state if session storage is blocked.
    }
    setAuthenticated(true);
  }

  function signOut() {
    try {
      window.sessionStorage.removeItem('btl-admin-demo-session');
    } catch {
      // Component state still clears when storage is blocked.
    }
    setAuthenticated(false);
  }

  function saveProduct(product: Product) {
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists ? current.map((item) => item.id === product.id ? product : item) : [product, ...current];
    });
    setProductDialog(null);
  }

  function saveCategory(category: Category) {
    const previous = categories.find((item) => item.id === category.id);
    if (previous && previous.name !== category.name) {
      setProducts((current) => current.map((product) => product.category === previous.name ? { ...product, category: category.name } : product));
    }
    setCategories((current) => {
      const exists = current.some((item) => item.id === category.id);
      return exists ? current.map((item) => item.id === category.id ? category : item) : [...current, category];
    });
    setCategoryDialog(null);
  }

  function updatePage(updated: ContentPage) {
    setPages((current) => current.map((page) => page.id === updated.id ? updated : page));
  }

  function addPage() {
    const page: ContentPage = {
      id: `page-${Date.now()}`,
      title: 'New page',
      path: '/new-page/',
      summary: 'Add a short summary for this page.',
      body: '',
      status: 'Draft',
      updated: 'Just now',
    };
    setPages((current) => [...current, page]);
    setSelectedPageId(page.id);
  }

  function resetDemoData() {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setPages(initialPages);
  }

  if (!authenticated) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-mark"><span>BT</span><i /></div>
        <p className="admin-eyebrow">Bismillah Textiles / Workspace</p>
        <h1>Admin preview</h1>
        <p className="admin-gate-copy">Enter the local demo workspace to review product, category and site-content management.</p>
        <button className="admin-button admin-button--primary admin-gate-button" type="button" onClick={enterDemo}>Enter demo workspace <ArrowUpRight size={16} /></button>
        <div className="admin-demo-note"><ShieldCheck size={16} /><span>Demo-only access gate. No real account or production data is connected.</span></div>
        <a className="admin-back-link" href="/">Return to public website <ArrowUpRight size={14} /></a>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin" aria-label="Bismillah Textiles admin home">
          <span className="admin-brand-mark">BT</span>
          <span className="admin-brand-text"><strong>BISMILLAH</strong><small>TEXTILES / ADMIN</small></span>
        </a>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav className="admin-nav" aria-label="Admin sections">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button className={section === id ? 'admin-nav-item is-active' : 'admin-nav-item'} key={id} type="button" onClick={() => setSection(id)} aria-current={section === id ? 'page' : undefined}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {id === 'products' && <span className="admin-nav-count">{products.length}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-demo-status"><span className="admin-demo-dot" /><span><strong>Local demo</strong><small>Changes saved in this browser</small></span></div>
          <a href="/" className="admin-nav-item"><Globe2 size={18} strokeWidth={1.8} /><span>View public site</span><ArrowUpRight size={14} /></a>
          <button className="admin-nav-item admin-signout" type="button" onClick={signOut}><LogOut size={18} strokeWidth={1.8} /><span>Exit demo</span></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Workspace</span><span>/</span><strong>{pageInfo.title}</strong></div>
          <div className="admin-top-actions">
            <span className="admin-preview-chip"><span /> DEMO DATA</span>
            <a className="admin-icon-button" href="/" aria-label="Preview public website" title="Preview public website"><Eye size={18} /></a>
            <button className="admin-icon-button admin-notification-button" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="admin-profile-button" type="button" aria-label="Demo editor profile"><span>AS</span><ChevronDown size={14} /></button>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-page-heading">
            <div><p className="admin-eyebrow">{pageInfo.eyebrow}</p><h1>{pageInfo.title}</h1><p>{pageInfo.description}</p></div>
            <div className="admin-heading-actions">
              {section === 'products' && <button className="admin-button admin-button--primary" type="button" onClick={() => setProductDialog({})}><Plus size={16} /> Add product</button>}
              {section === 'categories' && <button className="admin-button admin-button--primary" type="button" onClick={() => setCategoryDialog({})}><Plus size={16} /> Add category</button>}
              {section === 'content' && <button className="admin-button admin-button--primary" type="button" onClick={addPage}><Plus size={16} /> New page</button>}
              {section === 'overview' && <button className="admin-button admin-button--primary" type="button" onClick={() => { setSection('products'); setProductDialog({}); }}><Plus size={16} /> Add product</button>}
            </div>
          </div>

          {section === 'overview' && <Overview products={products} pages={pages} publishedCount={publishedCount} draftCount={draftCount} onNavigate={setSection} onEditHome={() => { setSelectedPageId('home'); setSection('content'); }} />}
          {section === 'products' && (
            <ProductsView
              products={filteredProducts}
              total={products.length}
              search={productSearch}
              status={productStatus}
              onSearch={setProductSearch}
              onStatus={setProductStatus}
              onEdit={(product) => setProductDialog({ product })}
              onAdd={() => setProductDialog({})}
            />
          )}
          {section === 'categories' && <CategoriesView categories={categories} products={products} onEdit={(category) => setCategoryDialog({ category })} onToggle={(id) => setCategories((current) => current.map((category) => category.id === id ? { ...category, active: !category.active } : category))} />}
          {section === 'content' && selectedPage && <ContentView pages={pages} selected={selectedPage} onSelect={setSelectedPageId} onUpdate={updatePage} />}

          <footer className="admin-page-footer"><span>Local preview workspace</span><button type="button" onClick={resetDemoData}>Reset demo data</button><span>Changes are not sent to a server.</span></footer>
        </main>
      </div>

      {productDialog && <ProductDialog key={productDialog.product?.id ?? 'new-product'} initial={productDialog.product} categories={categories} onClose={() => setProductDialog(null)} onSave={saveProduct} />}
      {categoryDialog && <CategoryDialog key={categoryDialog.category?.id ?? 'new-category'} initial={categoryDialog.category} onClose={() => setCategoryDialog(null)} onSave={saveCategory} />}
    </div>
  );
}

function Overview({ products, pages, publishedCount, draftCount, onNavigate, onEditHome }: {
  products: Product[];
  pages: ContentPage[];
  publishedCount: number;
  draftCount: number;
  onNavigate: (section: Section) => void;
  onEditHome: () => void;
}) {
  return (
    <div className="admin-overview">
      <section className="admin-stat-grid" aria-label="Workspace summary">
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--red"><Package size={18} /></span><span className="admin-stat-label">Total products</span><strong>{products.length}</strong><span className="admin-stat-foot">Across active product ranges</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--green"><Globe2 size={18} /></span><span className="admin-stat-label">Published</span><strong>{publishedCount}</strong><span className="admin-stat-foot">Visible on the public site</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--gold"><FileText size={18} /></span><span className="admin-stat-label">Drafts to review</span><strong>{draftCount + pages.filter((page) => page.status === 'Draft').length}</strong><span className="admin-stat-foot">Products and page content</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--ink"><Users size={18} /></span><span className="admin-stat-label">Content editors</span><strong>03</strong><span className="admin-stat-foot">Demo workspace team</span></article>
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading"><div><h2>Recent products</h2><p>Latest catalog updates</p></div><button type="button" className="admin-text-link" onClick={() => onNavigate('products')}>View all <ArrowUpRight size={14} /></button></div>
          <div className="admin-recent-list">
            {products.slice(0, 4).map((product, index) => <div className="admin-recent-row" key={product.id}><span className={`admin-mini-thumb admin-mini-thumb--${index % 3}`}><Package size={17} /></span><span className="admin-recent-copy"><strong>{product.name}</strong><small>{product.category} / {product.sku}</small></span><StatusBadge status={product.status} /><button className="admin-row-action" type="button" aria-label={`Edit ${product.name}`} onClick={() => onNavigate('products')}><Pencil size={15} /></button></div>)}
          </div>
        </article>

        <article className="admin-panel admin-quick-panel">
          <div className="admin-panel-heading"><div><h2>Quick actions</h2><p>Keep the profile up to date</p></div><span className="admin-heading-spark"><Sparkles size={17} /></span></div>
          <button className="admin-quick-action" type="button" onClick={() => onNavigate('products')}><span className="admin-quick-icon"><Package size={17} /></span><span><strong>Review product catalog</strong><small>Manage product details and status</small></span><ArrowUpRight size={15} /></button>
          <button className="admin-quick-action" type="button" onClick={() => onNavigate('categories')}><span className="admin-quick-icon"><Tag size={17} /></span><span><strong>Organize categories</strong><small>Keep product ranges easy to browse</small></span><ArrowUpRight size={15} /></button>
          <button className="admin-quick-action" type="button" onClick={onEditHome}><span className="admin-quick-icon"><FileText size={17} /></span><span><strong>Update the home page</strong><small>Edit public profile copy</small></span><ArrowUpRight size={15} /></button>
        </article>
      </section>

      <section className="admin-bottom-grid">
        <article className="admin-panel admin-publish-panel">
          <div className="admin-panel-heading"><div><h2>Publishing status</h2><p>What visitors can currently see</p></div><span className="admin-live-mark"><i /> PUBLIC SITE</span></div>
          <div className="admin-publish-metrics"><div><strong>{publishedCount}</strong><span>published products</span></div><div><strong>{pages.filter((page) => page.status === 'Published').length}</strong><span>published pages</span></div><div><strong>{draftCount}</strong><span>product drafts</span></div></div>
          <button className="admin-public-link" type="button" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>Open public website <ArrowUpRight size={15} /></button>
        </article>
        <article className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading"><div><h2>Activity</h2><p>Recent workspace updates</p></div><Activity size={18} className="admin-muted-icon" /></div>
          <div className="admin-activity-list"><div><span className="admin-activity-dot admin-activity-dot--green" /><p><strong>Sheet sets</strong> published to the catalog<small><Clock3 size={12} /> Today, 10:42 AM</small></p></div><div><span className="admin-activity-dot admin-activity-dot--gold" /><p><strong>Printed apparel fabric</strong> saved as a draft<small><Clock3 size={12} /> Yesterday, 3:16 PM</small></p></div><div><span className="admin-activity-dot admin-activity-dot--red" /><p><strong>Home page</strong> copy updated<small><Clock3 size={12} /> Oct 15, 2026</small></p></div></div>
        </article>
      </section>
    </div>
  );
}

function ProductsView({ products, total, search, status, onSearch, onStatus, onEdit, onAdd }: {
  products: Product[];
  total: number;
  search: string;
  status: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
}) {
  return (
    <section className="admin-panel admin-table-panel">
      <div className="admin-toolbar">
        <label className="admin-search"><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search products or SKU" aria-label="Search products or SKU" /></label>
        <label className="admin-select-wrap"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => onStatus(event.target.value)}><option>All statuses</option><option>Published</option><option>Draft</option></select><ChevronDown size={15} /></label>
        <span className="admin-result-count">{products.length} of {total} products</span>
      </div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>SKU</th><th>Status</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
        {products.map((product, index) => <tr key={product.id}><td><div className="admin-product-cell"><span className={`admin-mini-thumb admin-mini-thumb--${index % 3}`}><Package size={17} /></span><span><strong>{product.name}</strong><small>{product.description}</small></span></div></td><td>{product.category}</td><td className="admin-sku">{product.sku}</td><td><StatusBadge status={product.status} /></td><td className="admin-date">{product.updated}</td><td><button className="admin-row-action" type="button" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}><Pencil size={15} /></button></td></tr>)}
        {products.length === 0 && <tr><td colSpan={6}><div className="admin-empty"><Package size={22} /><strong>No matching products</strong><span>Try another search or add a product.</span><button type="button" className="admin-text-link" onClick={onAdd}><Plus size={14} /> Add product</button></div></td></tr>}
      </tbody></table></div>
      <div className="admin-table-footer"><span>Showing {products.length} products</span><span>Demo catalog · browser-local</span></div>
    </section>
  );
}

function CategoriesView({ categories, products, onEdit, onToggle }: {
  categories: Category[];
  products: Product[];
  onEdit: (category: Category) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="admin-category-view">
      <div className="admin-category-summary"><Tag size={18} /><span><strong>{categories.length} categories</strong><small>Products are grouped for a clearer buyer journey.</small></span><span className="admin-category-active-count">{categories.filter((category) => category.active).length} active</span></div>
      <div className="admin-category-grid">{categories.map((category, index) => {
        const productCount = products.filter((product) => product.category === category.name).length;
        return <article className="admin-category-card" key={category.id}><div className="admin-category-card-top"><span className={`admin-category-icon admin-category-icon--${index % 4}`}><Tag size={18} /></span><button className="admin-text-link admin-category-edit" type="button" onClick={() => onEdit(category)}><Pencil size={14} /> Edit</button></div><h2>{category.name}</h2><p>{category.description}</p><div className="admin-category-card-bottom"><span><Package size={14} /> {productCount} {productCount === 1 ? 'product' : 'products'}</span><button className={category.active ? 'admin-toggle is-on' : 'admin-toggle'} type="button" role="switch" aria-checked={category.active} aria-label={`${category.active ? 'Deactivate' : 'Activate'} ${category.name}`} onClick={() => onToggle(category.id)}><i /></button></div><span className={category.active ? 'admin-category-state is-active' : 'admin-category-state'}>{category.active ? 'Active' : 'Inactive'}</span></article>;
      })}</div>
    </div>
  );
}

function ContentView({ pages, selected, onSelect, onUpdate }: {
  pages: ContentPage[];
  selected: ContentPage;
  onSelect: (id: string) => void;
  onUpdate: (page: ContentPage) => void;
}) {
  function save(status: Status) {
    onUpdate({ ...selected, status, updated: 'Just now' });
  }

  return (
    <div className="admin-content-editor">
      <aside className="admin-panel admin-page-list">
        <div className="admin-page-list-heading"><span>Pages</span><span>{pages.length}</span></div>
        {pages.map((page) => <button className={selected.id === page.id ? 'admin-page-list-item is-selected' : 'admin-page-list-item'} type="button" key={page.id} onClick={() => onSelect(page.id)}><FileText size={16} /><span><strong>{page.title}</strong><small>{page.path}</small></span><span className={page.status === 'Published' ? 'admin-page-list-dot is-published' : 'admin-page-list-dot'} /></button>)}
        <div className="admin-page-list-foot"><ShieldCheck size={14} /> Public content only</div>
      </aside>
      <section className="admin-panel admin-editor-panel">
        <div className="admin-editor-toolbar"><div><span className="admin-editor-label">EDITING PAGE</span><span className="admin-editor-path">{selected.path}</span></div><StatusBadge status={selected.status} /></div>
        <div className="admin-editor-fields">
          <label>Page title<input value={selected.title} onChange={(event) => onUpdate({ ...selected, title: event.target.value })} /></label>
          <label>Short summary<input value={selected.summary} onChange={(event) => onUpdate({ ...selected, summary: event.target.value })} /></label>
          <label>Page copy<textarea rows={9} value={selected.body} onChange={(event) => onUpdate({ ...selected, body: event.target.value })} /></label>
        </div>
        <div className="admin-editor-preview"><div><span className="admin-editor-label"><Eye size={13} /> PUBLIC PREVIEW</span><strong>{selected.title || 'Untitled page'}</strong><p>{selected.body || 'Your page content preview will appear here.'}</p></div><span className="admin-preview-stamp">BTL / WEB</span></div>
        <div className="admin-editor-footer"><span><Clock3 size={13} /> Last saved {selected.updated}</span><div><button className="admin-button admin-button--secondary" type="button" onClick={() => save('Draft')}>Save draft</button><button className="admin-button admin-button--primary" type="button" onClick={() => save('Published')}><Check size={15} /> Publish changes</button></div></div>
      </section>
    </div>
  );
}

function ProductDialog({ initial, categories, onClose, onSave }: {
  initial?: Product;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<Status>(initial?.status ?? 'Draft');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !sku.trim() || !category) {
      setError('Add a product name, SKU and category to continue.');
      return;
    }
    onSave({ id: initial?.id ?? `product-${Date.now()}`, name: name.trim(), sku: sku.trim(), category, description: description.trim(), status, updated: 'Just now' });
  }

  return <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title"><div className="admin-modal-heading"><div><p className="admin-eyebrow">Catalog item</p><h2 id="product-dialog-title">{initial ? 'Edit product' : 'Add product'}</h2></div><button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close product editor"><X size={18} /></button></div><form onSubmit={submit}><label>Product name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Sheet sets" autoFocus /></label><div className="admin-form-row"><label>SKU<input value={sku} onChange={(event) => setSku(event.target.value)} placeholder="BTL-HM-001" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.filter((item) => item.active).map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label></div><label>Description<textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the product range for buyers" /></label><label>Visibility<select value={status} onChange={(event) => setStatus(event.target.value as Status)}><option>Draft</option><option>Published</option></select></label>{error && <p className="admin-form-error">{error}</p>}<div className="admin-modal-actions"><button className="admin-button admin-button--secondary" type="button" onClick={onClose}>Cancel</button><button className="admin-button admin-button--primary" type="submit"><Check size={15} /> Save product</button></div></form></section></div>;
}

function CategoryDialog({ initial, onClose, onSave }: {
  initial?: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter a category name to continue.');
      return;
    }
    onSave({ id: initial?.id ?? `category-${Date.now()}`, name: name.trim(), description: description.trim(), active: initial?.active ?? true });
  }

  return <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="admin-modal admin-modal--compact" role="dialog" aria-modal="true" aria-labelledby="category-dialog-title"><div className="admin-modal-heading"><div><p className="admin-eyebrow">Catalog structure</p><h2 id="category-dialog-title">{initial ? 'Edit category' : 'Add category'}</h2></div><button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close category editor"><X size={18} /></button></div><form onSubmit={submit}><label>Category name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Bath textiles" autoFocus /></label><label>Description<textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A short description for buyers" /></label>{error && <p className="admin-form-error">{error}</p>}<div className="admin-modal-actions"><button className="admin-button admin-button--secondary" type="button" onClick={onClose}>Cancel</button><button className="admin-button admin-button--primary" type="submit"><Check size={15} /> Save category</button></div></form></section></div>;
}

export default AdminPanel;