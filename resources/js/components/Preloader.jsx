import React, { useState, useEffect } from 'react';

export default function Preloader({ isLoaded }) {
    const [progress, setProgress] = useState(10);
    const [isFading, setIsFading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 94) {
                    clearInterval(timer);
                    return 94;
                }
                const step = Math.max(1, Math.floor((95 - prev) / 6));
                return Math.min(prev + step, 94);
            });
        }, 90);

        const safetyTimer = setTimeout(() => {
            setProgress(100);
            setIsFading(true);
            setTimeout(() => setIsMounted(false), 600);
        }, 4500);

        return () => {
            clearInterval(timer);
            clearTimeout(safetyTimer);
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setProgress(100);
            const fadeTimer = setTimeout(() => setIsFading(true), 350);
            const unmountTimer = setTimeout(() => setIsMounted(false), 950);
            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(unmountTimer);
            };
        }
    }, [isLoaded]);

    if (!isMounted) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ease-in-out select-none ${
                isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
                background: 'radial-gradient(circle at center, #ffffff 0%, #fff1f2 40%, #ffe4e6 75%, #fecdd3 100%)',
            }}
        >
            {/* Ambient Red & Rose Glow Shades at the Edges */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#c8102e]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#940b1e]/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

            {/* Center Stage Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                {/* 1. Logo inside clean white circle with elegant breathing room */}
                <div className="relative group">
                    <div className="absolute -inset-2.5 rounded-full bg-rose-500/20 blur-md" />
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-xl ring-4 ring-rose-200/90 border border-rose-100 flex items-center justify-center p-6 sm:p-7">
                        <img 
                            src="/logo.png" 
                            alt="Wishes.com Logo" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </div>

                {/* 2. Brand Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-5">
                    Wishes<span className="text-[#c8102e]">.com</span>
                </h1>

                {/* 3. Subtitle */}
                <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide mt-1">
                    Gifts For Every Moment
                </p>

                {/* 4. Luxury Red Loading Bar with Live Percentage Counter */}
                <div className="w-52 sm:w-60 mt-5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5 px-0.5">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-800/80">Loading</span>
                        <span className="font-mono text-xs sm:text-sm font-black text-[#c8102e] tracking-tight">{progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-rose-100/90 rounded-full overflow-hidden p-0.5 border border-rose-200/90 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-[#940b1e] via-[#c8102e] to-[#e11d48] rounded-full transition-all duration-150 ease-out shadow-xs shadow-red-500/30" 
                            style={{ width: `${Math.min(progress, 100)}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
