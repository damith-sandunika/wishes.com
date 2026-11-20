import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SlidersHorizontal, Grid3X3, List, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ShopSidebar from '../components/shop/ShopSidebar';
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
    price: p.discount_price || p.selling_price,
    oldPrice: p.discount_price ? p.selling_price : null,
    image: p.images?.length ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`) : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80',
    discount: p.discount_price ? Math.round(((p.selling_price - p.discount_price) / p.selling_price) * 100) : 0,
    isBestseller: p.is_featured,
    categoryName: p.category?.name || '',
    occasions: Array.isArray(p.occasions) ? p.occasions : [],
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
    axios.get('/api/public/products').then(res => setAllProducts(res.data.map(formatProduct))).catch(console.error);
    axios.get('/api/public/categories').then(res => setCategories(res.data)).catch(console.error);
    axios.get('/api/public/occasions').then(res => {
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setOccasions([{ label: 'All Gifts', slug: '' }, ...list.map(o => ({ label: o.title, slug: o.slug }))]);
      }
    }).catch(() => {});
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
      <div className="bg-pink-50 border-b border-pink-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Shop Gifts</h1>
            <p className="text-gray-500 text-sm max-w-md">Discover curated gifts tailored for life's most precious occasions.</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
              <Link to="/" className="hover:text-brand">Home</Link>
              <ChevronRight size={12} />
              <span className="text-gray-600 font-medium">Shop</span>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" alt="Gifts" className="hidden md:block h-32 w-32 object-cover rounded-2xl shadow-md opacity-80" />
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {occasions.map(o => (
              <button key={o.label} onClick={() => { setActiveOccasion(o.label); setPage(1); }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${activeOccasion === o.label ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex gap-6">
          <ShopSidebar categories={categories} filters={filters} onFilterChange={(newF) => { setFilters(newF); setPage(1); }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-brand">
                  <SlidersHorizontal size={16} /> Filter
                </button>
                <span className="text-xs text-gray-500">Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of <strong>{filtered.length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-brand">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode==='grid' ? 'text-brand' : 'text-gray-400'}`}><Grid3X3 size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode==='list' ? 'text-brand' : 'text-gray-400'}`}><List size={16} /></button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
              {paged.map(p => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={page===1} onClick={() => setPage(page-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:border-brand hover:text-brand transition-colors">Prev</button>
                {Array.from({length: totalPages}, (_, i) => i+1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${n===page ? 'bg-brand text-white' : 'border border-gray-200 text-gray-600 hover:border-brand'}`}>{n}</button>
                ))}
                <button disabled={page===totalPages} onClick={() => setPage(page+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:border-brand hover:text-brand transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
