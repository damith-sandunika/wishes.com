import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishes_wishlist') || '[]');
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((p) => p.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishes_wishlist', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Wishlist ({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})
        </h1>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-20 h-20 text-[#dc2626] mb-4" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-6">Save items you love and find them here anytime.</p>
            <Link
              to="/shop"
              className="bg-[#dc2626] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Discover Thoughtful Gifts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=Gift'}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-[#dc2626] font-bold text-sm mb-3">
                    LKR {Number(product.price).toLocaleString()}
                  </p>
                  <div className="mt-auto flex flex-col gap-1">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center justify-center gap-1 bg-[#dc2626] text-white text-xs py-1.5 rounded-lg hover:bg-red-700 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition text-center"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
