import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { ArrowLeft, Pencil, Package, Gift, Sparkles, Tag, Palette } from 'lucide-react';

const getImgUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const clean = img.replace(/^\/?(storage\/)?/, '');
    return `/storage/${clean}`;
};

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

    if (loading) {
        return (
            <AdminLayout pageTitle="Product Details" pageSubtitle="Loading...">
                <div className="p-12 text-center text-slate-400 font-semibold text-xs">Loading item specifics...</div>
            </AdminLayout>
        );
    }

    if (!product) {
        return (
            <AdminLayout pageTitle="Product Not Found">
                <div className="p-12 text-center text-slate-500 font-semibold text-xs">
                    Product not found. <Link to="/admin/products" className="text-blue-600 font-bold hover:underline">Return to catalog</Link>
                </div>
            </AdminLayout>
        );
    }

    const images = Array.isArray(product.images) ? product.images : [];
    const colors = Array.isArray(product.color_variations) ? product.color_variations : [];
    const addons = Array.isArray(product.allowed_addons) ? product.allowed_addons : [];

    return (
        <AdminLayout
            pageTitle={product.name}
            pageSubtitle={`SKU: ${product.sku || 'None'} • Category: ${product.category?.name || 'Uncategorized'}`}
            headerActions={
                <div className="flex items-center gap-2">
                    <Link to="/admin/products" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs">
                        <ArrowLeft size={14} /> Catalog
                    </Link>
                    <Link to={`/admin/products/${product.id}/edit`} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm shadow-blue-500/20">
                        <Pencil size={13} /> Edit Item
                    </Link>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Images Gallery Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {selectedImg ? (
                            <img src={getImgUrl(selectedImg)} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Package size={48} className="text-slate-300" />
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {images.map((img, i) => (
                                <button key={i} onClick={() => setSelectedImg(img)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${selectedImg === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70'}`}>
                                    <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pricing & Stock Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Financials & Inventory</span>
                        <div className="flex items-baseline gap-3 mt-1.5">
                            <span className="text-2xl font-black text-slate-900">LKR {Number(product.discount_price || product.selling_price).toLocaleString()}</span>
                            {product.discount_price && product.discount_price < product.selling_price && (
                                <span className="text-sm text-slate-400 line-through">LKR {Number(product.selling_price).toLocaleString()}</span>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">Stock: {product.current_stock ?? 0} {product.unit_type || 'units'}</span>
                            <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg font-bold text-blue-700">{product.brand || 'Wishes Brand'}</span>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{product.description || product.short_description || 'No description provided.'}</p>
                    </div>
                </div>

                {/* Gift Features & Options */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gift Service Options</span>
                    <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/75 border border-slate-100">
                            <span className="flex items-center gap-2 font-semibold text-slate-700"><Gift size={15} className="text-emerald-600" /> Gift Wrapping</span>
                            <strong className={product.enable_wrapping ? 'text-emerald-700' : 'text-slate-400'}>{product.enable_wrapping ? 'Enabled' : 'Disabled'}</strong>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/75 border border-slate-100">
                            <span className="flex items-center gap-2 font-semibold text-slate-700"><Sparkles size={15} className="text-blue-600" /> Personalization</span>
                            <strong className={product.enable_personalization ? 'text-blue-700' : 'text-slate-400'}>{product.enable_personalization ? 'Enabled' : 'Disabled'}</strong>
                        </div>
                    </div>

                    {colors.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Color Variations</span>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{typeof c === 'string' ? c : c.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {addons.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Attached Add-ons</span>
                            <div className="flex flex-wrap gap-1.5">
                                {addons.map((a, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                        {typeof a === 'object' ? `${a.icon || '🎁'} ${a.name} (Rs. ${Number(a.price).toLocaleString()})` : a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
