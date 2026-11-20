import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingCart, Menu, ChevronDown, Phone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import SearchDropdown from './SearchDropdown';
import HeaderMobileDrawer from './HeaderMobileDrawer';

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Gifts by Occasion', to: '/occasion', hasDropdown: true },
    { label: 'Gift Hampers', to: '/category/hampers' },
    { label: 'Flowers', to: '/category/flowers' },
    { label: 'Cakes', to: '/category/cakes' },
    { label: 'Personalized Gifts', to: '/category/personalized' },
    { label: 'Corporate Gifts', to: '/category/corporate' },
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
                image: p.images?.length > 0
                    ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`)
                    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80',
            })))).catch(() => {});
        axios.get('/api/public/categories').then(res => setCategories(res.data)).catch(() => {});
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

    const handleProductClick = (product) => {
        setIsSearchFocused(false); setSearchQuery('');
        if (product) openQuickView(product); else handleSearchSubmit();
    };

    const handleAddToCart = (product) => { addToCart(product, 1); setIsSearchFocused(false); setSearchQuery(''); };

    return (
        <header className="w-full bg-white shadow-xs sticky top-0 z-50">
            {/* Top Announcement Bar */}
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

            {/* Main Header Row */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 py-2 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 text-gray-800 hover:text-brand transition-colors">
                    <Menu size={24} />
                </button>

                <Link to="/" className="flex items-center justify-center flex-1 lg:flex-initial">
                    <img src="/logo.png" alt="Wishes.com" className="h-12 sm:h-13 md:h-14 w-auto object-contain max-w-[190px] sm:max-w-none" />
                </Link>

                {/* Desktop Search Bar */}
                <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 mx-6 relative z-50">
                    <input type="text" value={searchQuery} onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        placeholder="Search for gifts, cakes, flowers and more..."
                        className="w-full pl-5 pr-14 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-brand focus:border-brand outline-none text-sm transition-all"
                        autoComplete="off" />
                    <button type="submit" className="absolute right-0 top-0 h-full px-5 bg-[#c8102e] text-white rounded-full hover:bg-brand-dark transition-colors">
                        <Search size={18} />
                    </button>
                    <SearchDropdown isOpen={isSearchFocused} results={searchResults} searchQuery={searchQuery}
                        onProductClick={handleProductClick} onAddToCart={handleAddToCart} />
                </form>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5">
                    <Link to="/account" className="p-1 sm:p-1.5 text-gray-700 hover:text-brand transition-colors flex flex-col items-center">
                        <User size={22} className={loggedInUser ? 'text-[#c8102e]' : ''} />
                        <span className="text-[10px] mt-0.5 whitespace-nowrap hidden lg:block">{loggedInUser ? loggedInUser.name?.split(' ')[0] : 'Sign In / Register'}</span>
                    </Link>
                    <Link to="/wishlist" className="p-1 sm:p-1.5 text-gray-700 hover:text-brand transition-colors relative flex flex-col items-center">
                        <div className="relative">
                            <Heart size={22} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#c8102e] rounded-full"></span>
                        </div>
                        <span className="text-[10px] mt-0.5 hidden lg:block">Wishlist</span>
                    </Link>
                    <Link to="/cart" className="p-1 sm:p-1.5 text-gray-700 hover:text-brand transition-colors relative flex flex-col items-center">
                        <div className="relative">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#c8102e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">{cartCount}</span>}
                        </div>
                        <span className="text-[10px] mt-0.5 hidden lg:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar matching user design */}
            <div className="lg:hidden px-4 pb-3 pt-1 border-b border-gray-100 bg-white">
                <form onSubmit={handleSearchSubmit} className="flex relative items-center rounded-2xl overflow-hidden border border-gray-200 focus-within:border-brand bg-white shadow-2xs">
                    <input type="text" value={searchQuery} onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        placeholder="Search for gifts, cakes, flowers and more..."
                        className="w-full pl-4 pr-12 py-2.5 text-xs text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                        autoComplete="off" />
                    <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-[#c8102e] text-white flex items-center justify-center hover:bg-[#b91c1c] transition-colors rounded-r-2xl">
                        <Search size={18} />
                    </button>
                    <SearchDropdown isOpen={isSearchFocused} results={searchResults} searchQuery={searchQuery}
                        onProductClick={handleProductClick} onAddToCart={handleAddToCart} isMobile />
                </form>
            </div>

            {/* Desktop Category Navigation Bar */}
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
                    {NAV_LINKS.map(link => (
                        <Link key={link.to} to={link.to}
                            className={`flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap hover:text-brand ${location.pathname === link.to ? 'text-brand border-b-2 border-brand font-semibold' : 'text-gray-700'}`}>
                            {link.label}{link.hasDropdown && <ChevronDown size={14} />}
                        </Link>
                    ))}
                    <Link to="/shop?filter=offers" className="ml-auto flex items-center gap-1 px-3 py-2.5 text-sm font-semibold text-brand whitespace-nowrap">
                        🎁 Special Offers <span className="bg-[#c8102e] text-white text-[10px] px-2 py-0.5 rounded-full ml-1">HOT</span>
                    </Link>
                </div>
            </div>

            <HeaderMobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={categories} />
        </header>
    );
}
