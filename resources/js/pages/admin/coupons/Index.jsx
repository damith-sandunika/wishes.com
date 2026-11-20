import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

export default function CouponIndex() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ code: '', discount_percent: '', max_discount: '', valid_until: '' });

    const fetchCoupons = () => {
        setLoading(true);
        axios.get('/api/coupons')
            .then(res => setCoupons(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCoupons(); }, []);

    const destroy = async (id) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await axios.delete(`/api/coupons/${id}`);
            fetchCoupons();
        } catch (err) {
            alert('Cannot delete this coupon.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/coupons', {
                ...form,
                is_active: true
            });
            setShowModal(false);
            setForm({ code: '', discount_percent: '', max_discount: '', valid_until: '' });
            fetchCoupons();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating coupon');
        }
    };

    const inp = "w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 mb-3";

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Coupons</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Manage discount codes for your customers.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="hidden sm:flex relative z-10 bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm transition-all active:scale-95 items-center gap-2 shrink-0">
                    <Plus size={16} strokeWidth={2.5} /> Add Coupon
                </button>
            </div>
            
            {/* Mobile Action */}
            <div className="flex justify-end mb-6 sm:hidden px-1">
                <button onClick={() => setShowModal(true)} className="bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <Plus size={16} strokeWidth={2.5} /> Add Coupon
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Discount</th>
                                <th className="px-6 py-3">Max Discount</th>
                                <th className="px-6 py-3">Valid Until</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading...</td></tr> : 
                            coupons.length === 0 ? <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No coupons found.</td></tr> :
                            coupons.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-normal text-[#1933C6]">{c.code}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-normal">{c.discount_percent}%</td>
                                    <td className="px-6 py-4 font-normal text-slate-700">{c.max_discount ? `Rs.${c.max_discount}` : 'No Limit'}</td>
                                    <td className="px-6 py-4 text-slate-600">{c.valid_until || 'Forever'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => destroy(c.id)} className="px-3 py-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg text-xs font-normal transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="font-normal text-lg mb-4 text-gray-800 border-b pb-3">Create Coupon</h3>
                        <form onSubmit={handleSubmit}>
                            <label className="block text-xs font-normal text-gray-500 uppercase tracking-wider mb-1">Coupon Code</label>
                            <input required value={form.code} onChange={e=>setForm({...form, code: e.target.value.toUpperCase()})} className={inp} placeholder="e.g. SUMMER20" />
                            
                            <label className="block text-xs font-normal text-gray-500 uppercase tracking-wider mb-1 mt-3">Discount Percentage (%)</label>
                            <input required type="number" min="1" max="100" value={form.discount_percent} onChange={e=>setForm({...form, discount_percent: e.target.value})} className={inp} placeholder="e.g. 20" />
                            
                            <label className="block text-xs font-normal text-gray-500 uppercase tracking-wider mb-1 mt-3">Max Discount Amount (Rs) - Optional</label>
                            <input type="number" value={form.max_discount} onChange={e=>setForm({...form, max_discount: e.target.value})} className={inp} placeholder="e.g. 1500" />
                            
                            <label className="block text-xs font-normal text-gray-500 uppercase tracking-wider mb-1 mt-3">Valid Until - Optional</label>
                            <input type="date" value={form.valid_until} onChange={e=>setForm({...form, valid_until: e.target.value})} className={inp} />
                            
                            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 text-gray-600 font-normal hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-[#1933C6] hover:bg-[#090087] text-white font-normal rounded-lg transition-colors shadow-sm">Save Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
