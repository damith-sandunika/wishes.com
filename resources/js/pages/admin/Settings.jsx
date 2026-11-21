import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Save, Building2, Share2, CreditCard } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const fetchSettings = useCallback(() => {
        axios.get('/api/settings')
            .then(res => setSettings(res.data || {}))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/api/settings', settings);
            setMessage('Store settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-xs font-semibold shadow-2xs';
    const label = 'block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    if (loading) return <AdminLayout pageTitle="General Settings"><div className="p-8 text-slate-400 text-xs font-semibold">Loading settings...</div></AdminLayout>;

    return (
        <AdminLayout
            pageTitle="General Store Settings"
            pageSubtitle="Configure shop identity, contact details, social media channels, and bank transfer instructions."
            headerActions={
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-60 flex items-center gap-1.5">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            }
        >
            <div className="w-full space-y-6 pb-12">
                {message && (
                    <div className={`p-4 rounded-xl text-xs font-bold shadow-2xs ${message.includes('Error') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Section 1: Shop Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Building2 size={18} /></span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Shop Information</h3>
                                <p className="text-[11px] text-slate-500">Official business name and contact credentials.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={label}>Shop Name</label>
                                <input value={settings.shop_name || ''} onChange={e => handleChange('shop_name', e.target.value)} className={inp} placeholder="Wishes.com" />
                            </div>
                            <div>
                                <label className={label}>Email Address</label>
                                <input type="email" value={settings.shop_email || ''} onChange={e => handleChange('shop_email', e.target.value)} className={inp} placeholder="support@wishes.com" />
                            </div>
                            <div>
                                <label className={label}>Phone Number</label>
                                <input value={settings.shop_phone || ''} onChange={e => handleChange('shop_phone', e.target.value)} className={inp} placeholder="+94 71 808 0582" />
                            </div>
                        </div>

                        <div>
                            <label className={label}>Physical Address</label>
                            <textarea rows={2} value={settings.shop_address || ''} onChange={e => handleChange('shop_address', e.target.value)} className={`${inp} resize-none`} placeholder="Colombo, Sri Lanka" />
                        </div>
                    </div>

                    {/* Section 2: Official Social Media Profiles */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><Share2 size={18} /></span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Official Social Media Profiles</h3>
                                <p className="text-[11px] text-slate-500">Connected to your storefront footer and customer contact channels.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Facebook Page URL</label>
                                <input value={settings.facebook_url || ''} onChange={e => handleChange('facebook_url', e.target.value)} className={inp} placeholder="https://facebook.com/wishes.official" />
                            </div>
                            <div>
                                <label className={label}>Instagram Profile URL</label>
                                <input value={settings.instagram_url || ''} onChange={e => handleChange('instagram_url', e.target.value)} className={inp} placeholder="https://instagram.com/wishes_lk" />
                            </div>
                            <div>
                                <label className={label}>TikTok Channel URL</label>
                                <input value={settings.tiktok_url || ''} onChange={e => handleChange('tiktok_url', e.target.value)} className={inp} placeholder="https://tiktok.com/@wishes.gifts" />
                            </div>
                            <div>
                                <label className={label}>YouTube Channel URL</label>
                                <input value={settings.youtube_url || ''} onChange={e => handleChange('youtube_url', e.target.value)} className={inp} placeholder="https://youtube.com/@wishes_celebrations" />
                            </div>
                        </div>

                        <div>
                            <label className={label}>Official WhatsApp Support Number</label>
                            <input value={settings.whatsapp_number || ''} onChange={e => handleChange('whatsapp_number', e.target.value)} className={inp} placeholder="+94 77 123 4567" />
                        </div>
                    </div>

                    {/* Section 3: Direct Bank Transfer Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CreditCard size={18} /></span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Direct Bank Transfer Instructions</h3>
                                <p className="text-[11px] text-slate-500">Bank accounts displayed to customers on checkout for bank slip transfer orders.</p>
                            </div>
                        </div>

                        <div>
                            <label className={label}>Bank Account Instructions</label>
                            <textarea rows={3} placeholder="Bank: Commercial Bank&#10;Branch: Colombo&#10;Acc Name: Wishes (Pvt) Ltd&#10;Acc No: 1234567890" value={settings.bank_account_number || ''} onChange={e => handleChange('bank_account_number', e.target.value)} className={`${inp} resize-none font-mono`} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-60 flex items-center gap-2">
                            <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
