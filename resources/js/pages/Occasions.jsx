import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import {
    Gift, Heart, Sparkles, Cake, Calendar, Trophy, Briefcase,
    Smile, GraduationCap, Baby, Gem, Flower2, Crown, Wine,
    Coffee, Flame, PartyPopper
} from 'lucide-react';

const ICON_MAP = {
    Cake, Heart, Sparkles, Trophy, Briefcase, Smile, Gift, Calendar,
    GraduationCap, Baby, Gem, Flower2, Crown, Wine, Coffee, Flame, PartyPopper,
};

const DEFAULT_OCCASIONS = [
    {
        title: 'Birthday Celebrations',
        description: 'Cakes, chocolates, plush teddies & custom gifts for their special day.',
        icon: 'Cake',
        slug: 'birthday',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Anniversaries & Romance',
        description: 'Red roses, luxury hampers & personalized keepsakes to celebrate love.',
        icon: 'Heart',
        slug: 'anniversary',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Personalized Keepsakes',
        description: 'Custom engraved acrylic photo frames, custom mugs & custom greeting cards.',
        icon: 'Sparkles',
        slug: 'personalized',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Congratulations & Achievements',
        description: 'Celebrate promotions, graduations, and major milestones in style.',
        icon: 'Trophy',
        slug: 'congratulations',
        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Corporate & Client Gifts',
        description: 'Professional premium executive gift boxes for partners and team members.',
        icon: 'Briefcase',
        slug: 'corporate',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Get Well & Cheer Up',
        description: 'Fresh fruit hampers, floral cheer and uplifting thoughtful gift baskets.',
        icon: 'Smile',
        slug: 'get-well',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    },
];

export default function Occasions() {
    const [occasions, setOccasions] = useState(DEFAULT_OCCASIONS);

    useEffect(() => {
        axios.get('/api/public/occasions')
            .then(res => {
                const list = res.data?.data || res.data;
                if (Array.isArray(list) && list.length > 0) setOccasions(list);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                <PageHero
                    title="Shop by Occasion"
                    subtitle="Whether celebrating birthdays, anniversaries or corporate wins, discover the perfect gift tailored for every occasion."
                    badge="Gifts For Every Milestone"
                    breadcrumbs={[
                        { label: 'Home', to: '/' },
                        { label: 'Occasions' }
                    ]}
                />

                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                        {occasions.map(occ => {
                            const IconComponent = ICON_MAP[occ.icon] || Gift;
                            const firstWord = (occ.title || 'Occasion').split(' ')[0];

                            return (
                                <Link
                                    key={occ.slug || occ.id}
                                    to={`/shop?occasion=${occ.slug}`}
                                    className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#ecd9c6]/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
                                >
                                    {/* Top Image Section */}
                                    <div className="relative h-36 sm:h-56 md:h-60 rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-slate-100">
                                        <img
                                            src={occ.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
                                            alt={occ.title}
                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

                                        {/* Top-Right Badge */}
                                        <span className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-white/95 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-200/60 shadow-xs">
                                            Curated
                                        </span>
                                    </div>

                                    {/* Centered Floating White Circle Icon Overlapping Image & Text */}
                                    <div className="relative -mt-6 sm:-mt-8 mx-auto z-20">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg border-2 sm:border-4 border-white ring-1 ring-amber-200/80 flex items-center justify-center text-[#c8102e] group-hover:scale-110 group-hover:bg-[#c8102e] group-hover:text-white transition-all duration-300">
                                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-6" />
                                        </div>
                                    </div>

                                    {/* Bottom Centered Light Content Section */}
                                    <div className="p-3 sm:p-6 pt-2 sm:pt-3 flex-1 flex flex-col justify-between items-center text-center bg-white rounded-b-2xl sm:rounded-b-3xl">
                                        <div className="w-full">
                                            <h3 className="text-sm sm:text-xl md:text-2xl font-bold font-serif text-gray-900 group-hover:text-[#c8102e] transition-colors tracking-tight line-clamp-1 sm:line-clamp-none">
                                                {occ.title}
                                            </h3>
                                            <div className="w-6 sm:w-8 h-0.5 bg-amber-400 mx-auto my-1.5 sm:my-2 rounded-full" />
                                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2 px-1 sm:px-2 mt-0.5 sm:mt-1">
                                                {occ.description}
                                            </p>
                                        </div>

                                        <div className="mt-3 sm:mt-6 pt-2 sm:pt-3 border-t border-gray-100 w-full">
                                            <span className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gray-50 group-hover:bg-[#c8102e] text-gray-700 group-hover:text-white font-semibold text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 border border-gray-200/70 group-hover:border-[#c8102e] shadow-2xs group-hover:shadow-md transition-all duration-300">
                                                <span>Explore {firstWord}</span>
                                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
