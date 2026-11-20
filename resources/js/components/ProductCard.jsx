import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
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
    id, name, price, oldPrice, image, discount,
    rating = 4.8, reviewsCount = 128, isBestseller,
  } = product;

  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded]           = useState(false);

  useEffect(() => {
    setWishlisted(getWishlist().includes(id));
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
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stars = Math.round(rating);
  const discountPct = discount || (oldPrice ? Math.round((1 - price / oldPrice) * 100) : null);

  return (
    <div className="relative bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-lg
                    transition-all duration-200 overflow-hidden group flex flex-col">

      {/* Badges */}
      {isBestseller && (
        <span className="absolute top-2 left-2 z-10 bg-[#c8102e] text-white text-[11px] font-semibold
                         px-2 py-0.5 rounded-full">
          Best Seller
        </span>
      )}
      {discountPct && (
        <span className="absolute top-2 right-10 z-10 bg-amber-400 text-gray-900 text-[11px]
                         font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center
                   rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition"
        aria-label="Toggle wishlist"
      >
        <Heart
          size={16}
          className={wishlisted ? 'fill-[#c8102e] text-[#c8102e]' : 'text-gray-500 hover:text-[#c8102e]'}
          fill={wishlisted ? 'currentColor' : 'none'}
        />
      </button>

      {/* Clickable Image */}
      <Link to={`/product/${id}`} className="block aspect-square overflow-hidden bg-gray-50">
        <img
          src={image || 'https://via.placeholder.com/300x300?text=Gift'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
              fill={i < stars ? 'currentColor' : 'none'}
            />
          ))}
          <span className="text-[11px] text-gray-500 ml-0.5">({reviewsCount})</span>
        </div>

        {/* Name */}
        <Link to={`/product/${id}`} className="text-sm font-medium text-gray-800 hover:text-[#c8102e] line-clamp-2 mb-2 flex-1 transition-colors">
          {name}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-[#c8102e]">Rs. {Number(price || 0).toLocaleString()}</span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              Rs. {Number(oldPrice).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-[#c8102e] hover:bg-[#b91c1c]
                     text-white text-xs sm:text-sm font-medium py-2 rounded-xl transition-colors duration-200 shadow-2xs hover:shadow-md"
        >
          {added ? (
            <><Check size={16} /> Added to Cart!</>
          ) : (
            <><ShoppingCart size={16} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
