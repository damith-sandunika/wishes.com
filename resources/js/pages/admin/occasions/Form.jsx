import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import {
    Save, Upload, Cake, Heart, Sparkles, Trophy,
    Briefcase, Smile, Gift, Calendar, GraduationCap, Baby,
    Gem, Flower2, Crown, Wine, Coffee, Flame, PartyPopper
} from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

const ICON_LIST = [
    { name: 'Cake', icon: Cake, label: 'Birthday' },
    { name: 'Heart', icon: Heart, label: 'Romance' },
    { name: 'Sparkles', icon: Sparkles, label: 'Celebration' },
    { name: 'Trophy', icon: Trophy, label: 'Achievement' },
    { name: 'Briefcase', icon: Briefcase, label: 'Corporate' },
    { name: 'Smile', icon: Smile, label: 'Get Well' },
    { name: 'Gift', icon: Gift, label: 'Surprise' },
    { name: 'Calendar', icon: Calendar, label: 'Anniversary' },
    { name: 'GraduationCap', icon: GraduationCap, label: 'Graduation' },
    { name: 'Baby', icon: Baby, label: 'New Baby' },
    { name: 'Gem', icon: Gem, label: 'Wedding' },
    { name: 'Flower2', icon: Flower2, label: 'Mothers Day' },
    { name: 'Crown', icon: Crown, label: 'Luxury' },
    { name: 'Wine', icon: Wine, label: 'Cheers' },
    { name: 'Coffee', icon: Coffee, label: 'Appreciation' },
    { name: 'Flame', icon: Flame, label: 'Passion' },
    { name: 'PartyPopper', icon: PartyPopper, label: 'Festival' },
];

export default function OccasionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: '', slug: '', description: '', icon: 'Cake',
        image: '', is_active: true, sort_order: 0,
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            axios.get(`/api/occasions/${id}`).then(res => {
                const d = res.data;
                setForm({
                    title: d.title || '', slug: d.slug || '',
                    description: d.description || '', icon: d.icon || 'Cake',
                    image: d.image || '', is_active: d.is_active !== false,
                    sort_order: d.sort_order || 0,
                });
                setPreview(d.image || '');
            }).catch(() => setError('Occasion not found.'));
        }
    }, [id, isEdit]);

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const check = validateImageFile(f);
        if (!check.valid) {
            e.target.value = '';
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const fd = new FormData();
        Object.keys(form).forEach(k => {
            if (k === 'is_active') fd.append(k, form[k] ? '1' : '0');
            else if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
        });
        if (file) fd.append('image_file', file);
        if (isEdit) fd.append('_method', 'PUT');

        try {
            const url = isEdit ? `/api/occasions/${id}` : '/api/occasions';
            await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/admin/occasions');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors?.image_file?.[0] || (data?.errors && Object.values(data.errors).flat()[0]) || data?.message || 'Error saving occasion.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout
            pageTitle={isEdit ? `Edit: ${form.title}` : 'Add New Special Day'}
            pageSubtitle="Configure special day celebration theme, background photography, and event icon."
        >
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">{error}</div>}

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Special Day Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Special Day Title *</label>
                            <input type="text" required value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })}
                                placeholder="e.g. Birthday Celebrations" className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">URL Slug</label>
                            <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                                placeholder="e.g. birthday" className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Description / Tagline</label>
                        <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Cakes, chocolates, teddy bears & personalized gifts for their special day..." className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-slate-50/50" />
                    </div>
                </div>

                {/* Event Icon Picker */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-900 text-sm">Select Event Icon</h3>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Selected: {form.icon}</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                        {ICON_LIST.map(({ name, icon: IconComp, label }) => {
                            const isSelected = form.icon === name;
                            return (
                                <button key={name} type="button" onClick={() => setForm({ ...form, icon: name })}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                                        isSelected ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-2 ring-blue-100' : 'bg-slate-50/60 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                                    }`}>
                                    <IconComp size={22} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />
                                    <span className="text-[10px] font-bold truncate w-full">{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Background Image Selection */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Atmospheric Background Image</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-40 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-slate-400 p-2"><Upload size={24} className="mx-auto mb-1" /><span className="text-[10px]">No Image</span></div>
                            )}
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 uppercase block">Upload Photo</label>
                            <input type="file" accept={ACCEPT_IMAGE_ATTR} onChange={handleFile}
                                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold" />
                            <input type="text" value={form.image} onChange={e => { setForm({ ...form, image: e.target.value }); setPreview(e.target.value); }}
                                placeholder="Or enter direct photo URL..." className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none bg-slate-50/50" />
                        </div>
                    </div>
                </div>

                {/* Status & Submit */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                        <span>Active / Show in Storefront</span>
                    </label>
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">
                        <Save size={15} /> {saving ? 'Saving...' : (isEdit ? 'Update Special Day' : 'Create Special Day')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
