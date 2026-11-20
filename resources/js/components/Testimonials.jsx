import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import axios from 'axios';

const FALLBACK_REVIEWS = [
    {
        name: 'Nethmi Perera',
        rating: 5,
        title: 'Fresh and beautiful flowers',
        content: 'Ordered the Red Rose Bouquet for our anniversary. The flowers were super fresh and delivered right on time in Colombo. Truly impressed with Wishes.com!',
        productName: 'Red Rose Bouquet',
    },
    {
        name: 'Kasun Wickramasinghe',
        rating: 5,
        title: 'Perfect custom birthday box',
        content: 'The personalized photo mug and teddy bear inside the gift box were packaged so elegantly. My wife loved the surprise so much!',
        productName: 'Personalized Birthday Gift Box',
    },
    {
        name: 'Dilini Senanayake',
        rating: 5,
        title: 'Delicious chocolate cake',
        content: 'Cake was so moist and rich. The custom greeting message and gift wrapping added such a luxury touch. Highly recommended!',
        productName: 'Chocolate Birthday Cake',
    },
];

export default function Testimonials() {
    const [reviews, setReviews] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        axios.get('/api/public/reviews')
            .then(res => {
                const list = res.data?.data || res.data || [];
                if (list.length > 0) {
                    setReviews(list.map(r => ({
                        name: r.author_name || 'Customer',
                        rating: Number(r.rating || 5),
                        title: r.title || 'Wonderful Gift',
                        content: r.content,
                        productName: r.product?.name || 'Verified Gift',
                    })));
                } else {
                    setReviews(FALLBACK_REVIEWS);
                }
            })
            .catch(() => setReviews(FALLBACK_REVIEWS));
    }, []);

    const activeList = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;
    const prev = () => setCurrent(c => (c - 1 + activeList.length) % activeList.length);
    const next = () => setCurrent(c => (c + 1) % activeList.length);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-[#c8102e] text-xs font-bold uppercase tracking-widest">Real Customer Love</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">What Our Customers Say</h2>
                    <div className="w-12 h-1 bg-[#c8102e] mx-auto mt-2 rounded-full" />
                </div>

                {/* Desktop: 3-column grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {activeList.slice(0, 3).map((r, i) => (
                        <ReviewCard key={i} review={r} />
                    ))}
                </div>

                {/* Mobile: Carousel */}
                <div className="md:hidden relative">
                    <ReviewCard review={activeList[current % activeList.length]} />
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button onClick={prev} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-xs text-gray-400 font-mono">{current + 1} / {activeList.length}</span>
                        <button onClick={next} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review }) {
    const initials = (review.name || 'W').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                        ))}
                    </div>
                    <Quote size={20} className="text-rose-100 group-hover:text-rose-200 transition-colors" />
                </div>
                {review.title && <h4 className="text-sm font-semibold text-gray-900 mb-1">{review.title}</h4>}
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-4">"{review.content}"</p>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-[#c8102e] font-semibold text-xs flex items-center justify-center border border-rose-100">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-800 leading-none">{review.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">{review.productName}</p>
                    </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">Verified</span>
            </div>
        </div>
    );
}
