import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { ArrowLeft, Pencil, Star, Package, Gift, Sparkles, Tag, Palette } from 'lucide-react';

export default function ProductView() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        axios.get(`/api/products/${id}`)
            .then(res => {
                const data = res.data.data || res.data;
                setProduct(data);
                if (data.images?.length) setSelectedImg(data.images[0]);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <AdminLayout><div className="p-8 text-center text-gray-400">Loading product...</div></AdminLayout>;
    if (!product) return <AdminLayout><div className="p-8 text-center text-gray-500">Product not found. <Link to="/admin/products" className="text-[#1933C6] font-semibold">Back</Link></div></AdminLayout>;

    const images = Array.isArray(product.images) ? product.images : [];
    const colors = Array.isArray(product.color_variations) ? product.color_variations : [];
    const addons = Array.isArray(product.allowed_addons) ? product.allowed_addons : [];
    const reviews = Array.isArray(product.reviews) ? product.reviews : [];
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1) : null;

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/admin/products" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-[#1933C6] transition shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{product.name}</h2>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.status ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{product.status ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {product.sku || 'N/A'} • Category: {product.category?.name || 'Uncategorized'}</p>
                    </div>
                </div>
                <Link to={`/admin/products/${product.id}/edit`} className="bg-[#1933C6] hover:bg-[#090087] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm transition">
                    <Pencil size={14} /> Edit Product
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
                    <div className="aspect-square rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                        {selectedImg ? <img src={selectedImg.startsWith('http') ? selectedImg : `/storage/${selectedImg}`} alt="" className="w-full h-full object-cover" /> : <Package size={48} className="text-gray-300" />}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {images.map((img, i) => (
                                <button key={i} onClick={() => setSelectedImg(img)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 ${selectedImg === img ? 'border-[#1933C6]' : 'opacity-70'}`}>
                                    <img src={img.startsWith('http') ? img : `/storage/${img}`} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-5">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Pricing & Inventory</span>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-bold text-slate-900">Rs. {Number(product.discount_price || product.selling_price).toLocaleString()}</span>
                            {product.discount_price && product.discount_price !== product.selling_price && (
                                <span className="text-sm text-gray-400 line-through">Rs. {Number(product.selling_price).toLocaleString()}</span>
                            )}
                        </div>
                        <div className="mt-3 flex gap-2 text-xs">
                            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded font-medium text-gray-700">Stock: {product.current_stock ?? 0} {product.unit_type || 'units'}</span>
                            <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded font-medium text-[#1933C6]">{product.brand || 'Wishes Original'}</span>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Description</span>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{product.description || product.short_description || 'No description provided.'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-5">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Customization Features</span>
                        <div className="mt-2 space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                <span className="flex items-center gap-2"><Gift size={15} className="text-emerald-600" /> Gift Wrapping</span>
                                <strong className={product.enable_wrapping ? 'text-emerald-700' : 'text-gray-400'}>{product.enable_wrapping ? 'Allowed' : 'Disabled'}</strong>
                            </div>
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                                <span className="flex items-center gap-2"><Sparkles size={15} className="text-indigo-600" /> Personalization</span>
                                <strong className={product.enable_personalization ? 'text-indigo-700' : 'text-gray-400'}>{product.enable_personalization ? 'Allowed' : 'Disabled'}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><Tag size={13} /> Allowed Addons</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {addons.length > 0 ? addons.map((ad, i) => (
                                <span key={i} className="px-2.5 py-1 bg-blue-50 text-[#1933C6] border border-blue-200 rounded-md text-xs font-medium capitalize">{ad}</span>
                            )) : <span className="text-xs text-gray-400 italic">All addons allowed.</span>}
                        </div>
                    </div>
                    {product.occasions?.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Suitable Occasions</span>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {product.occasions.map((o, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-[#c8102e] border border-rose-200 rounded-md text-[11px] font-medium capitalize">{o}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {colors.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Palette size={16} className="text-[#1933C6]" /> Configured Color Variations ({colors.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {colors.map((c, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm shrink-0" style={{ backgroundColor: c.code || '#ddd' }} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 truncate">{c.name}</span>
                                        <span className="text-xs font-semibold text-emerald-600">{Number(c.extra_price) > 0 ? `+Rs. ${Number(c.extra_price).toLocaleString()}` : 'Free'}</span>
                                    </div>
                                    {c.description && <p className="text-[11px] text-gray-500 truncate">{c.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800">Customer Reviews ({reviews.length})</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Verified purchaser reviews for this product</p>
                    </div>
                    {avgRating && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-600 font-bold text-sm">
                            <Star size={16} fill="currentColor" /> {avgRating} / 5.0
                        </div>
                    )}
                </div>
                {reviews.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 text-sm">No reviews submitted yet for this product.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((r) => (
                            <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-slate-900">{r.author_name}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={13} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                </div>
                                {r.title && <h5 className="text-xs font-semibold text-gray-800 mb-1">{r.title}</h5>}
                                <p className="text-xs text-gray-600 leading-relaxed">{r.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
