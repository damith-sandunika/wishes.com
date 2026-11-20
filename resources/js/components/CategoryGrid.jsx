import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const DEFAULT_CATEGORIES = [
  { name: 'Flowers', slug: 'flowers', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cakes', slug: 'cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chocolates', slug: 'chocolates', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Gift Hampers', slug: 'hampers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
  { name: 'Teddy Bears', slug: 'teddy-bears', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
  { name: 'Apparel Gifts', slug: 'apparel', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Personalized', slug: 'personalized', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80' },
  { name: 'Corporate Gifts', slug: 'corporate', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80' },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    axios.get('/api/public/categories')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiMap = Object.fromEntries(data.map(c => [c.slug, c]));
          setCategories(DEFAULT_CATEGORIES.map(d => {
            const match = apiMap[d.slug];
            if (!match) return d;
            return {
              ...d,
              ...match,
              image: match.image 
                ? (match.image.startsWith('http') ? match.image : `/storage/${match.image}`)
                : d.image,
            };
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Smooth Auto-Rotate horizontally
  useEffect(() => {
    if (isPaused) return;
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
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 lg:px-6">
      {/* Clean Header matching User Design without emojis, without subtitles, without arrow buttons */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Shop by <span className="text-[#c8102e]">Category</span>
          </h2>
          <div className="w-12 h-1 bg-[#c8102e] mt-1.5 rounded-full" />
        </div>
        <Link to="/shop" className="text-[#c8102e] font-semibold text-xs sm:text-sm hover:underline flex items-center gap-1">
          View All &rarr;
        </Link>
      </div>

      {/* Auto-Rotating Category Circles */}
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
            key={cat.slug}
            to={`/occasion/${cat.slug}`}
            className="flex-shrink-0 group flex flex-col items-center w-20 sm:w-24 md:w-28 text-center"
          >
            {/* Round Avatar Container with Image */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md p-1 border-2 border-rose-100 group-hover:border-[#c8102e] group-hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center">
              <img 
                src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80'} 
                alt={cat.name} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium leading-tight group-hover:text-[#c8102e] transition-colors mt-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
