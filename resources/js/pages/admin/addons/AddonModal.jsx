import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Gift } from 'lucide-react';
import axios from 'axios';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

const EMOJI_PRESETS = ['🎁', '💌', '🧸', '🍫', '📸', '🕯️', '🎈', '🌸', '🧁', '💍', '🎀', '⭐'];

export default function AddonModal({ isOpen, onClose, addon, onSaved }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        name: '', description: '', price: '', is_price_editable: false,
        type: 'addon', icon: '🎁', image: '', is_active: true, sort_order: 0,
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (addon) {
            setForm({
                name: addon.name || '', description: addon.description || '',
                price: addon.price ?? '', is_price_editable: Boolean(addon.is_price_editable),
                type: addon.type || 'addon', icon: addon.icon || '🎁',
                image: addon.image || '', is_active: addon.is_active !== false,
                sort_order: addon.sort_order || 0,
            });
            setPreview(addon.image || '');
        } else {
            setForm({
                name: '', description: '', price: '', is_price_editable: false,
                type: 'addon', icon: '🎁', image: '', is_active: true, sort_order: 0,
            });
            setPreview('');
        }
        setFile(null);
        setError('');
    }, [addon, isOpen]);

    const handleFileChange = (e) => {
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
        if (!form.name.trim()) return setError('Name is required.');
        setLoading(true);
        setError('');

        const fd = new FormData();
        Object.keys(form).forEach(k => {
            if (k === 'is_price_editable' || k === 'is_active') fd.append(k, form[k] ? '1' : '0');
            else if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
        });
        if (file) fd.append('image_file', file);
        if (addon?.id) fd.append('_method', 'PUT');

        try {
            const url = addon?.id ? `/api/addons/${addon.id}` : '/api/addons';
            await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSaved();
            onClose();
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors?.image_file?.[0] || (data?.errors && Object.values(data.errors).flat()[0]) || data?.message || 'Failed to save addon.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 my-8">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {form.type === 'personalization' ? <Sparkles size={16} className="text-purple-600" /> : <Gift size={16} className="text-blue-600" />}
                        {addon ? 'Edit Add-on / Personalization' : 'New Add-on / Personalization'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    {error && <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium">{error}</div>}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Item Name *</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Luxury Gift Box" required className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                                <option value="addon">Gift Add-on (Physical Item)</option>
                                <option value="personalization">Personalization (Card/Name/Photo)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Default Price (LKR)</label>
                            <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                                placeholder="0.00" className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Icon</label>
                            <div className="flex gap-1 items-center">
                                <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                                    className="w-12 text-center text-sm px-2 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" />
                                <div className="flex gap-1 overflow-x-auto py-1 scrollbar-hide">
                                    {EMOJI_PRESETS.slice(0, 5).map(em => (
                                        <button key={em} type="button" onClick={() => setForm({ ...form, icon: em })}
                                            className="text-xs p-1.5 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200">{em}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Editable Setting */}
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={form.is_price_editable}
                                onChange={e => setForm({ ...form, is_price_editable: e.target.checked })}
                                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                            <div>
                                <span className="text-xs font-bold text-slate-800 block">Price is Editable per Product</span>
                                <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                                    {form.is_price_editable 
                                        ? '✓ Admins can customize or override the price for each product in the product edit form.'
                                        : 'Fixed price — this default price will apply whenever added to any product.'}
                                </span>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Description / Note</label>
                        <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Brief description for customer selection..." className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Item Image (Preview on Product Page)</label>
                        <div className="flex items-center gap-3">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50">
                                    <Upload size={18} />
                                </div>
                            )}
                            <div className="flex-1 space-y-1">
                                <input type="file" accept={ACCEPT_IMAGE_ATTR} onChange={handleFileChange}
                                    className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <input type="text" value={form.image} onChange={e => { setForm({ ...form, image: e.target.value }); setPreview(e.target.value); }}
                                    placeholder="Or paste image URL" className="w-full text-[10px] px-2 py-1 rounded border border-slate-200 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                            <span>Active / Available</span>
                        </label>
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs disabled:opacity-50">
                                {loading ? 'Saving...' : (addon ? 'Update Add-on' : 'Create Add-on')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
