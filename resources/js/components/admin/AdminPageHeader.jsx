import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminPageHeader({ title, subtitle, actions, backUrl, hideBack = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isRoot = location.pathname === '/admin' || location.pathname === '/admin/';
    const shouldShowBack = !hideBack && !isRoot;

    const handleBack = () => {
        if (backUrl) navigate(backUrl);
        else if (window.history.length > 1) navigate(-1);
        else navigate('/admin');
    };

    return (
        <div className="mb-4 sm:mb-6 relative z-10 w-full">
            <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-20 sm:opacity-50">
                        <div className="w-20 sm:w-24 h-20 sm:h-24 bg-blue-100/50 rotate-45 translate-x-12 rounded-lg" />
                        <div className="w-28 sm:w-36 h-28 sm:h-36 bg-blue-200/50 rotate-45 translate-x-6 -ml-8 rounded-xl" />
                        <div className="w-36 sm:w-48 h-36 sm:h-48 bg-blue-300/40 rotate-45 -ml-12 rounded-2xl" />
                    </div>
                </div>

                {/* Left Corner Back Button + Title & Subtitle */}
                <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                    {shouldShowBack && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs hover:shadow-xs transition-all active:scale-95 group/back cursor-pointer"
                            title="Go Back"
                            aria-label="Go Back"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} className="group-hover/back:-translate-x-0.5 transition-transform" />
                        </button>
                    )}

                    <div className="flex flex-col gap-0.5 min-w-0">
                        <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight capitalize truncate">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm font-medium line-clamp-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons: on mobile wraps to next row and right-aligned */}
                {actions && (
                    <div className="relative z-10 flex items-center justify-end flex-wrap gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
