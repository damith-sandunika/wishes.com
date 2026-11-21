import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Gift, Star, FolderTree,
    Sparkles, SlidersHorizontal, Boxes, Tag, Users,
    Truck, Settings, ChevronRight, ChevronDown, Wand2, BarChart3,
    UserCheck, MessageSquare, Package, Award, Building2,
    HelpCircle, ShieldCheck, FileText, RotateCcw
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', route: '/admin', icon: LayoutDashboard },
    { label: 'Orders', route: '/admin/orders', icon: ShoppingBag },
    {
        id: 'items',
        label: 'Items',
        icon: Package,
        children: [
            { label: 'Categories', route: '/admin/categories', icon: FolderTree },
            { label: 'Products', route: '/admin/products', icon: Package },
            { label: 'Gift Add-ons', route: '/admin/addons', icon: Gift },
            { label: 'Customized Items', route: '/admin/personalizations', icon: Wand2 },
            { label: 'Free Items', route: '/admin/free-items', icon: Award },
        ]
    },
    { label: 'Special Days', route: '/admin/occasions', icon: Sparkles },
    { label: 'Delivery & Shipping', route: '/admin/delivery', icon: Truck },
    { label: 'Reviews', route: '/admin/reviews', icon: Star },
    { label: 'Inventory', route: '/admin/inventory', icon: Boxes },
    { label: 'Coupons & Sales', route: '/admin/coupons', icon: Tag },
    { label: 'Reports & Analytics', route: '/admin/reports', icon: BarChart3 },
    { label: 'Staff Accounts', route: '/admin/staff', icon: UserCheck },
    { label: 'Customers', route: '/admin/customers', icon: Users },
    { label: 'Suppliers', route: '/admin/suppliers', icon: Building2 },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        children: [
            { label: 'General Settings', route: '/admin/settings', icon: Settings },
            { label: 'Help & FAQ', route: '/admin/settings/faq', icon: HelpCircle },
            { label: 'Privacy Policy', route: '/admin/settings/privacy-policy', icon: ShieldCheck },
            { label: 'Delivery Policy', route: '/admin/settings/delivery-policy', icon: Truck },
            { label: 'Terms & Conditions', route: '/admin/settings/terms', icon: FileText },
            { label: 'Returns & Refunds', route: '/admin/settings/returns-policy', icon: RotateCcw },
            { label: 'Sliders & Banners', route: '/admin/sliders', icon: SlidersHorizontal },
            { label: 'WhatsApp Templates', route: '/admin/whatsapp-templates', icon: MessageSquare },
        ]
    },
];

export default function AdminSidebar({ collapsed, setCollapsed, onClose }) {
    const location = useLocation();
    const [openSection, setOpenSection] = useState(null);

    const isActive = (route) => {
        if (route === '/admin') return location.pathname === '/admin';
        return location.pathname === route || location.pathname.startsWith(route + '/');
    };

    // Auto-expand active parent and auto-collapse others
    useEffect(() => {
        const path = location.pathname;
        const itemsPaths = ['/admin/categories', '/admin/products', '/admin/addons', '/admin/personalizations', '/admin/free-items'];
        const settingsPaths = ['/admin/settings', '/admin/sliders', '/admin/whatsapp-templates'];

        if (itemsPaths.some(p => path === p || path.startsWith(p + '/'))) {
            setOpenSection('items');
        } else if (settingsPaths.some(p => path === p || path.startsWith(p + '/'))) {
            setOpenSection('settings');
        }
    }, [location.pathname]);

    const toggleSection = (id) => {
        setOpenSection(prev => prev === id ? null : id);
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
                    const Icon = item.icon;

                    // Accordion Parent with sub-tabs
                    if (item.children) {
                        const isSectionOpen = openSection === item.id;
                        const hasActiveChild = item.children.some(c => isActive(c.route));

                        return (
                            <div key={item.id} className="relative group">
                                <button
                                    type="button"
                                    onClick={() => { if (collapsed) setCollapsed(false); toggleSection(item.id); }}
                                    className={`w-full flex items-center rounded-xl transition-all duration-200 ${
                                        collapsed ? 'w-10 h-10 mx-auto justify-center' : 'py-2 px-3 justify-between'
                                    } ${hasActiveChild ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={17} className={`${hasActiveChild ? 'text-blue-600' : 'text-slate-500'} shrink-0`} />
                                        {!collapsed && <span className="text-[12px] whitespace-nowrap">{item.label}</span>}
                                    </div>
                                    {!collapsed && (
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSectionOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                    )}
                                </button>

                                {/* Sub-tabs list */}
                                {!collapsed && isSectionOpen && (
                                    <div className="pl-4 pr-1 py-1 space-y-0.5 ml-3 border-l border-blue-200/60 my-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                        {item.children.map(child => {
                                            const childActive = isActive(child.route);
                                            const ChildIcon = child.icon;
                                            return (
                                                <Link
                                                    key={child.route}
                                                    to={child.route}
                                                    onClick={onClose}
                                                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                        childActive
                                                            ? 'bg-blue-600 text-white shadow-2xs font-bold'
                                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <ChildIcon size={14} className={childActive ? 'text-white' : 'text-slate-400'} />
                                                    <span className="truncate">{child.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Normal Single Item
                    const active = isActive(item.route);

                    return (
                        <div key={item.label} className="relative group">
                            <Link
                                to={item.route}
                                onClick={onClose}
                                className={`flex items-center rounded-xl transition-all duration-200 ${collapsed ? 'w-10 h-10 mx-auto justify-center' : 'py-2 px-3 justify-between'} ${
                                    active ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                                }`}
                            >
                                <div className={`flex items-center gap-3 ${collapsed && 'justify-center'}`}>
                                    <Icon size={17} className={`${active ? 'opacity-100 text-blue-700' : 'opacity-80 text-slate-500'} shrink-0 transition-colors`} />
                                    {!collapsed && <span className="text-[12px] font-semibold whitespace-nowrap">{item.label}</span>}
                                </div>
                                {!collapsed && active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
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
