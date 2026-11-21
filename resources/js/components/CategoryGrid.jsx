import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import axios from 'axios';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    axios.get('/api/public/categories')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setCategories(list.map(c => {
          const img = (c.image || '').trim();
          const formatted = !img 
            ? null 
            : (img.startsWith('http://') || img.startsWith('https://')) 
              ? img 
              : `/storage/${img.replace(/^\/?(storage\/)?/, '')}`;
          return {
            id: c.id,
            name: c.name,
            slug: c.slug || String(c.id),
            image: formatted,
          };
        }));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isPaused || categories.length <= 4) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 5) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 160, behavior: 'smooth' });
        }
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, categories.length]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 220, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-8 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="h-6 w-44 bg-slate-100 rounded-md animate-pulse mb-6" />
        <div className="flex gap-4 sm:gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center w-24 sm:w-28 animate-pulse">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mb-3" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 lg:px-6 relative group/section">
      <div className="flex items-end justify-between mb-6 pb-2 border-b border-rose-100/50">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 mb-1 block">Curated Collections</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop by <span className="text-[#c8102e]">Category</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <button 
              onClick={() => scroll(-1)} 
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-[#c8102e] flex items-center justify-center transition shadow-2xs active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll(1)} 
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-[#c8102e] flex items-center justify-center transition shadow-2xs active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <Link to="/shop" className="text-[#c8102e] font-bold text-xs hover:text-red-800 transition flex items-center gap-1 group">
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            to={`/category/${cat.slug}`}
            className="flex-shrink-0 group flex flex-col items-center w-20 sm:w-24 md:w-28 text-center"
          >
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full bg-linear-to-b from-rose-50 to-white shadow-sm p-1 ring-2 ring-rose-100/70 group-hover:ring-[#c8102e] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-tr from-rose-100 to-rose-50 flex items-center justify-center text-[#c8102e] font-bold">
                  <Gift size={24} className="opacity-75 group-hover:scale-115 transition-transform" />
                </div>
              )}
            </div>
            <span className="text-xs sm:text-[13px] text-slate-800 font-semibold leading-tight group-hover:text-[#c8102e] transition-colors mt-2.5 truncate max-w-full px-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
