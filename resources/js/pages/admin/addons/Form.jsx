import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import { Save, Image as ImageIcon } from 'lucide-react';
import AddonConfigSection from './AddonConfigSection';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

const EMOJI_PRESETS = ['🎁', '💌', '🧸', '🍫', '🌸', '💍'];

export default function AddonForm({ defaultType = 'addon' }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const isPersonalization = defaultType === 'personalization';
    const backRoute = isPersonalization ? '/admin/personalizations' : '/admin/addons';
    const typeLabel = isPersonalization ? 'Customized Item' : 'Gift Add-on';

    const [form, setForm] = useState({
        name: '', description: '', price: '', is_price_editable: false,
        type: defaultType, icon: isPersonalization ? '✨' : '🎁',
        is_active: true, sort_order: 0,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [options, setOptions] = useState([]);
    const [optionFiles, setOptionFiles] = useState({});
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        setLoading(true);
        axios.get(`/api/addons/${id}`)
            .then(res => {
                const a = res.data;
                setForm({
                    name: a.name || '', description: a.description || '',
                    price: a.price ?? '', is_price_editable: Boolean(a.is_price_editable),
                    type: a.type || defaultType, icon: a.icon || (isPersonalization ? '✨' : '🎁'),
                    is_active: a.is_active !== false, sort_order: a.sort_order || 0,
                });
                setImagePreview(a.image || '');
                setOptions(Array.isArray(a.options) ? a.options : []);
                setFields(Array.isArray(a.custom_fields) ? a.custom_fields : []);
            })
            .catch(() => setError('Failed to load item details.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            Object.keys(form).forEach(k => {
                if (k === 'is_price_editable' || k === 'is_active') fd.append(k, form[k] ? '1' : '0');
                else if (form[k] !== null && form[k] !== undefined) fd.append(k, form[k]);
            });
            if (imageFile) fd.append('image_file', imageFile);
            if (isPersonalization) {
                fd.append('options', JSON.stringify(options));
                fd.append('custom_fields', JSON.stringify(fields));
                Object.keys(optionFiles).forEach(i => { if (optionFiles[i]) fd.append(`option_image_${i}`, optionFiles[i]); });
            }
            if (isEdit) fd.append('_method', 'PUT');
            await axios.post(isEdit ? `/api/addons/${id}` : '/api/addons', fd);
            navigate(backRoute);
        } catch (err) {
            const data = err.response?.data;
            setError(data?.errors?.image_file?.[0] || (data?.errors && Object.values(data.errors).flat()[0]) || data?.message || 'Failed to save item.');
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-blue-600 transition-all shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout pageTitle={isEdit ? `Edit ${typeLabel}` : `New ${typeLabel}`} pageSubtitle={`Configure item pricing, photo, and details for ${typeLabel.toLowerCase()}s.`}>
            <div className="w-full pb-12">
                {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">{error}</div>}
                {loading ? (
                    <div className="h-64 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading...</div>
                ) : (
                    <form onSubmit={save} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Item Name <span className="text-red-500">*</span></label>
                                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder={isPersonalization ? "e.g. Greeting Card" : "e.g. Ferrero Rocher Box"} className={inp} />
                            </div>
                            <div>
                                <label className={label}>Price (LKR) <span className="text-red-500">*</span></label>
                                <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 1250" className={inp} />
                            </div>
                        </div>

                        {!isPersonalization && (
                            <div>
                                <label className={label}>Add-on Photo</label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50/60 rounded-xl border border-slate-200">
                                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                                        {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-400" />}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition shadow-2xs">
                                            {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                            <input type="file" accept={ACCEPT_IMAGE_ATTR} className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f && validateImageFile(f).valid) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                                                }} />
                                        </label>
                                        <p className="text-[10px] text-slate-400">Square JPG, PNG or WebP image.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={label}>Icon Emoji</label>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-12 text-center text-lg py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" />
                                    <div className="flex flex-wrap gap-1 flex-1">
                                        {EMOJI_PRESETS.map(em => (
                                            <button key={em} type="button" onClick={() => setForm({ ...form, icon: em })} className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-sm">{em}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={label}>Sort Order</label>
                                <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className={inp} />
                            </div>
                            <div>
                                <label className={label}>Status</label>
                                <select value={form.is_active ? 1 : 0} onChange={e => setForm({ ...form, is_active: Number(e.target.value) === 1 })} className={inp}>
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={label}>Description / Details</label>
                            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details describing what the customer receives..." className={`${inp} resize-none`} />
                        </div>

                        {isPersonalization && (
                            <AddonConfigSection options={options} setOptions={setOptions} optionFiles={optionFiles} setOptionFiles={setOptionFiles} fields={fields} setFields={setFields} inp={inp} label={label} />
                        )}

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link to={backRoute} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</Link>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25">
                                <Save size={15} /> {saving ? 'Saving...' : `Save ${typeLabel}`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
