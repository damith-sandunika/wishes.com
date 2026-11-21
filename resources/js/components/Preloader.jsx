import React, { useState, useEffect } from 'react';

export default function Preloader({ isLoaded }) {
    const [progress, setProgress] = useState(20);
    const [isFading, setIsFading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        // Natural progressive loading increment
        const step1 = setTimeout(() => setProgress(45), 200);
        const step2 = setTimeout(() => setProgress(75), 500);
        const step3 = setTimeout(() => setProgress(90), 900);

        // Safety fallback: dismiss after 5s max if any slow network request hangs
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
            const fadeTimer = setTimeout(() => setIsFading(true), 300);
            const unmountTimer = setTimeout(() => setIsMounted(false), 1000);
            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(unmountTimer);
            };
        }
    }, [isLoaded]);

    if (!isMounted) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out select-none ${
                isFading ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
            }`}
        >
            {/* Dynamic Red & White Moving Shading Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#66000c] via-[#a30018] to-[#c8102e] animate-gradient-move" />

            {/* Floating Soft White Silk Light Shading Blobs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/35 blur-3xl animate-float-slow pointer-events-none" />
            <div className="absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-white/25 blur-3xl animate-float-reverse pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-rose-100/30 blur-2xl animate-pulse-glow pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,transparent_70%)] pointer-events-none" />

            {/* Central Luxury Brand Card */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/95 backdrop-blur-md p-3.5 shadow-2xl shadow-black/30 ring-4 ring-white/30 flex items-center justify-center transition-transform duration-500 hover:scale-105">
                    <img 
                        src="/logo.png" 
                        alt="Wishes.com Logo" 
                        className="w-full h-full object-contain drop-shadow-sm" 
                    />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md mt-4">
                    Wishes.com
                </h1>
                <p className="text-[11px] sm:text-xs text-rose-100/90 font-semibold tracking-widest uppercase mt-1">
                    Curating Thoughtful Surprises
                </p>

                {/* Aesthetic Loading Button */}
                <div className="mt-6 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-semibold text-xs shadow-lg shadow-black/10">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{progress >= 100 ? 'Welcome!' : 'Preparing Your Gift Experience...'}</span>
                    </div>

                    {/* Shimmering Progress Bar */}
                    <div className="w-48 sm:w-56 h-1.5 bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/25 mt-3 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-amber-200 via-white to-amber-300 rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${Math.min(progress, 100)}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
