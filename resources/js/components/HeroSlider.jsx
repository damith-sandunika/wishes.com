import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HeroSlider({ onLoaded }) {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/public/sliders')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const validSlides = list
                    .filter(s => s && s.image)
                    .map(s => {
                        const img = String(s.image).trim();
                        const formatted = (img.startsWith('http://') || img.startsWith('https://'))
                            ? img 
                            : `/storage/${img.replace(/^\/?(storage\/)?/, '')}`;
                        return {
                            id: s.id,
                            image: formatted,
                            link: s.link || '/shop',
                        };
                    });
                setSlides(validSlides);
            })
            .catch(() => setSlides([]))
            .finally(() => {
                setLoading(false);
                onLoaded?.();
            });
    }, [onLoaded]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const count = slides.length;
    const prevSlide = () => setCurrent(p => (p - 1 + count) % count);
    const nextSlide = () => setCurrent(p => (p + 1) % count);

    if (loading) {
        return (
            <div className="w-full bg-slate-900 aspect-[2.5/1] sm:aspect-[2.2/1] md:aspect-[2.3/1] lg:h-[460px] xl:h-[500px] animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <section className="w-full bg-linear-to-r from-rose-900 via-rose-800 to-slate-900 text-white py-8 sm:py-14 md:py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 rounded-full text-[11px] sm:text-xs font-semibold text-rose-200 mb-2 sm:mb-4 backdrop-blur-xs">
                        <Gift size={13} /> Curated Gifts &amp; Surprises
                    </span>
                    <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-4">
                        Handcrafted Fresh Gifts &amp; Deliveries
                    </h1>
                    <p className="text-xs sm:text-base text-rose-100 max-w-xl mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-none">
                        Celebrate birthdays, anniversaries, and special moments with fresh flowers, customized cakes, and luxury hampers.
                    </p>
                    <Link
                        to="/shop"
                        className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-white text-rose-900 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl hover:bg-rose-50 shadow-md shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Explore Collections &rarr;
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full relative overflow-hidden bg-[#0c0406]">
            <div className="relative w-full aspect-[2.5/1] sm:aspect-[2.2/1] md:aspect-[2.3/1] lg:h-[460px] xl:h-[500px] min-h-[140px] sm:min-h-[240px] max-h-[560px] overflow-hidden">
                {slides.map((slide, i) => (
                    <div 
                        key={slide.id || i} 
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            current === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                    >
                        {/* Ambient Color Blur for Edge-to-Edge Fill on Ultra-Wide Monitors */}
                        <div 
                            className="absolute inset-0 hidden sm:block bg-cover bg-center blur-2xl opacity-45 scale-110 pointer-events-none"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />

                        {/* Centered Main Image with Full Width Coverage */}
                        <Link to={slide.link} className="relative z-10 block w-full h-full">
                            <img 
                                src={slide.image} 
                                alt={`Hero Banner ${i + 1}`} 
                                className="w-full h-full object-cover object-center" 
                            />
                        </Link>
                    </div>
                ))}

                {count > 1 && (
                    <>
                        <button 
                            onClick={prevSlide}
                            className="absolute left-1.5 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-white/85 hover:bg-white text-gray-800 hover:text-[#c8102e] rounded-full shadow-md flex items-center justify-center transition-all z-20 hover:scale-105 active:scale-95"
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={15} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-1.5 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-white/85 hover:bg-white text-gray-800 hover:text-[#c8102e] rounded-full shadow-md flex items-center justify-center transition-all z-20 hover:scale-105 active:scale-95"
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={15} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </button>

                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 z-20">
                            {slides.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrent(i)}
                                    className={`transition-all duration-300 rounded-full ${
                                        current === i 
                                            ? 'bg-[#c8102e] w-4 sm:w-8 h-1.5 sm:h-2.5 shadow-md' 
                                            : 'bg-white/80 hover:bg-white w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 shadow-xs'
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
