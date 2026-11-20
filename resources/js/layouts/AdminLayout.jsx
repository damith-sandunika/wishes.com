import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', email: 'admin@wishes.com' };

    const handleLogout = async () => {
        try { await axios.post('/api/logout'); } catch (_) {}
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen flex overflow-x-hidden max-w-[100vw] relative bg-blue-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className="hidden md:flex w-64 flex-col fixed h-full z-10 shadow-2xl shadow-slate-900/5">
                <AdminSidebar currentPath={location.pathname} onClose={() => setSidebarOpen(false)} />
            </aside>

            <aside className={`md:hidden fixed top-0 left-0 h-full w-64 flex flex-col z-30 transform transition-transform duration-300 shadow-2xl shadow-slate-900/20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AdminSidebar currentPath={location.pathname} onClose={() => setSidebarOpen(false)} />
            </aside>

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0 relative z-10">
                <header className="h-16 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 relative shadow-md" style={{ backgroundColor: '#090087' }}>
                    <div className="flex items-center z-10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 -ml-1 rounded-xl text-blue-100 hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="hidden md:block ml-3">
                            <p className="text-[11px] font-semibold text-white uppercase tracking-widest leading-none">Wishes.com Console</p>
                        </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden z-10">
                        <p className="text-[11px] font-semibold text-white uppercase tracking-widest leading-none text-center">Wishes Console</p>
                    </div>

                    <div className="flex items-center gap-3 z-10">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 focus:outline-none group"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                                    <p className="text-[10px] font-normal text-blue-200 uppercase tracking-widest mt-0.5">Administrator</p>
                                </div>
                                <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-[#090087] font-semibold text-sm flex-shrink-0 shadow-md transition-transform group-hover:scale-105">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                    <div className="absolute right-0 mt-3 w-48 rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden bg-white/95 backdrop-blur-xl">
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6 overflow-x-hidden max-w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
