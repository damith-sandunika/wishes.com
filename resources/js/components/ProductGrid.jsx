import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductGrid({
  title = 'Featured Gifts',
  viewAllLink = '/shop',
  products = [],
  enableShowMore = false,
  limit = 8,
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? products : products.slice(0, limit);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 lg:px-6">
      {/* Clean Section Header without emojis, without arrow brackets, matching user screenshot */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-1 bg-[#c8102e] mt-1.5 rounded-full" />
        </div>
        <Link 
          to={viewAllLink} 
          className="text-[#c8102e] font-semibold text-xs sm:text-sm hover:underline flex items-center gap-1 shrink-0"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Products Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12 text-sm">No products found in this section.</p>
      )}

      {/* Show More Button if enabled */}
      {enableShowMore && !showAll && products.length > limit && (
        <div className="text-center mt-7">
          <button
            onClick={() => setShowAll(true)}
            className="border border-[#c8102e] text-[#c8102e] hover:bg-[#c8102e] hover:text-white
                       px-8 py-2.5 rounded-xl font-medium text-sm transition-colors duration-200"
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
}
