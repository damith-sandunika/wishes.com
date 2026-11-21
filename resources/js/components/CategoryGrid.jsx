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

  // Smooth Auto-rotation Carousel
  useEffect(() => {
    if (isPaused || categories.length <= 4) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 140, behavior: 'smooth' });
        }
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused, categories.length]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-4 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex gap-4 sm:gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center w-20 sm:w-24 animate-pulse">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-slate-100 mb-2" />
              <div className="h-2.5 w-14 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 max-w-7xl mx-auto px-4 lg:px-6 relative group/section">
      {/* Floating Navigation Controls on Hover */}
      {categories.length > 5 && (
        <>
          <button 
            onClick={() => scroll(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:text-[#c8102e] flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 active:scale-95"
            aria-label="Previous categories"
          >
            <ChevronLeft size={17} />
          </button>
          <button 
            onClick={() => scroll(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:text-[#c8102e] flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 active:scale-95"
            aria-label="Next categories"
          >
            <ChevronRight size={17} />
          </button>
        </>
      )}

      {/* Category Cards Carousel */}
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-4 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            to={`/category/${cat.slug}`}
            className="flex-shrink-0 group flex flex-col items-center w-20 sm:w-24 md:w-28 text-center"
          >
            {/* Circle with pure white background and zoom-out contain */}
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-white shadow-xs border border-slate-100 ring-2 ring-rose-100/60 group-hover:ring-[#c8102e] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center p-2.5">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-rose-50 flex items-center justify-center text-[#c8102e]">
                  <Gift size={22} className="opacity-75 group-hover:scale-110 transition-transform" />
                </div>
              )}
            </div>
            <span className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-tight group-hover:text-[#c8102e] transition-colors mt-2 truncate max-w-full px-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
