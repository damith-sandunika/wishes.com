import React from 'react';
import { Link } from 'react-router-dom';
import { X, Phone } from 'lucide-react';

export default function HeaderMobileDrawer({ isOpen, onClose, categories = [] }) {
    const catList = Array.isArray(categories) ? categories : (categories?.data || []);
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-brand/5">
                    <img src="/logo.png" alt="Wishes.com" className="h-11 w-auto object-contain" />
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-brand bg-white rounded-full shadow-sm">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">Menu</span>
                    <Link onClick={onClose} to="/" className="text-gray-700 hover:text-brand hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-medium">Home</Link>
                    <Link onClick={onClose} to="/occasion" className="text-gray-700 hover:text-brand hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-medium">Gifts by Occasion</Link>
                    <Link onClick={onClose} to="/wishlist" className="text-gray-700 hover:text-brand hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-medium">Wishlist</Link>
                    <div className="mt-2 border-t border-gray-100 pt-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1 block">Categories</span>
                        {catList.map(cat => (
                            <Link key={cat.id} onClick={onClose} to={`/category/${cat.id}`} className="block text-gray-700 hover:text-brand hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors">{cat.name}</Link>
                        ))}
                    </div>
                    <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-1">
                        <Link onClick={onClose} to="/offers" className="text-brand font-medium px-4 py-3 rounded-xl hover:bg-red-50 transition-colors">🎁 Special Offers</Link>
                        <Link onClick={onClose} to="/contact" className="text-gray-700 hover:text-brand hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-medium">Contact</Link>
                    </div>
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3 px-2">
                        <Phone size={16} className="text-brand shrink-0" />
                        <a href="tel:+94761234567" className="text-sm font-medium text-gray-700">+94 76 123 4567</a>
                    </div>
                </div>
            </div>
        </>
    );
}
