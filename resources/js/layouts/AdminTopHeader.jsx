import React, { useState } from 'react';
import { Menu, ExternalLink, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminTopHeader({ onToggleSidebar, setMobileOpen, sidebarCollapsed, setSidebarCollapsed }) {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Wishes Admin', email: 'admin@wishes.com' };

    const handleLogout = async () => {
        try { await axios.post('/api/logout'); } catch (_) {}
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        navigate('/admin/login');
    };

    return (
        <div className="flex items-center gap-4 lg:gap-8 flex-1 w-full justify-between">
            {/* Hamburger Menu (Mobile Only) */}
            <button
                onClick={() => setMobileOpen(true)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden group"
            >
                <Menu size={24} className="group-active:scale-90 transition-transform" />
            </button>

            {/* Desktop Left: Store Brand & Status Pulse matching Pet Zone (No hamburger) */}
            <div
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex items-center gap-3 shrink-0 border-r border-slate-100 pr-8 mr-4 cursor-pointer group"
            >
                <div>
                    <h2 className="text-lg font-black text-slate-900 leading-none tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                        Wishes.com
                    </h2>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        Online Platform Node
                    </div>
                </div>
            </div>

            {/* Mobile View Center: Store Name centered nicely */}
            <div className="flex items-center lg:hidden flex-1 justify-center animate-fade-in">
                <div className="flex flex-col items-center">
                    <h1 className="text-slate-900 font-black text-base tracking-wide leading-tight">Wishes.com</h1>
                    <p className="text-blue-600 text-[9px] font-bold uppercase tracking-widest mt-0.5">E-Commerce Management</p>
                </div>
            </div>

            {/* Right: Storefront Link & Profile Menu */}
            <div className="flex items-center gap-3 ml-auto shrink-0">
                <Link
                    to="/"
                    target="_blank"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
                >
                    <ExternalLink size={14} className="text-slate-400" />
                    <span>View Storefront</span>
                </Link>

                <div className="relative">
                    <div
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 cursor-pointer group p-1 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                                {user.name || 'Admin'}
                            </p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5 opacity-70">
                                Super Admin
                            </p>
                        </div>
                        <div className="flex items-center justify-center transition-all lg:w-10 lg:h-10 lg:rounded-xl lg:bg-slate-50 lg:border lg:border-slate-200 lg:shadow-xs group-hover:lg:border-blue-300 text-blue-600">
                            <User size={18} />
                        </div>
                    </div>

                    {profileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                </div>
                                <div className="p-2">
                                    <Link
                                        to="/admin/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group"
                                    >
                                        <Settings size={16} className="text-slate-400 group-hover:text-blue-600" />
                                        <span className="text-sm font-semibold text-slate-700">Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-all group mt-1"
                                    >
                                        <LogOut size={16} className="text-rose-500" />
                                        <span className="text-sm font-semibold">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
