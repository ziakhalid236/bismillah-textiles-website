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

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

class AdminApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  if (!response.ok) {
    throw new AdminApiError(payload?.message ?? `Admin request failed (${response.status}).`, response.status);
  }
  return payload as T;
}

function formatUpdated(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'content', label: 'Site content', icon: FileText },
];

const sectionTitles: Record<Section, { title: string; eyebrow: string; description: string }> = {
  overview: { title: 'Workspace overview', eyebrow: 'Admin workspace', description: 'A clear view of products, categories and managed page content.' },
  products: { title: 'Products', eyebrow: 'Catalog management', description: 'Manage the product lines shown to brands and retail partners.' },
  categories: { title: 'Categories', eyebrow: 'Catalog structure', description: 'Organize product lines into clear, buyer-friendly ranges.' },
  content: { title: 'Site content', eyebrow: 'Page editor', description: 'Update the words and key details across your company profile.' },
};

function StatusBadge({ status }: { status: Status }) {
  return <span className={`admin-status admin-status--${status.toLowerCase()}`}><span />{status}</span>;
}

function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [section, setSection] = useState<Section>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [productDialog, setProductDialog] = useState<{ product?: Product } | null>(null);
  const [categoryDialog, setCategoryDialog] = useState<{ category?: Category } | null>(null);
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [productSearch, setProductSearch] = useState('');
  const [productStatus, setProductStatus] = useState('All statuses');

  async function loadData() {
    setLoadingData(true);
    setApiError('');
    try {
      const [nextProducts, nextCategories, nextPages] = await Promise.all([
        adminRequest<Product[]>('/products'),
        adminRequest<Category[]>('/categories'),
        adminRequest<ContentPage[]>('/pages'),
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setPages(nextPages);
      if (nextPages.length && !nextPages.some((page) => page.id === selectedPageId)) {
        setSelectedPageId(nextPages[0].id);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to load admin data.');
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    let active = true;
    adminRequest<{ username: string }>('/auth/session')
      .then(({ username: currentUsername }) => {
        if (active) {
          setAdminUsername(currentUsername);
          setAuthenticated(true);
        }
      })
      .catch((error: unknown) => {
        if (active && !(error instanceof AdminApiError && error.status === 401)) {
          setApiError(error instanceof Error ? error.message : 'Admin API is unavailable.');
        }
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (authenticated) void loadData();
  }, [authenticated]);

  const pageInfo = sectionTitles[section];
  const publishedCount = products.filter((product) => product.status === 'Published').length;
  const draftCount = products.filter((product) => product.status === 'Draft').length;
  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? pages[0];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus = productStatus === 'All statuses' || product.status === productStatus;
    return matchesSearch && matchesStatus;
  });

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');
    try {
      const session = await adminRequest<{ username: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setAdminUsername(session.username);
      setPassword('');
      setAuthenticated(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign-in failed.');
    }
  }

  async function signOut() {
    try {
      await adminRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Sign-out failed.');
    }
    setAuthenticated(false);
  }

  async function saveProduct(product: Product) {
    const exists = products.some((item) => item.id === product.id);
    try {
      const saved = await adminRequest<Product>(exists ? `/products/${encodeURIComponent(product.id)}` : '/products', {
        method: exists ? 'PUT' : 'POST',
        body: JSON.stringify(product),
      });
      setProducts((current) => exists
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...current]);
      setProductDialog(null);
      setApiError('');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to save product.');
    }
  }

  async function saveCategory(category: Category) {
    const exists = categories.some((item) => item.id === category.id);
    try {
      const saved = await adminRequest<Category>(exists ? `/categories/${encodeURIComponent(category.id)}` : '/categories', {
        method: exists ? 'PUT' : 'POST',
        body: JSON.stringify(category),
      });
      setCategories((current) => exists
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved]);
      await loadData();
      setCategoryDialog(null);
      setApiError('');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to save category.');
    }
  }

  async function updatePage(updated: ContentPage) {
    const exists = pages.some((page) => page.id === updated.id);
    try {
      const saved = await adminRequest<ContentPage>(exists ? `/pages/${encodeURIComponent(updated.id)}` : '/pages', {
        method: exists ? 'PUT' : 'POST',
        body: JSON.stringify(updated),
      });
      setPages((current) => exists
        ? current.map((page) => page.id === saved.id ? saved : page)
        : [...current, saved]);
      setSelectedPageId(saved.id);
      setApiError('');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to save page.');
    }
  }

  async function addPage() {
    const page: ContentPage = {
      id: crypto.randomUUID(),
      title: 'New page',
      path: '/new-page/',
      summary: 'Add a short summary for this page.',
      body: '',
      status: 'Draft',
      updated: 'Just now',
    };
    await updatePage(page);
  }

  if (!authenticated) {
    if (!authChecked) return <main className="admin-gate"><p className="admin-eyebrow">Bismillah Textiles / Workspace</p><h1>Checking session</h1><p className="admin-gate-copy">Connecting securely to the admin service.</p></main>;
    return (
      <main className="admin-gate">
        <div className="admin-gate-mark"><span>BT</span><i /></div>
        <p className="admin-eyebrow">Bismillah Textiles / Workspace</p>
        <h1>Admin sign in</h1>
        <p className="admin-gate-copy">Sign in to manage Bismillah Textiles products and site content.</p>
        <form className="admin-gate-form" onSubmit={signIn}>
          <label>Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {authError && <p className="admin-form-error" role="alert">{authError}</p>}
          <button className="admin-button admin-button--primary admin-gate-button" type="submit">Sign in securely <ArrowUpRight size={16} /></button>
        </form>
        {apiError && <div className="admin-demo-note" role="alert"><ShieldCheck size={16} /><span>{apiError}</span></div>}
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
          <div className="admin-demo-status"><span className="admin-demo-dot" /><span><strong>Connected admin</strong><small>Changes saved to database</small></span></div>
          <a href="/" className="admin-nav-item"><Globe2 size={18} strokeWidth={1.8} /><span>View public site</span><ArrowUpRight size={14} /></a>
          <button className="admin-nav-item admin-signout" type="button" onClick={signOut}><LogOut size={18} strokeWidth={1.8} /><span>Sign out</span></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Workspace</span><span>/</span><strong>{pageInfo.title}</strong></div>
          <div className="admin-top-actions">
            <span className="admin-preview-chip"><span /> DATABASE</span>
            <a className="admin-icon-button" href="/" aria-label="Preview public website" title="Preview public website"><Eye size={18} /></a>
            <button className="admin-icon-button admin-notification-button" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="admin-profile-button" type="button" aria-label={`Signed in as ${adminUsername}`}><span>{adminUsername.slice(0, 2).toUpperCase()}</span><ChevronDown size={14} /></button>
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

          {apiError && <div className="admin-api-alert" role="alert">{apiError}</div>}
          {loadingData && <div className="admin-loading" role="status">Loading saved admin data…</div>}

          {!loadingData && section === 'overview' && <Overview products={products} pages={pages} publishedCount={publishedCount} draftCount={draftCount} onNavigate={setSection} onEditHome={() => { setSelectedPageId(pages[0]?.id ?? ''); setSection('content'); }} />}
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
          {section === 'categories' && <CategoriesView categories={categories} products={products} onEdit={(category) => setCategoryDialog({ category })} onToggle={(id) => {
            const category = categories.find((item) => item.id === id);
            if (category) void saveCategory({ ...category, active: !category.active });
          }} />}
          {section === 'content' && selectedPage && <ContentView pages={pages} selected={selectedPage} onSelect={setSelectedPageId} onUpdate={updatePage} />}

          <footer className="admin-page-footer"><span>Secure admin workspace</span><span>Changes are saved to the connected database.</span></footer>
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
  const recentRecords = [
    ...products.map((product) => ({ id: product.id, title: product.name, kind: 'Product', updated: product.updated })),
    ...pages.map((page) => ({ id: page.id, title: page.title, kind: 'Page', updated: page.updated })),
  ].sort((left, right) => Date.parse(right.updated) - Date.parse(left.updated)).slice(0, 3);

  return (
    <div className="admin-overview">
      <section className="admin-stat-grid" aria-label="Workspace summary">
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--red"><Package size={18} /></span><span className="admin-stat-label">Total products</span><strong>{products.length}</strong><span className="admin-stat-foot">Across active product ranges</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--green"><Globe2 size={18} /></span><span className="admin-stat-label">Published status</span><strong>{publishedCount}</strong><span className="admin-stat-foot">Marked published in admin data</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--gold"><FileText size={18} /></span><span className="admin-stat-label">Drafts to review</span><strong>{draftCount + pages.filter((page) => page.status === 'Draft').length}</strong><span className="admin-stat-foot">Products and page content</span></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--ink"><Users size={18} /></span><span className="admin-stat-label">Admin accounts</span><strong>01</strong><span className="admin-stat-foot">Environment-configured account</span></article>
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
          <div className="admin-panel-heading"><div><h2>Publishing status</h2><p>Publication state stored by admin</p></div><span className="admin-live-mark"><i /> DATABASE</span></div>
          <div className="admin-publish-metrics"><div><strong>{publishedCount}</strong><span>published products</span></div><div><strong>{pages.filter((page) => page.status === 'Published').length}</strong><span>published pages</span></div><div><strong>{draftCount}</strong><span>product drafts</span></div></div>
          <button className="admin-public-link" type="button" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>Open public website <ArrowUpRight size={15} /></button>
        </article>
        <article className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading"><div><h2>Activity</h2><p>Recent workspace updates</p></div><Activity size={18} className="admin-muted-icon" /></div>
          <div className="admin-activity-list">{recentRecords.map((record, index) => <div key={record.id}><span className={`admin-activity-dot ${index === 0 ? 'admin-activity-dot--green' : index === 1 ? 'admin-activity-dot--gold' : 'admin-activity-dot--red'}`} /><p><strong>{record.title}</strong> {record.kind.toLowerCase()} record<small><Clock3 size={12} /> {formatUpdated(record.updated)}</small></p></div>)}</div>
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
      <div className="admin-table-footer"><span>Showing {products.length} products</span><span>Saved in the connected database</span></div>
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
  onUpdate: (page: ContentPage) => Promise<void>;
}) {
  const [draft, setDraft] = useState(selected);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(selected), [selected.id, selected.updated]);

  async function save(status: Status) {
    setSaving(true);
    await onUpdate({ ...draft, status, updated: new Date().toISOString() });
    setSaving(false);
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
          <label>Page title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
          <label>Short summary<input value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></label>
          <label>Page copy<textarea rows={9} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></label>
        </div>
        <div className="admin-editor-preview"><div><span className="admin-editor-label"><Eye size={13} /> PUBLIC PREVIEW</span><strong>{draft.title || 'Untitled page'}</strong><p>{draft.body || 'Your page content preview will appear here.'}</p></div><span className="admin-preview-stamp">BTL / WEB</span></div>
        <div className="admin-editor-footer"><span><Clock3 size={13} /> Last saved {selected.updated}</span><div><button className="admin-button admin-button--secondary" type="button" disabled={saving} onClick={() => void save('Draft')}>Save draft</button><button className="admin-button admin-button--primary" type="button" disabled={saving} onClick={() => void save('Published')}><Check size={15} /> Publish changes</button></div></div>
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