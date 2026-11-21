import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Plus, Search, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupplierIndex() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAll = useCallback(() => {
        setLoading(true);
        axios.get('/api/suppliers')
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setSuppliers(list);
            })
            .catch(() => setSuppliers([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this supplier?')) return;
        try {
            await axios.delete(`/api/suppliers/${id}`);
            fetchAll();
        } catch {
            alert('Cannot delete this supplier.');
        }
    };

    const supList = Array.isArray(suppliers) 
        ? suppliers 
        : (Array.isArray(suppliers?.data) ? suppliers.data : []);

    const filtered = supList.filter(s => 
        (s?.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (s?.company || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout
            pageTitle="Suppliers Directory"
            pageSubtitle="Manage vendor directory and supplier contact profiles"
            headerActions={
                <Link to="/admin/suppliers/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5">
                    <Plus size={16} /> Add Supplier
                </Link>
            }
        >

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search suppliers or company..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 transition shadow-xs"
                        />
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                        Total Suppliers: <span className="text-blue-600 font-bold">{filtered.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">Supplier</th>
                                <th className="px-6 py-3.5 font-semibold">Company</th>
                                <th className="px-6 py-3.5 font-semibold">Contact</th>
                                <th className="px-6 py-3.5 font-semibold">Products</th>
                                <th className="px-6 py-3.5 font-semibold">Status</th>
                                <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-400">Loading suppliers...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-400">No suppliers found.</td></tr>
                            ) : filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" /> {s.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{s.company || '—'}</td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{s.phone}</td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{s.products_count || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.status ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                            {s.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/suppliers/${s.id}/edit`} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold transition">
                                                Edit
                                            </Link>
                                            <button onClick={() => destroy(s.id)} className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition">
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
