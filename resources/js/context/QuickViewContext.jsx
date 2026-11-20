import React, { createContext, useContext, useState } from 'react';
import { X, ShoppingCart, Check, Star, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';

const QuickViewContext = createContext();

export const useQuickView = () => useContext(QuickViewContext);

export const QuickViewProvider = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const openQuickView = (product) => {
        setAdded(false);
        setSelectedProduct(product);
    };

    const closeQuickView = () => {
        setSelectedProduct(null);
        setTimeout(() => setAdded(false), 300);
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, 1);
            setAdded(true);
            setTimeout(() => {
                closeQuickView();
            }, 1000);
        }
    };

    return (
        <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
            {children}
            
            {selectedProduct && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={closeQuickView}
                >
                    <div 
                        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row relative border border-gray-100"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={closeQuickView} 
                            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md hover:bg-red-50 text-gray-700 hover:text-brand rounded-full shadow-md transition-all"
                        >
                            <X size={18} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 relative bg-rose-50/40 h-[220px] md:h-auto overflow-hidden flex items-center justify-center p-6">
                            {selectedProduct.discount > 0 && (
                                <div className="absolute top-3 left-3 z-10 bg-brand text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                    {selectedProduct.discount}% OFF
                                </div>
                            )}
                            <img 
                                src={selectedProduct.image} 
                                alt={selectedProduct.name} 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        </div>
                        
                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white">
                            <div>
                                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium mb-1.5">
                                    <Star size={14} fill="currentColor" />
                                    <span>{selectedProduct.rating || 4.9}</span>
                                    <span className="text-gray-400">({selectedProduct.reviewsCount || 128} reviews)</span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                                    {selectedProduct.name}
                                </h2>
                                
                                <p className="text-gray-500 text-xs md:text-sm mb-4 leading-relaxed line-clamp-3">
                                    {selectedProduct.description || "A thoughtful, handcrafted gift created to make every special celebration unforgettable."}
                                </p>
                                
                                <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 mb-6">
                                    <span className="text-xs text-gray-400 font-medium block mb-0.5">Price</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-brand">
                                            LKR {Number(selectedProduct.price).toLocaleString()}
                                        </span>
                                        {selectedProduct.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                LKR {Number(selectedProduct.oldPrice).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2.5">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={added}
                                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                                        added 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-brand hover:bg-brand-dark text-white hover:-translate-y-0.5'
                                    }`}
                                >
                                    {added ? (
                                        <>
                                            <Check size={18} />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                
                                <a 
                                    href={`/product/${selectedProduct.id}`}
                                    onClick={closeQuickView}
                                    className="w-full py-2.5 text-center text-xs text-gray-600 hover:text-brand font-medium hover:underline flex items-center justify-center gap-1"
                                >
                                    View Full Product Details <ArrowRight size={13} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </QuickViewContext.Provider>
    );
};
