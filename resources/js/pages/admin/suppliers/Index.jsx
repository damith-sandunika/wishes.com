import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupplierIndex() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAll = useCallback(() => {
        setLoading(true);
        axios.get('/api/suppliers')
            .then(res => setSuppliers(res.data.data || res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this supplier?')) return;
        try {
            await axios.delete(`/api/suppliers/${id}`);
            fetchAll();
        } catch (err) {
            alert('Cannot delete this supplier.');
        }
    };

    const filtered = suppliers.filter(s => 
        (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (s.company || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            {/* Page Header matched to Education Center */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Suppliers</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Manage Suppliers</p>
                </div>
                <Link to="/admin/suppliers/create" className="hidden sm:flex relative z-10 bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm transition-all active:scale-95 items-center gap-2 shrink-0">
                    <Plus size={16} strokeWidth={2.5} /> Add Supplier
                </Link>
            </div>
            
            {/* Mobile Action */}
            <div className="flex justify-end mb-6 sm:hidden px-1">
                <Link to="/admin/suppliers/create" className="bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <Plus size={16} strokeWidth={2.5} /> Add Supplier
                </Link>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1933C6] transition-colors">
                            <Search size={16} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search suppliers or company..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1933C6] focus:border-[#1933C6] transition-all shadow-sm"
                        />
                    </div>
                    <div className="text-xs font-normal text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                        Total: <span className="text-[#1933C6]">{filtered.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="text-left px-6 py-3">Supplier</th>
                                <th className="text-left px-6 py-3">Company</th>
                                <th className="text-left px-6 py-3">Contact</th>
                                <th className="text-left px-6 py-3">Products</th>
                                <th className="text-left px-6 py-3">Status</th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}><td colSpan="6" className="px-6 py-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-normal">No suppliers found.</td></tr>
                            ) : filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-normal text-slate-900">{s.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{s.company || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{s.phone}</td>
                                    <td className="px-6 py-4 font-normal text-slate-700">{s.products_count || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal ${s.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.status ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                            {s.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/suppliers/${s.id}/edit`} className="px-3 py-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg text-xs font-normal transition-colors">
                                                Edit
                                            </Link>
                                            <button onClick={() => destroy(s.id)} className="px-3 py-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg text-xs font-normal transition-colors">
                                                Delete
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
