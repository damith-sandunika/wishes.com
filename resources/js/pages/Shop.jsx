import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SlidersHorizontal, Grid3X3, List, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ShopSidebar from '../components/shop/ShopSidebar';
import PageHero from '../components/PageHero';
import { Link, useSearchParams } from 'react-router-dom';

const DEFAULT_OCCASIONS = [
  { label: 'All Gifts', slug: '' },
  { label: 'Birthday', slug: 'birthday' },
  { label: 'Anniversary', slug: 'anniversary' },
  { label: 'Personalized', slug: 'personalized' },
  { label: 'Congratulations', slug: 'congratulations' },
  { label: 'Corporate', slug: 'corporate' },
  { label: 'Get Well', slug: 'get-well' },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const PAGE_SIZE = 12;

const formatProduct = (p) => {
  const revs = Array.isArray(p.reviews) ? p.reviews : [];
  const avg = revs.length > 0
    ? Number((revs.reduce((sum, r) => sum + Number(r.rating || 5), 0) / revs.length).toFixed(1)) : 5.0;
  return {
    id: p.id,
    name: p.name,
    short_description: p.short_description || '',
    categoryName: p.category?.name || '',
    price: p.discount_price || p.selling_price,
    oldPrice: p.discount_price ? p.selling_price : null,
    image: p.images?.length ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`) : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80',
    discount: p.discount_price ? Math.round(((p.selling_price - p.discount_price) / p.selling_price) * 100) : 0,
    isBestseller: p.is_featured,
    occasions: Array.isArray(p.occasions) ? p.occasions : [],
    free_items: p.free_items || [],
    rating: avg,
    reviewsCount: revs.length,
  };
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState(DEFAULT_OCCASIONS);
  const [filters, setFilters] = useState({ categories: [], priceMin: '', priceMax: '', occasions: [], delivery: [], rating: '' });
  const [activeOccasion, setActiveOccasion] = useState('All Gifts');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const occ = searchParams.get('occasion');
    if (occ) {
      const match = occasions.find(o => o.slug.toLowerCase() === occ.toLowerCase() || o.label.toLowerCase() === occ.toLowerCase());
      if (match) setActiveOccasion(match.label);
    }
  }, [searchParams, occasions]);

  useEffect(() => {
    axios.get('/api/public/products').then(res => {
      const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setAllProducts(list.map(formatProduct));
    }).catch(console.error);
    axios.get('/api/public/categories').then(res => setCategories(res.data)).catch(console.error);
    axios.get('/api/public/occasions').then(res => {
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setOccasions([{ label: 'All Gifts', slug: '' }, ...list.map(o => ({ label: o.title, slug: o.slug }))]);
      }
    }).catch(() => { });
  }, []);

  const filtered = allProducts.filter(p => {
    if (activeOccasion !== 'All Gifts') {
      const occObj = occasions.find(o => o.label === activeOccasion);
      const targetSlug = occObj ? occObj.slug.toLowerCase() : activeOccasion.toLowerCase();
      const matchName = p.name.toLowerCase().includes(targetSlug);
      const matchCat = p.categoryName?.toLowerCase().includes(targetSlug);
      const matchOcc = Array.isArray(p.occasions) && p.occasions.some(o => o.toLowerCase().includes(targetSlug) || targetSlug.includes(o.toLowerCase()));
      if (!matchName && !matchCat && !matchOcc) return false;
    }
    if (filters.categories.length && !filters.categories.includes(p.categoryName)) return false;
    if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageHero
        title="Shop Gifts"
        subtitle="Discover curated gifts tailored for life's most precious special days and celebrations."
        badge="Curated Collection"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shop' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block w-64 shrink-0">
            <ShopSidebar categories={categories} filters={filters} onFilterChange={(newF) => { setFilters(newF); setPage(1); }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong></span>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-brand">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-brand' : 'text-gray-400'}`}><Grid3X3 size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'text-brand' : 'text-gray-400'}`}><List size={16} /></button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
              {paged.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:border-brand hover:text-brand transition-colors">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${n === page ? 'bg-brand text-white' : 'border border-gray-200 text-gray-600 hover:border-brand'}`}>{n}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:border-brand hover:text-brand transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Filter Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-5 z-40 bg-[#990011] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium text-xs hover:bg-[#7a000e] active:scale-95 transition-all border border-amber-200/30"
        aria-label="Open Filters"
      >
        <SlidersHorizontal size={16} />
        <span>Filter</span>
      </button>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-4 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#990011]" /> Filters
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 text-sm font-bold">
                ✕
              </button>
            </div>
            <ShopSidebar categories={categories} filters={filters} onFilterChange={(newF) => { setFilters(newF); setPage(1); }} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
