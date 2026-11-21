import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Upload, Trash2, CheckCircle2, Image as ImageIcon, Smartphone, Monitor } from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../utils/imageValidation';

const getImgUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `/storage/${img.replace(/^\/?(storage\/)?/, '')}`;
};

export default function Sliders() {
    const [sliders, setSliders] = useState([]);
    const [saving, setSaving] = useState(null);
    const [msg, setMsg] = useState('');

    const fetchSliders = () => {
        axios.get('/api/sliders')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setSliders(list);
            })
            .catch(() => setSliders([]));
    };

    useEffect(() => { fetchSliders(); }, []);

    const sliderList = Array.isArray(sliders) ? sliders : [];

    const handleUpload = async (orderNum, file, mobileFile, link) => {
        setSaving(orderNum);
        setMsg('');
        const existing = sliderList.find(s => Number(s.sort_order) === Number(orderNum));
        const data = new FormData();
        data.append('sort_order', orderNum);
        data.append('is_active', 1);
        if (link) data.append('link', link);
        if (file) data.append('image', file);
        if (mobileFile) data.append('mobile_image', mobileFile);

        try {
            const url = existing ? `/api/sliders/${existing.id}` : '/api/sliders';
            if (existing) data.append('_method', 'PUT');
            await axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMsg(`Slide #${orderNum} updated successfully!`);
            fetchSliders();
        } catch (err) {
            setMsg(err.response?.data?.message || 'Failed to update slide.');
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id, orderNum) => {
        if (!window.confirm(`Delete Slide #${orderNum}?`)) return;
        try {
            await axios.delete(`/api/sliders/${id}`);
            setMsg(`Slide #${orderNum} deleted.`);
            fetchSliders();
        } catch (_) {}
    };

    return (
        <AdminLayout
            pageTitle="Hero Sliders"
            pageSubtitle="Configure up to 4 banner slides with dedicated Desktop & Mobile views."
            headerActions={msg && <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">{msg}</span>}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(orderNum => {
                    const slide = sliderList.find(s => Number(s.sort_order) === Number(orderNum));
                    const deskUrl = getImgUrl(slide?.image);
                    const mobUrl = getImgUrl(slide?.mobile_image);

                    return (
                        <div key={orderNum} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full">Slide #{orderNum}</span>
                                    {slide ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><CheckCircle2 size={13} /> Active</span>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">Not Uploaded</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    {/* Desktop Preview */}
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                            <Monitor size={12} className="text-blue-600" /> Desktop Banner (1920 × 500)
                                        </label>
                                        <div className="relative aspect-[16/7] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                            {deskUrl ? (
                                                <img src={deskUrl} alt="Desktop" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-slate-400">No Desktop Image</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Preview */}
                                    <div className="col-span-1">
                                        <label className="text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                            <Smartphone size={12} className="text-purple-600" /> Mobile (800 × 500)
                                        </label>
                                        <div className="relative aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                            {mobUrl ? (
                                                <img src={mobUrl} alt="Mobile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[9px] text-slate-400 text-center px-1">Auto from Desktop</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Target Link (Optional)</label>
                                    <input 
                                        type="text" 
                                        defaultValue={slide?.link || '/shop'} 
                                        id={`link-${orderNum}`}
                                        placeholder="/shop or /category/flowers"
                                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                {/* Upload Desktop */}
                                <label className="flex-1 cursor-pointer">
                                    <span className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition text-center">
                                        <Upload size={13} /> {saving === orderNum ? 'Saving...' : 'Desktop Photo'}
                                    </span>
                                    <input 
                                        type="file" 
                                        accept={ACCEPT_IMAGE_ATTR}
                                        className="hidden" 
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file || !validateImageFile(file).valid) return;
                                            const link = document.getElementById(`link-${orderNum}`)?.value;
                                            handleUpload(orderNum, file, null, link);
                                        }}
                                    />
                                </label>

                                {/* Upload Mobile */}
                                <label className="flex-1 cursor-pointer">
                                    <span className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition text-center">
                                        <Smartphone size={13} /> Mobile Photo
                                    </span>
                                    <input 
                                        type="file" 
                                        accept={ACCEPT_IMAGE_ATTR}
                                        className="hidden" 
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file || !validateImageFile(file).valid) return;
                                            const link = document.getElementById(`link-${orderNum}`)?.value;
                                            handleUpload(orderNum, null, file, link);
                                        }}
                                    />
                                </label>

                                {slide && (
                                    <button 
                                        onClick={() => handleDelete(slide.id, orderNum)}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                        title="Delete Slide"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
