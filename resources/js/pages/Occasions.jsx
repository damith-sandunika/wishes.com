import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Gift, Heart, Sparkles, Cake, Calendar, Trophy, Briefcase, Smile } from 'lucide-react';

const ICON_MAP = {
    Cake, Heart, Sparkles, Trophy, Briefcase, Smile, Gift, Calendar,
};

const DEFAULT_OCCASIONS = [
    {
        title: 'Birthday Celebrations',
        description: 'Cakes, chocolates, plush teddies & custom gifts for their special day.',
        icon: 'Cake',
        slug: 'birthday',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    },
    {
        title: 'Anniversaries & Romance',
        description: 'Red roses, luxury hampers & personalized keepsakes to celebrate love.',
        icon: 'Heart',
        slug: 'anniversary',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    },
    {
        title: 'Personalized Keepsakes',
        description: 'Custom engraved acrylic photo frames, custom mugs & custom greeting cards.',
        icon: 'Sparkles',
        slug: 'personalized',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    },
    {
        title: 'Congratulations & Achievements',
        description: 'Celebrate promotions, graduations, and major milestones in style.',
        icon: 'Trophy',
        slug: 'congratulations',
        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
    },
    {
        title: 'Corporate & Client Gifts',
        description: 'Professional premium executive gift boxes for partners and team members.',
        icon: 'Briefcase',
        slug: 'corporate',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    },
    {
        title: 'Get Well & Cheer Up',
        description: 'Fresh fruit hampers, floral cheer and uplifting thoughtful gift baskets.',
        icon: 'Smile',
        slug: 'get-well',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
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
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="bg-gradient-to-r from-red-700 via-rose-600 to-pink-600 text-white py-14 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-block bg-white/20 backdrop-blur-md text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                            Gifts For Every Milestone
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">Shop Gifts by Occasion</h1>
                        <p className="text-rose-100 max-w-xl mx-auto text-sm md:text-base">
                            Whether celebrating birthdays, anniversaries or corporate wins, discover the perfect gift tailored for every occasion.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {occasions.map(occ => {
                            const IconComponent = ICON_MAP[occ.icon] || Gift;
                            return (
                                <Link 
                                    key={occ.slug} 
                                    to={`/shop?occasion=${occ.slug}`}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img 
                                            src={occ.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'} 
                                            alt={occ.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#c8102e] shadow">
                                            <IconComponent size={20} />
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#c8102e] transition-colors mb-2">
                                                {occ.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {occ.description}
                                            </p>
                                        </div>

                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c8102e] mt-4 group-hover:translate-x-1 transition-transform">
                                            Explore Collection &rarr;
                                        </span>
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
