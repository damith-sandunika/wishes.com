import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search, FolderTree } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryIndex() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAll = useCallback(() => {
        setLoading(true);
        axios.get('/api/categories')
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setCategories(list);
            })
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await axios.delete(`/api/categories/${id}`);
            fetchAll();
        } catch (_) {
            alert('Cannot delete this category.');
        }
    };

    const catList = Array.isArray(categories) 
        ? categories 
        : (Array.isArray(categories?.data) ? categories.data : []);

    const filtered = catList.filter(c => 
        (c?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c?.slug || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout
            pageTitle="Categories Management"
            pageSubtitle="Organize gift collections, flowers, cakes, hampers, and accessories."
            headerActions={
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-blue-500 shadow-2xs"
                        />
                    </div>
                    <Link
                        to="/admin/categories/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 shrink-0"
                    >
                        <Plus size={15} strokeWidth={2.5} />
                        <span>Add Category</span>
                    </Link>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-5 py-3.5">Category Name</th>
                                <th className="px-5 py-3.5">Slug</th>
                                <th className="px-5 py-3.5">Description</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading categories...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400 font-semibold">No categories found.</td></tr>
                            ) : filtered.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {c.image ? (
                                                <img src={c.image.startsWith('http') ? c.image : `/storage/${c.image}`} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                                    <FolderTree size={16} />
                                                </div>
                                            )}
                                            <span className="font-bold text-slate-900">{c.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-mono text-slate-500">{c.slug}</td>
                                    <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{c.description || '—'}</td>
                                    <td className="px-5 py-4">
                                        <AdminStatusBadge status={c.status ? 'Active' : 'Inactive'} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link to={`/admin/categories/${c.id}/edit`} className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Pencil size={13} /> Edit
                                            </Link>
                                            <button onClick={() => destroy(c.id)} className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
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
