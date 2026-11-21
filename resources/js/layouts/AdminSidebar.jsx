import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Gift, Star, FolderTree,
    Sparkles, SlidersHorizontal, Boxes, Tag, Users,
    Truck, Settings, ChevronRight, Wand2, BarChart3,
    UserCheck, MessageSquare
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', route: '/admin', icon: LayoutDashboard },
    { label: 'Orders', route: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', route: '/admin/products', icon: Gift },
    { label: 'Categories', route: '/admin/categories', icon: FolderTree },
    { label: 'Occasions', route: '/admin/occasions', icon: Sparkles },
    { label: 'Personalization & Addons', route: '/admin/addons', icon: Wand2 },
    { label: 'Reviews', route: '/admin/reviews', icon: Star },
    { label: 'Sliders & Banners', route: '/admin/sliders', icon: SlidersHorizontal },
    { label: 'Inventory', route: '/admin/inventory', icon: Boxes },
    { label: 'Coupons & Sales', route: '/admin/coupons', icon: Tag },
    { label: 'Reports & Analytics', route: '/admin/reports', icon: BarChart3 },
    { label: 'Staff Accounts', route: '/admin/staff', icon: UserCheck },
    { label: 'WhatsApp Templates', route: '/admin/whatsapp-templates', icon: MessageSquare },
    { label: 'Customers', route: '/admin/customers', icon: Users },
    { label: 'Suppliers', route: '/admin/suppliers', icon: Truck },
    { label: 'Settings', route: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ collapsed, setCollapsed, onClose }) {
    const location = useLocation();

    const isActive = (route) => {
        if (route === '/admin') return location.pathname === '/admin';
        return location.pathname === route || location.pathname.startsWith(route + '/');
    };

    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300">
            <div
                onClick={() => setCollapsed(!collapsed)}
                className={`flex flex-col items-center text-center border-b border-slate-100/80 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors ${collapsed ? 'p-3 py-4' : 'p-6'}`}
            >
                <div className={`rounded-xl bg-white flex items-center justify-center shadow-xl shadow-blue-500/20 mb-2 ring-2 ring-white transition-all text-blue-600 ${!collapsed ? 'w-16 h-16 rounded-[1.25rem] ring-4 mb-3' : 'w-12 h-12'}`}>
                    <img src="/logo.png" alt="Wishes.com Logo" className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} object-contain`} />
                </div>
                {!collapsed && (
                    <div>
                        <div className="text-lg font-black text-slate-900 tracking-tight leading-tight">Wishes.com</div>
                        <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mt-1">E-Commerce Gift Node</div>
                    </div>
                )}
            </div>

            <nav className={`flex-1 py-4 scrollbar-hide ${collapsed ? 'px-1.5 space-y-1 overflow-visible' : 'px-3 space-y-1 overflow-y-auto'}`}>
                {MENU_ITEMS.map((item) => {
                    const active = isActive(item.route);
                    const Icon = item.icon;

                    return (
                        <div key={item.label} className="relative group">
                            <Link
                                to={item.route}
                                onClick={onClose}
                                className={`flex items-center rounded-xl transition-all duration-200 ${
                                    collapsed ? 'w-10 h-10 mx-auto justify-center' : 'py-2 px-3 justify-between'
                                } ${
                                    active
                                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                                }`}
                            >
                                <div className={`flex items-center gap-3 ${collapsed && 'justify-center'}`}>
                                    <Icon size={17} className={`${active ? 'opacity-100 text-blue-700' : 'opacity-80 text-slate-500'} shrink-0 transition-colors`} />
                                    {!collapsed && (
                                        <span className="text-[12px] font-semibold whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                                {!collapsed && active && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                )}
                            </Link>

                            {collapsed && (
                                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100/80 text-center bg-white/40 flex items-center justify-center">
                {!collapsed ? (
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="text-[11px] font-extrabold text-blue-600 tracking-widest uppercase mb-0.5">Powered by DSRZone</div>
                        <div className="text-[9px] font-extrabold text-slate-400/80 tracking-widest uppercase">Wishes.com</div>
                    </div>
                ) : (
                    <button onClick={() => setCollapsed(false)} className="p-2 w-10 h-10 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all mx-auto">
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
