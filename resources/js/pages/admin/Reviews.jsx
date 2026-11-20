import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Star, Search, Trash2, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    const fetchReviews = useCallback(() => {
        setLoading(true);
        axios.get('/api/reviews', { params: { search, rating: ratingFilter } })
            .then(res => setReviews(res.data.data || res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [search, ratingFilter]);

    useEffect(() => {
        const timer = setTimeout(fetchReviews, 300);
        return () => clearTimeout(timer);
    }, [fetchReviews]);

    const toggleApprove = async (id) => {
        try {
            await axios.patch(`/api/reviews/${id}/toggle-approve`);
            fetchReviews();
        } catch {
            alert('Failed to update status');
        }
    };

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this review?')) return;
        try {
            await axios.delete(`/api/reviews/${id}`);
            fetchReviews();
        } catch {
            alert('Failed to delete review');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Customer Reviews</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Moderate & Inspect Reviews</p>
                </div>
                <div className="relative z-10 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    Total: <span className="text-[#1933C6] font-bold">{reviews.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={16} className="absolute inset-y-0 left-3 my-auto text-gray-400 group-focus-within:text-[#1933C6]" />
                        <input
                            type="text"
                            placeholder="Search by customer, product, keyword..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1933C6] shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs text-gray-500">Filter Stars:</label>
                        <select
                            value={ratingFilter}
                            onChange={e => setRatingFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#1933C6]"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="text-left px-6 py-3">Product</th>
                                <th className="text-left px-6 py-3">Reviewer</th>
                                <th className="text-left px-6 py-3">Rating</th>
                                <th className="text-left px-6 py-3">Feedback</th>
                                <th className="text-left px-6 py-3">Status</th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}><td colSpan="6" className="px-6 py-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>
                                ))
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400">
                                        <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                                        No customer reviews found.
                                    </td>
                                </tr>
                            ) : reviews.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {r.product?.images?.[0] ? (
                                                <img src={`/storage/${r.product.images[0]}`} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1933C6] flex items-center justify-center text-xs font-bold">W</div>
                                            )}
                                            <div>
                                                <span className="font-medium text-slate-900 block truncate max-w-[160px]">{r.product?.name || 'Deleted Product'}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">{r.product?.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-800 block">{r.author_name}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-amber-400 items-center">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={13} className={idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                            ))}
                                            <span className="ml-1.5 text-xs text-gray-700 font-semibold">{r.rating}.0</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        {r.title && <p className="font-medium text-xs text-gray-900 mb-0.5">{r.title}</p>}
                                        <p className="text-xs text-gray-600 line-clamp-2">{r.content}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleApprove(r.id)}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                                                r.is_approved ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                            }`}
                                        >
                                            {r.is_approved ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {r.is_approved ? 'Approved' : 'Pending'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => destroy(r.id)}
                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
