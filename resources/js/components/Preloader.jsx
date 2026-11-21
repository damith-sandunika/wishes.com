import React, { useState, useEffect } from 'react';

export default function Preloader({ isLoaded }) {
    const [progress, setProgress] = useState(15);
    const [isFading, setIsFading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const step1 = setTimeout(() => setProgress(42), 200);
        const step2 = setTimeout(() => setProgress(72), 550);
        const step3 = setTimeout(() => setProgress(92), 950);

        const safetyTimer = setTimeout(() => {
            setProgress(100);
            setIsFading(true);
            setTimeout(() => setIsMounted(false), 700);
        }, 5000);

        return () => {
            clearTimeout(step1);
            clearTimeout(step2);
            clearTimeout(step3);
            clearTimeout(safetyTimer);
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setProgress(100);
            const fadeTimer = setTimeout(() => setIsFading(true), 350);
            const unmountTimer = setTimeout(() => setIsMounted(false), 1050);
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
                {/* 1. Large Logo inside clean white circle */}
                <div className="relative group">
                    <div className="absolute -inset-2.5 rounded-full bg-rose-500/20 blur-md" />
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-xl ring-4 ring-rose-200/90 border border-rose-100 flex items-center justify-center p-4 sm:p-5">
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

                {/* 4. Loading Bar */}
                <div className="w-48 sm:w-56 h-1.5 bg-rose-100 rounded-full overflow-hidden p-0.5 border border-rose-200 mt-4 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-[#c8102e] via-rose-500 to-[#c8102e] rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${Math.min(progress, 100)}%` }} 
                    />
                </div>
            </div>
        </div>
    );
}
