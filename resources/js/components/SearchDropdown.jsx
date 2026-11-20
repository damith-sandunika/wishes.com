import React from 'react';
import { ShoppingCart } from 'lucide-react';

const SearchDropdown = ({ isOpen, results, onProductClick, onAddToCart, searchQuery, isMobile = false }) => {
    if (!isOpen || !searchQuery) return null;

    return (
        <div className={`absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-30 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 ${isMobile ? 'max-h-[300px]' : 'max-h-[400px]'}`}>
            {results.length > 0 ? (
                <div className="flex flex-col">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        Products
                    </div>
                    {results.map(product => (
                        <div
                            key={product.id}
                            className={`flex items-center gap-3 px-4 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0 group ${isMobile ? 'py-2' : 'py-3 gap-4'}`}
                        >
                            <div
                                className={`flex-1 flex items-center cursor-pointer ${isMobile ? 'gap-3' : 'gap-4'}`}
                                onMouseDown={(e) => { e.preventDefault(); onProductClick(product); }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`rounded-lg object-cover bg-gray-50 ${isMobile ? 'w-10 h-10 rounded-md' : 'w-12 h-12'}`}
                                />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 leading-tight">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm font-bold text-brand">Rs {Number(product.price).toFixed(2)}</span>
                                        {!isMobile && product.oldPrice && (
                                            <span className="text-xs text-gray-400 line-through">Rs {Number(product.oldPrice).toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
                                className={`bg-red-100 hover:bg-brand text-brand hover:text-white rounded-full transition-colors shrink-0 shadow-sm ${isMobile ? 'p-2' : 'p-2.5'}`}
                                title="Add to Cart"
                            >
                                <ShoppingCart size={isMobile ? 14 : 16} />
                            </button>
                        </div>
                    ))}
                    {!isMobile && (
                        <div className="p-3 border-t border-gray-100 text-center">
                            <button
                                onMouseDown={(e) => { e.preventDefault(); onProductClick(null); }}
                                className="text-sm text-brand font-medium hover:underline"
                            >
                                View all results for "{searchQuery}"
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className={`text-center text-gray-500 text-sm ${isMobile ? 'p-4' : 'p-8'}`}>
                    No gifts found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
