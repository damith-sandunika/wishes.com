import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
    { name: 'Dashboard', route: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Orders', route: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Products', route: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Reviews', route: '/admin/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { name: 'Categories', route: '/admin/categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Occasions', route: '/admin/occasions', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Sliders & Banners', route: '/admin/sliders', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Inventory', route: '/admin/inventory', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Coupons', route: '/admin/coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { name: 'Customers', route: '/admin/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Suppliers', route: '/admin/suppliers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Settings', route: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export default function AdminSidebar({ currentPath, onClose }) {
    const isActive = (routePath) => {
        if (routePath === '/admin') return currentPath === '/admin';
        return currentPath === routePath || currentPath.startsWith(routePath + '/');
    };

    return (
        <div className="flex flex-col h-full text-blue-50 relative overflow-hidden shadow-[4px_0_24px_rgba(255,255,255,0.1)] border-r border-white/5" style={{ backgroundColor: '#1933C6' }}>
            <div className="relative flex flex-col items-center py-6 px-4 border-b border-white/10 z-10">
                <div className="h-11 w-36 bg-white rounded-xl flex items-center justify-center mb-2 shadow-lg px-2 py-1">
                    <img src="/logo.png" alt="Wishes.com Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-medium text-blue-200 uppercase tracking-widest">Admin Dashboard</span>
            </div>

            <nav className="relative flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar z-10">
                <div className="text-[10px] font-normal uppercase tracking-widest text-blue-300/50 px-3 mb-2">Main Menu</div>
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.route}
                        onClick={onClose}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 font-normal overflow-hidden ${
                            isActive(item.route)
                                ? 'bg-white text-[#1933C6] shadow-[0_4px_20px_rgba(0,0,0,0.15)] ring-1 ring-black/5'
                                : 'text-blue-100/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
                        }`}
                    >
                        <svg className={`relative z-10 flex-shrink-0 h-5 w-5 transition-transform duration-200 ${isActive(item.route) ? 'text-[#1933C6]' : 'group-hover:scale-110'}`}
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <span className="relative z-10 flex-1">{item.name}</span>
                        {isActive(item.route) && <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#1933C6] animate-pulse" />}
                    </Link>
                ))}
            </nav>

            <div className="relative px-4 py-3 mt-auto border-t border-white/10 text-center z-10 bg-white/5 backdrop-blur-md">
                <p className="text-[9px] text-blue-100 uppercase tracking-widest font-normal mb-0.5">Wishes.com Gift Platform</p>
                <p className="text-xs font-semibold text-white tracking-widest uppercase">Admin Edition</p>
            </div>
        </div>
    );
}
