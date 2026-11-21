import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Trash2, Plus, Tag, Zap, Truck } from 'lucide-react';
import CouponModal from './CouponModal';

const initialForm = {
    code: '',
    discount_type: 'percent',
    discount_percent: '',
    discount_amount: '',
    max_discount: '',
    min_spend: '',
    is_flash_sale: false,
    banner_text: '',
    valid_until: '',
};

export default function CouponIndex() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(initialForm);

    const fetchCoupons = useCallback(() => {
        setLoading(true);
        axios.get('/api/coupons')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
                setCoupons(list);
            })
            .catch(() => setCoupons([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const destroy = async (id) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await axios.delete(`/api/coupons/${id}`);
            fetchCoupons();
        } catch {
            alert('Cannot delete this coupon.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post('/api/coupons', { ...form, is_active: true });
            setShowModal(false);
            setForm(initialForm);
            fetchCoupons();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating coupon');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout
            pageTitle="Coupons & Promotional Sales"
            pageSubtitle="Manage discount vouchers, bulk spending thresholds, and flash sale banners"
            headerActions={
                <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5">
                    <Plus size={16} /> Add Coupon / Promotion
                </button>
            }
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">Code</th>
                                <th className="px-6 py-3.5 font-semibold">Type & Value</th>
                                <th className="px-6 py-3.5 font-semibold">Bulk / Min Spend</th>
                                <th className="px-6 py-3.5 font-semibold">Flash Sale</th>
                                <th className="px-6 py-3.5 font-semibold">Expiry</th>
                                <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Loading coupons...</td></tr>
                            ) : coupons.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">No coupons or promotions configured.</td></tr>
                            ) : coupons.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-blue-600 flex items-center gap-2">
                                        <Tag size={14} className="text-blue-500" /> {c.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.discount_type === 'free_delivery' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                                <Truck size={12} /> Free Delivery
                                            </span>
                                        ) : c.discount_type === 'fixed' ? (
                                            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                                                Flat Rs. {Number(c.discount_amount || 0).toLocaleString()} OFF
                                            </span>
                                        ) : (
                                            <span className="text-blue-700 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-md">
                                                {c.discount_percent}% OFF {c.max_discount ? `(Max Rs. ${Number(c.max_discount).toLocaleString()})` : ''}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                        {c.min_spend ? `Min Rs. ${Number(c.min_spend).toLocaleString()}` : <span className="text-slate-400">No Minimum</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.is_flash_sale ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                                <Zap size={11} className="fill-rose-500" /> Active Banner
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{c.valid_until || 'Lifetime'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => destroy(c.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CouponModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSubmit}
                form={form}
                setForm={setForm}
                saving={saving}
            />
        </AdminLayout>
    );
}
