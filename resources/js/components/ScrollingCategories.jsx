import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ScrollingCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/api/public/categories')
            .then(res => {
                const fetched = res.data.map((cat) => ({
                    ...cat,
                    bgColor: 'bg-white',
                    image: cat.image ? `/storage/${cat.image}` : 'https://images.unsplash.com/photo-1599598425947-33001c40a5bc?auto=format&fit=crop&w=150&q=80'
                }));
                // Duplicate categories to make a longer scrolling list if needed for demo
                const extended = [...fetched, ...fetched, ...fetched].slice(0, 10);
                setCategories(extended);
            })
            .catch(err => console.error("Error loading categories", err));
    }, []);

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-brand-dark">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/images/sliders/desktop slider (3).png" alt="Background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10 mb-8 md:mb-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-2">Explore Collections</h3>
                        <p className="text-green-100/80 text-sm md:text-base max-w-md">Discover our wide variety of farm-fresh products sorted just for you.</p>
                    </div>
                </div>
            </div>

            {/* Horizontal Scrolling Area */}
            <div className="relative z-10 w-full overflow-hidden">
                <div className="flex gap-4 md:gap-6 px-4 md:px-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map((category, idx) => (
                        <Link 
                            key={`${category.id}-${idx}`} 
                            to={`/category/${category.id}`} 
                            className="group flex flex-col items-center flex-shrink-0 snap-center w-[120px] md:w-[150px]"
                        >
                            <div className={`w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 mb-4 shadow-xl group-hover:bg-white group-hover:scale-105 group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden mx-auto`}>
                                <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                            <span className="text-[13px] md:text-[15px] font-medium text-white text-center leading-tight group-hover:text-green-300 transition-colors drop-shadow-md">{category.name}</span>
                        </Link>
                    ))}
                    
                    {/* View All Button inside the scroll */}
                    <Link 
                        to="/categories" 
                        className="group flex flex-col items-center justify-center flex-shrink-0 snap-center w-[120px] md:w-[150px] cursor-pointer"
                    >
                        <div className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-md flex items-center justify-center p-4 mb-4 group-hover:bg-brand-green group-hover:border-brand-green transition-all duration-300 mx-auto">
                            <span className="text-white text-2xl md:text-3xl font-light group-hover:scale-125 transition-transform">&rarr;</span>
                        </div>
                        <span className="text-[13px] md:text-[15px] font-medium text-white text-center leading-tight group-hover:text-green-300 transition-colors drop-shadow-md">View All</span>
                    </Link>
                </div>
            </div>
            
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default ScrollingCategories;
