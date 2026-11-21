import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search, Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductIndex() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAll = useCallback(() => {
        setLoading(true);
        axios.get('/api/products')
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setProducts(list);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`/api/products/${id}`);
            fetchAll();
        } catch (_) {
            alert('Cannot delete this product.');
        }
    };

    const prodList = Array.isArray(products) 
        ? products 
        : (Array.isArray(products?.data) ? products.data : []);

    const filtered = prodList.filter(p => 
        (p?.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (p?.sku || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout
            pageTitle="Products Management"
            pageSubtitle="Maintain gift catalog items, customize variations, and configure prices."
            headerActions={
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search name or SKU..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-blue-500 shadow-2xs"
                        />
                    </div>
                    <Link
                        to="/admin/products/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 shrink-0"
                    >
                        <Plus size={15} strokeWidth={2.5} />
                        <span>Add Product</span>
                    </Link>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-500">
                        Total Catalog Items: <strong className="text-slate-800">{filtered.length}</strong>
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-5 py-3.5">Product & SKU</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5">Selling Price</th>
                                <th className="px-5 py-3.5">Current Stock</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading products...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">No products found.</td></tr>
                            ) : filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {p.images && p.images.length > 0 ? (
                                                <img src={p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                                    <Package size={18} />
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-bold text-slate-900 block">{p.name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{p.sku || 'No SKU'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-slate-700">{p.category?.name || '—'}</td>
                                    <td className="px-5 py-4">
                                        <span className="font-bold text-slate-900 block">LKR {Number(p.discount_price || p.selling_price).toLocaleString()}</span>
                                        {p.discount_price && p.discount_price < p.selling_price && (
                                            <span className="text-[10px] text-slate-400 line-through">LKR {Number(p.selling_price).toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                                            p.current_stock <= 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {p.current_stock ?? 0} {p.unit_type || 'units'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <AdminStatusBadge status={p.status ? 'Active' : 'Inactive'} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link to={`/admin/products/${p.id}`} className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Eye size={13} /> View
                                            </Link>
                                            <Link to={`/admin/products/${p.id}/edit`} className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Pencil size={13} /> Edit
                                            </Link>
                                            <button onClick={() => destroy(p.id)} className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
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
