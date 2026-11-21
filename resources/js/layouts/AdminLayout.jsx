import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopHeader from './AdminTopHeader';
import AdminPageHeader from '../components/admin/AdminPageHeader';

export default function AdminLayout({ children, pageTitle, pageSubtitle, headerActions, actions }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const resolvedActions = headerActions || actions;

    return (
        <div className="h-screen overflow-hidden flex bg-slate-50/70 font-sans text-slate-800">
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Collapsible Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out lg:static shrink-0 ${
                    sidebarCollapsed ? 'w-20' : 'w-64'
                } ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <AdminSidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                    onClose={() => setMobileOpen(false)}
                />
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center px-4 md:px-6 sticky top-0 z-30 shrink-0">
                    <AdminTopHeader
                        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                        setMobileOpen={setMobileOpen}
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                    />
                </header>

                {/* Page Content Body without ugly scrollbars */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {pageTitle && (
                            <AdminPageHeader
                                title={pageTitle}
                                subtitle={pageSubtitle}
                                actions={resolvedActions}
                            />
                        )}

                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
