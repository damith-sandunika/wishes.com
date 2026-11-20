import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_SLIDES = [
    { id: 1, image: '/images/hero-banner-1.jpg', link: '/shop' },
    { id: 2, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80', link: '/shop' },
    { id: 3, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&q=80', link: '/category/flowers' },
    { id: 4, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80', link: '/category/personalized' },
];

export default function HeroSlider() {
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        axios.get('/api/public/sliders')
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setSlides(res.data.map(s => ({
                        id: s.id,
                        image: s.image.startsWith('http') || s.image.startsWith('/') 
                            ? s.image 
                            : `/storage/${s.image}`,
                        link: s.link || '/shop',
                    })));
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const count = slides.length;
    const prevSlide = () => setCurrent(p => (p - 1 + count) % count);
    const nextSlide = () => setCurrent(p => (p + 1) % count);

    return (
        <section className="w-full relative overflow-hidden bg-gray-950">
            {/* Full-width responsive hero container perfectly balanced for mobile and desktop */}
            <div className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] md:aspect-[2.4/1] lg:h-[480px] xl:h-[540px] min-h-[175px] sm:min-h-[260px] max-h-[580px] overflow-hidden">
                {slides.map((slide, i) => (
                    <div 
                        key={slide.id || i} 
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            current === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                    >
                        <Link to={slide.link} className="block w-full h-full">
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
                        {/* Navigation Arrows on both sides */}
                        <button 
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-11 sm:h-11 bg-white/80 hover:bg-white text-gray-800 hover:text-[#c8102e] rounded-full shadow-md flex items-center justify-center transition-all z-20 hover:scale-105 active:scale-95"
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={16} className="sm:w-6 sm:h-6" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-11 sm:h-11 bg-white/80 hover:bg-white text-gray-800 hover:text-[#c8102e] rounded-full shadow-md flex items-center justify-center transition-all z-20 hover:scale-105 active:scale-95"
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={16} className="sm:w-6 sm:h-6" />
                        </button>

                        {/* 4 Indicator Dots Centered in the middle */}
                        <div className="absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 z-20">
                            {slides.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrent(i)}
                                    className={`transition-all duration-300 rounded-full ${
                                        current === i 
                                            ? 'bg-[#c8102e] w-5 sm:w-8 h-1.5 sm:h-2.5 shadow-md' 
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
