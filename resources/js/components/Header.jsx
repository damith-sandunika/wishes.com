import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingCart, Menu, ChevronDown, Phone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import SearchDropdown from './SearchDropdown';
import HeaderMobileDrawer from './HeaderMobileDrawer';
import FlashSaleBanner from './header/FlashSaleBanner';

const PRIMARY_NAV = [
    { label: 'Home', to: '/' },
    { label: 'Gifts by Occasion', to: '/occasion' },
];

export default function Header() {
    const { cartCount, addToCart } = useCart();
    const { openQuickView } = useQuickView();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        try { const u = localStorage.getItem('user'); if (u) setLoggedInUser(JSON.parse(u)); } catch {}
    }, []);

    useEffect(() => {
        axios.get('/api/public/products')
            .then(res => setAllProducts(res.data.map(p => ({
                id: p.id, name: p.name,
                price: p.discount_price || p.selling_price,
                oldPrice: p.discount_price ? p.selling_price : null,
                image: p.images?.length > 0 ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`) : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80',
            })))).catch(() => {});
        axios.get('/api/public/categories')
            .then(res => setCategories(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
            .catch(() => setCategories([]));
    }, []);

    const handleSearchChange = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        setSearchResults(q.trim() ? allProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : []);
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (searchQuery.trim()) { setIsSearchFocused(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }
    };

    const renderSearch = (isMobile = false) => (
        <div className={`relative ${isMobile ? 'block md:hidden px-3 pb-2.5' : 'hidden md:block flex-1 max-w-xl mx-4 lg:mx-6'}`}>
            <form onSubmit={handleSearchSubmit} className="relative">
                <input
                    type="text"
                    placeholder="Search fresh flowers, cakes, gifts..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-brand focus:bg-white transition-all shadow-2xs"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>
            {isSearchFocused && searchQuery.trim() && (
                <SearchDropdown
                    results={searchResults}
                    onProductClick={(p) => { setIsSearchFocused(false); setSearchQuery(''); if (p) openQuickView(p); else handleSearchSubmit(); }}
                    onAddToCart={(p) => { addToCart(p, 1); setIsSearchFocused(false); setSearchQuery(''); }}
                />
            )}
        </div>
    );

    return (
        <header className="w-full bg-white shadow-xs sticky top-0 z-50">
            <FlashSaleBanner />
            <div className="bg-[#b91c1c] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium">
                <div className="max-w-7xl mx-auto flex justify-center sm:justify-between items-center gap-2">
                    <span className="flex items-center gap-1.5 tracking-tight">
                        <span>🚚</span> Same Day Delivery in Colombo <span className="opacity-60">|</span> Free Delivery Over Rs. 5,000
                    </span>
                    <span className="hidden sm:flex items-center gap-1 text-xs text-white/90">
                        <Phone size={11} /> +94 76 123 4567 <span className="opacity-60">|</span> Help &amp; Support
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-3 py-2 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1 text-gray-800 hover:text-brand transition-colors">
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="flex items-center">
                        <img src="/logo.png" alt="Wishes.com" className="h-9 sm:h-12 w-auto object-contain" />
                    </Link>
                </div>

                {renderSearch(false)}

                <div className="flex items-center gap-1 sm:gap-2">
                    <Link to="/wishlist" className="p-1.5 sm:p-2 text-gray-600 hover:text-brand transition-colors relative">
                        <Heart size={20} />
                    </Link>
                    <Link to="/account" className="p-1.5 sm:p-2 text-gray-600 hover:text-brand transition-colors flex items-center gap-1">
                        <User size={20} />
                        {loggedInUser && <span className="hidden xl:inline text-xs font-semibold text-gray-700 max-w-[80px] truncate">{loggedInUser.name}</span>}
                    </Link>
                    <Link to="/cart" className="flex items-center gap-1.5 bg-rose-50 text-brand px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-rose-100 transition-colors">
                        <ShoppingCart size={17} />
                        <span className="bg-[#c8102e] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                    </Link>
                </div>
            </div>

            {renderSearch(true)}

            <div className="hidden lg:block border-t border-gray-100 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
                    <div className="relative">
                        <button onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                            className="flex items-center gap-2 bg-[#c8102e] text-white px-4 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors shrink-0 rounded-t-lg">
                            ☰ All Categories <ChevronDown size={14} className={isCatDropdownOpen ? 'rotate-180' : ''} />
                        </button>
                        {isCatDropdownOpen && (
                            <div onMouseLeave={() => setIsCatDropdownOpen(false)}
                                className="absolute top-full left-0 w-60 bg-white rounded-b-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150">
                                {categories.length > 0 ? (
                                    categories.map(c => (
                                        <Link key={c.id} to={`/category/${c.slug || c.id}`} onClick={() => setIsCatDropdownOpen(false)}
                                            className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-rose-50 hover:text-brand transition-colors">
                                            {c.name}
                                        </Link>
                                    ))
                                ) : (
                                    <Link to="/shop" onClick={() => setIsCatDropdownOpen(false)} className="block px-4 py-2 text-xs text-gray-500">
                                        View All Categories &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    {PRIMARY_NAV.map(link => (
                        <Link key={link.to} to={link.to}
                            className={`flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap hover:text-brand ${location.pathname === link.to ? 'text-brand border-b-2 border-brand font-semibold' : 'text-gray-700'}`}>
                            {link.label}
                        </Link>
                    ))}
                    {categories.slice(0, 5).map(cat => (
                        <Link key={cat.id || cat.slug} to={`/category/${cat.slug || cat.id}`}
                            className={`flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap hover:text-brand ${location.pathname === `/category/${cat.slug || cat.id}` ? 'text-brand border-b-2 border-brand font-semibold' : 'text-gray-700'}`}>
                            {cat.name}
                        </Link>
                    ))}
                    <Link to="/shop?filter=offers" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-200/60 transition-colors whitespace-nowrap">
                        <span>🎁</span> Special Offers <span className="bg-[#c8102e] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                    </Link>
                </div>
            </div>

            <HeaderMobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={categories} />
        </header>
    );
}
