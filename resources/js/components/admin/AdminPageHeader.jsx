import React from 'react';

export default function AdminPageHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-6 relative z-10 w-full">
            <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-200 relative flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
                {/* Decorative Geometric Background Pattern matching Pet Zone */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/80 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                        <div className="w-24 h-24 bg-blue-100/50 rotate-45 translate-x-12 rounded-lg" />
                        <div className="w-36 h-36 bg-blue-200/50 rotate-45 translate-x-6 -ml-8 rounded-xl" />
                        <div className="w-48 h-48 bg-blue-300/40 rotate-45 -ml-12 rounded-2xl" />
                        <div className="w-32 h-32 bg-blue-400/30 rotate-45 -ml-16 rounded-lg" />
                    </div>
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight capitalize">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-slate-500 text-xs md:text-sm font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {actions && (
                    <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
