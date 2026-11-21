import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}
function setWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

export default function ProductImageGallery({ images = [], fallback, productId, isBestseller, enablePersonalization }) {
  const urls = images.length > 0
    ? images.map(img => img?.startsWith('http') ? img : `/storage/${img}`)
    : (fallback ? [fallback] : []);

  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (productId) setWishlisted(getWishlist().includes(productId));
    setActive(0);
  }, [productId, images]);

  const changeImage = (idx) => {
    if (idx === active || !urls[idx]) return;
    setFade(false);
    setTimeout(() => { setActive(idx); setFade(true); }, 120);
  };

  const toggleWishlist = () => {
    if (!productId) return;
    const list = getWishlist();
    const next = wishlisted ? list.filter(i => i !== productId) : [...list, productId];
    setWishlist(next);
    setWishlisted(!wishlisted);
  };

  const prevImage = () => changeImage((active - 1 + urls.length) % urls.length);
  const nextImage = () => changeImage((active + 1) % urls.length);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {urls.length > 1 && (
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {urls.map((url, i) => (
            <button
              key={i}
              onClick={() => changeImage(i)}
              className={`flex-shrink-0 w-16 h-16 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                active === i ? 'border-[#c8102e] shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
        {urls[active] ? (
          <img
            src={urls[active]}
            alt="Product Preview"
            className={`w-full h-full object-cover transition-opacity duration-150 ${fade ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image available</div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {isBestseller && (
            <span className="bg-[#c8102e] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              Featured
            </span>
          )}
          {enablePersonalization && (
            <span className="bg-purple-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              Personalized
            </span>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-xs hover:scale-105 transition-transform"
        >
          <Heart size={18} className={wishlisted ? 'fill-[#c8102e] text-[#c8102e]' : 'text-slate-400'} />
        </button>

        {urls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
