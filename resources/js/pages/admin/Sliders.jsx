import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Upload, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function Sliders() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [msg, setMsg] = useState('');

    const fetchSliders = () => {
        setLoading(true);
        axios.get('/api/sliders')
            .then(res => setSliders(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchSliders(); }, []);

    const handleUpload = async (orderNum, file, link) => {
        if (!file && !link) return;
        setSaving(orderNum);
        setMsg('');
        const existing = sliders.find(s => s.sort_order === orderNum);
        const data = new FormData();
        data.append('sort_order', orderNum);
        data.append('is_active', 1);
        if (link) data.append('link', link);
        if (file) data.append('image', file);

        try {
            if (existing) {
                data.append('_method', 'PUT');
                await axios.post(`/api/sliders/${existing.id}`, data);
            } else {
                await axios.post('/api/sliders', data);
            }
            setMsg(`Slide #${orderNum} updated successfully!`);
            fetchSliders();
        } catch (err) {
            setMsg('Failed to update slide. Please try again.');
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

    const slots = [1, 2, 3, 4];

    return (
        <AdminLayout>
            <div className="mb-6 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-normal text-slate-800">Home Page Slider Settings</h2>
                    <p className="text-slate-400 text-xs mt-0.5">Manage up to 4 banner images shown in sequence (1 to 4).</p>
                </div>
                {msg && <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">{msg}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slots.map(orderNum => {
                    const slide = sliders.find(s => s.sort_order === orderNum);
                    const imgUrl = slide?.image ? (slide.image.startsWith('http') ? slide.image : `/storage/${slide.image}`) : null;

                    return (
                        <div key={orderNum} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-full">Slide #{orderNum}</span>
                                    {slide ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><CheckCircle2 size={13} /> Active</span>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">Not Uploaded</span>
                                    )}
                                </div>

                                <div className="relative aspect-[16/8] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center mb-4 group">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={`Slide ${orderNum}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400 p-4">
                                            <ImageIcon size={32} className="mx-auto mb-1 opacity-50" />
                                            <span className="text-xs">No image uploaded</span>
                                        </div>
                                    )}
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
                                <label className="flex-1 cursor-pointer">
                                    <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition">
                                        <Upload size={14} /> {slide ? 'Change Image' : 'Upload Image'}
                                    </span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            const link = document.getElementById(`link-${orderNum}`)?.value;
                                            if (file) handleUpload(orderNum, file, link);
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
