import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';

export default function PolicyEditorLayout({ pageTitle, pageSubtitle, settingKey, defaultSections = [], extraContent = null }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/settings')
            .then(res => {
                const raw = res.data?.[settingKey];
                if (raw) {
                    try {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setSections(parsed);
                            return;
                        }
                    } catch (_) {}
                }
                setSections(defaultSections);
            })
            .catch(() => setSections(defaultSections))
            .finally(() => setLoading(false));
    }, [settingKey]);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/api/settings', { [settingKey]: sections });
            setMessage('Policy content saved successfully! Changes are live on the storefront.');
            setTimeout(() => setMessage(''), 3500);
        } catch {
            setMessage('Error: Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        setSections([...sections, { title: `${sections.length + 1}. New Policy Clause`, content: '' }]);
    };

    const updateSection = (idx, field, val) => {
        setSections(sections.map((s, i) => i === idx ? { ...s, [field]: val } : s));
    };

    const removeSection = (idx) => {
        if (sections.length <= 1 && !window.confirm('Delete this section?')) return;
        setSections(sections.filter((_, i) => i !== idx));
    };

    const moveSection = (idx, dir) => {
        const target = idx + dir;
        if (target < 0 || target >= sections.length) return;
        const copy = [...sections];
        const temp = copy[idx];
        copy[idx] = copy[target];
        copy[target] = temp;
        setSections(copy);
    };

    const inp = "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-600 font-semibold shadow-2xs";

    return (
        <AdminLayout
            pageTitle={pageTitle}
            pageSubtitle={pageSubtitle}
            headerActions={
                <div className="flex items-center gap-2">
                    <button type="button" onClick={addSection} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                        <Plus size={15} /> Add Clause
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition">
                        <Save size={15} /> {saving ? 'Saving...' : 'Save Policy'}
                    </button>
                </div>
            }
        >
            <div className="w-full space-y-5 pb-12">
                {message && (
                    <div className={`p-4 rounded-xl text-xs font-bold shadow-2xs ${message.includes('Error') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                        {message}
                    </div>
                )}

                {extraContent}

                {loading ? (
                    <div className="h-64 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading policy content...</div>
                ) : (
                    <div className="space-y-4">
                        {sections.map((sec, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3 hover:border-slate-300 transition-colors">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 font-mono text-xs font-bold shrink-0">#{idx + 1}</span>
                                        <input
                                            value={sec.title || ''}
                                            onChange={e => updateSection(idx, 'title', e.target.value)}
                                            placeholder="Clause Heading (e.g. 1. Terms of Acceptance)"
                                            className={`${inp} font-bold text-slate-800`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button type="button" onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"><ArrowUp size={14} /></button>
                                        <button type="button" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"><ArrowDown size={14} /></button>
                                        <button type="button" onClick={() => removeSection(idx)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        rows={3}
                                        value={sec.content || ''}
                                        onChange={e => updateSection(idx, 'content', e.target.value)}
                                        placeholder="Full paragraph description for this clause..."
                                        className={`${inp} resize-none font-normal leading-relaxed`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between pt-3">
                            <button type="button" onClick={addSection} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs">
                                <Plus size={15} /> Add Another Clause
                            </button>
                            <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition">
                                <Save size={15} /> {saving ? 'Saving...' : 'Save Policy Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
