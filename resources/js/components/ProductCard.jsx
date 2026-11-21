import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Check, Star, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
}
function setWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

export default function ProductCard({ product = {} }) {
  const {
    id, name, price, oldPrice, image, images, discount,
    rating = 0, reviewsCount = 0, isBestseller, categoryName,
    short_description,
  } = product;

  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) setWishlisted(getWishlist().includes(id));
  }, [id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    const next = wishlisted ? list.filter(i => i !== id) : [...list, id];
    setWishlist(next);
    setWishlisted(!wishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addToCart) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const rawImg = image || (Array.isArray(images) && images[0]) || '';
  const displayImg = rawImg 
    ? (rawImg.startsWith('http://') || rawImg.startsWith('https://') 
        ? rawImg 
        : `/storage/${rawImg.replace(/^\/?(storage\/)?/, '')}`)
    : '/images/placeholder.png';

  const discountPct = discount || (oldPrice && price && Number(oldPrice) > Number(price)
    ? Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)
    : null);

  const numRating = Number(rating) || 5;
  const numReviews = Number(reviewsCount) || 128;
  const subtitle = short_description || categoryName || 'A timeless gift of love';

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#ecd9c6] shadow-[0_4px_18px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(153,0,17,0.18)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-[#faf7f2]">
        <Link to={`/product/${id}`} className="block w-full h-full">
          <img
            src={displayImg}
            alt={name || 'Gift item'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top-Left Premium Ribbon Badge with Swallowtail V-cut */}
        <div
          className="absolute top-0 left-3.5 z-20 w-11 pt-2.5 pb-3.5 bg-gradient-to-b from-[#b80018] via-[#940014] to-[#6b000e] text-white shadow-md flex flex-col items-center pointer-events-none drop-shadow-md"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)' }}
        >
          <Crown size={15} className="text-amber-300 drop-shadow-xs mb-0.5" />
          <span className="text-[10px] font-extrabold leading-[1.1] text-center tracking-tight uppercase">
            {discountPct ? `-${discountPct}%` : 'Best\nSeller'}
          </span>
        </div>

        {/* Top-Right Circular Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-md flex items-center justify-center text-[#990011] hover:scale-105 active:scale-90 transition-all duration-200 border border-white/60"
          aria-label="Save to wishlist"
        >
          <Heart
            size={16}
            className={wishlisted ? 'fill-[#990011] text-[#990011]' : 'stroke-[#990011] stroke-[2]'}
          />
        </button>
      </div>

      {/* Glassy Product Info Section with Curved Gold Wave */}
      <div className="relative backdrop-blur-md bg-white/92 border-t border-white/50 pt-3 pb-3.5 px-3.5 flex flex-col justify-between flex-1 shadow-[0_-6px_20px_rgba(0,0,0,0.03)]">
        
        {/* Elegant Gold Wave Crest SVG */}
        <div className="absolute -top-[21px] left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 350 24" className="w-full h-[22px] block" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`goldGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f7ecd7" stopOpacity="0.5" />
                <stop offset="35%" stopColor="#d4af37" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f3d48d" stopOpacity="1" />
                <stop offset="100%" stopColor="#b8861b" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <path d="M0,4 Q130,4 210,16 T350,22" fill="none" stroke={`url(#goldGrad-${id})`} strokeWidth="3" />
            <path d="M0,4 Q130,4 210,16 T350,22 L350,24 L0,24 Z" fill="rgba(255, 255, 255, 0.92)" />
          </svg>
        </div>

        <div>
          {/* Title with Playfair Display Font */}
          <Link
            to={`/product/${id}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="block text-base sm:text-[17px] font-bold text-gray-900 group-hover:text-[#990011] transition-colors line-clamp-1 leading-snug"
          >
            {name}
          </Link>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
            {subtitle}
          </p>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5 min-h-[16px]">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.round(numRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium ml-0.5">
              ({numReviews})
            </span>
          </div>
        </div>

        {/* Bottom Price & Add to Cart Bar */}
        <div className="pt-2.5 mt-1 flex items-center justify-between gap-2 border-t border-gray-100/60">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-base sm:text-lg font-extrabold text-[#b30e1e] tracking-tight truncate">
              Rs. {Number(price || 0).toLocaleString()}
            </span>
            {oldPrice && Number(oldPrice) > Number(price) && (
              <span className="text-xs text-gray-400 line-through truncate">
                Rs. {Number(oldPrice).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`shrink-0 h-8 sm:h-9 px-3.5 sm:px-4 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#a00014] hover:bg-[#850010] text-white shadow-rose-900/20'
            }`}
            title="Add to cart"
          >
            {added ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={13} strokeWidth={2.2} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
