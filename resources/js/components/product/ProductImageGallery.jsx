import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}
function setWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

export default function ProductImageGallery({ images = [], fallback, productId }) {
  // Build full URL array
  const urls = images.length
    ? images.map(img => img.startsWith('http') ? img : `/storage/${img}`)
    : [fallback || FALLBACK];

  // Pad to 4 thumbnails min for display
  const thumbs = urls.length < 4
    ? [...urls, ...Array(4 - urls.length).fill(fallback || FALLBACK)]
    : urls;

  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (productId) setWishlisted(getWishlist().includes(productId));
  }, [productId]);

  const changeImage = (idx) => {
    if (idx === active) return;
    setFade(false);
    setTimeout(() => { setActive(idx); setFade(true); }, 150);
  };

  const toggleWishlist = () => {
    if (!productId) return;
    const list = getWishlist();
    const next = wishlisted ? list.filter(i => i !== productId) : [...list, productId];
    setWishlist(next);
    setWishlisted(!wishlisted);
  };

  const prevImage = () => changeImage((active - 1 + thumbs.length) % thumbs.length);
  const nextImage = () => changeImage((active + 1) % thumbs.length);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails - vertical on desktop, horizontal on mobile */}
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {thumbs.slice(0, 4).map((url, i) => (
          <button key={i} onClick={() => changeImage(i)}
            className={`flex-shrink-0 w-16 h-16 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all
              ${active === i ? 'border-brand shadow-sm' : 'border-transparent hover:border-gray-300'}`}>
            <img src={url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
        <img
          src={thumbs[active]}
          alt="Product"
          className={`w-full h-full object-cover transition-opacity duration-150 ${fade ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-brand text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">Best Seller</span>
          <span className="bg-purple-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">Personalized</span>
        </div>

        {/* Wishlist */}
        <button onClick={toggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm hover:scale-110 transition-transform">
          <Heart size={18} className={wishlisted ? 'fill-brand text-brand' : 'text-gray-400'} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Prev / Next arrows */}
        {thumbs.length > 1 && (
          <>
            <button onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {thumbs.slice(0, 4).map((_, i) => (
            <button key={i} onClick={() => changeImage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${active === i ? 'bg-brand w-4' : 'bg-white/70'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
