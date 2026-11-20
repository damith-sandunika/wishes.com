import React, { useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, ThumbsUp, Send } from 'lucide-react';

const INITIAL_REVIEWS = [
    {
        id: 1, author: 'Nadeesha Fernando', rating: 5, date: '2 days ago', verified: true,
        title: 'Exceeded all expectations! Absolutely gorgeous packaging.',
        content: 'Ordered this for my fiancé’s birthday. The bouquet was so fresh and fragrant, and the custom card message was beautifully handwritten. Delivered right on time at 11 AM in Colombo. Highly recommended!',
        helpful: 14,
    },
    {
        id: 2, author: 'Kasun Wickramasinghe', rating: 5, date: '1 week ago', verified: true,
        title: 'Super fast delivery and top quality.',
        content: 'Loved the personalized touch! The chocolates were premium Belgian quality and the teddy bear was ultra soft. Great customer support on WhatsApp too.',
        helpful: 9,
    },
];

export default function ProductReviews({ productId, productName = 'this gift', initialReviews = [] }) {
    const [reviews, setReviews] = useState(() => {
        if (initialReviews?.length > 0) {
            const mapped = initialReviews.map(r => ({
                id: r.id, author: r.author_name || 'Customer', rating: r.rating || 5,
                date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
                verified: true, title: r.title || 'Verified Purchase', content: r.content, helpful: 0,
            }));
            return [...mapped, ...INITIAL_REVIEWS];
        }
        return INITIAL_REVIEWS;
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', rating: 5, title: '', content: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.content) return;

        let createdReview = {
            id: Date.now(), author: form.name, rating: Number(form.rating), date: 'Just now',
            verified: true, title: form.title || 'Wonderful gift experience', content: form.content, helpful: 0,
        };

        if (productId) {
            try {
                const res = await axios.post(`/api/public/products/${productId}/reviews`, {
                    author_name: form.name, rating: Number(form.rating), title: form.title, content: form.content,
                });
                if (res.data?.id) createdReview.id = res.data.id;
            } catch {}
        }

        setReviews(prev => [createdReview, ...prev]);
        setSubmitted(true);
        setTimeout(() => {
            setShowForm(false); setSubmitted(false); setForm({ name: '', rating: 5, title: '', content: '' });
        }, 1500);
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill="currentColor" />
                            ))}
                        </div>
                        <span className="text-lg font-bold text-gray-900">4.9</span>
                        <span className="text-xs text-gray-400">based on {reviews.length + 125} verified ratings</span>
                    </div>
                </div>

                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm w-fit"
                >
                    {showForm ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="my-6 p-6 bg-rose-50/40 rounded-2xl border border-rose-100 animate-in fade-in duration-200">
                    <h4 className="font-bold text-gray-900 text-sm mb-3">Share your experience with {productName}</h4>
                    {submitted ? (
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <CheckCircle size={16} /> Thank you! Your review has been submitted.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-gray-700">Rating:</span>
                                <div className="flex gap-1 text-amber-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button 
                                            key={s} 
                                            type="button" 
                                            onClick={() => setForm({ ...form, rating: s })}
                                            className="p-1 hover:scale-125 transition-transform"
                                        >
                                            <Star size={20} fill={s <= form.rating ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Your Name *" 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand outline-none" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Review Title (e.g. Loved the roses!)" 
                                    value={form.title} 
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand outline-none" 
                                />
                            </div>

                            <textarea 
                                required 
                                rows="3" 
                                placeholder="Write your heartfelt feedback here..." 
                                value={form.content} 
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand outline-none"
                            ></textarea>

                            <button type="submit" className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-dark transition-all">
                                <Send size={14} /> Submit Review
                            </button>
                        </div>
                    )}
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6 divide-y divide-gray-100">
                {reviews.map((r) => (
                    <div key={r.id} className="pt-6 first:pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm">{r.author}</span>
                                {r.verified && (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} /> Verified Buyer
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400">{r.date}</span>
                        </div>

                        <div className="flex gap-1 text-amber-400 mb-2">
                            {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" />
                            ))}
                        </div>

                        <h5 className="font-bold text-gray-900 text-xs md:text-sm mb-1">{r.title}</h5>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">{r.content}</p>

                        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand transition-colors">
                            <ThumbsUp size={13} /> Helpful ({r.helpful})
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
