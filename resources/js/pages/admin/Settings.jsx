import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import WhatsAppSettingsTab from './settings/WhatsAppSettingsTab';
import GiftServicesTab from './settings/GiftServicesTab';
import SocialLinksTab from './settings/SocialLinksTab';
import { Save } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [waStatus, setWaStatus] = useState('INITIALIZING');
    const [waQr, setWaQr] = useState(null);
    const [activeTab, setActiveTab] = useState('General');

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('/api/whatsapp/status')
                .then(res => {
                    setWaStatus(res.data.status || 'DISCONNECTED');
                    if (res.data.qr) setWaQr(res.data.qr);
                }).catch(() => setWaStatus('DISCONNECTED'));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchSettings = useCallback(() => {
        axios.get('/api/settings')
            .then(res => setSettings(res.data))
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
            setMessage('Settings saved successfully!');
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

    const inp = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-xs font-medium';

    if (loading) return <AdminLayout pageTitle="Settings"><div className="p-6 text-slate-500">Loading settings...</div></AdminLayout>;

    return (
        <AdminLayout
            pageTitle="Store Settings"
            pageSubtitle="Configure shop identity, social links, delivery fees and payment gateways"
            headerActions={
                <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-60 flex items-center gap-1.5">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            }
        >
            {message && (
                <div className={`mb-6 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-2xs ${message.includes('Error') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {message}
                </div>
            )}

            <div className="border-b border-slate-200 mb-6 flex overflow-x-auto gap-1">
                {['General', 'Social Media', 'Delivery & Payment', 'Gift Wrapping & Add-ons', 'WhatsApp'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-semibold transition border-b-2 whitespace-nowrap ${
                            activeTab === tab 
                            ? 'border-blue-600 text-blue-700' 
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {activeTab === 'General' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm mb-3">Shop Information</h3>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Shop Name</label>
                            <input value={settings.shop_name || ''} onChange={e => handleChange('shop_name', e.target.value)} className={inp} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                                <input value={settings.shop_email || ''} onChange={e => handleChange('shop_email', e.target.value)} className={inp} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                                <input value={settings.shop_phone || ''} onChange={e => handleChange('shop_phone', e.target.value)} className={inp} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Physical Address</label>
                            <textarea rows={3} value={settings.shop_address || ''} onChange={e => handleChange('shop_address', e.target.value)} className={`${inp} resize-none`} />
                        </div>
                    </div>
                )}

                {activeTab === 'Social Media' && (
                    <SocialLinksTab settings={settings} handleChange={handleChange} />
                )}

                {activeTab === 'Delivery & Payment' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm mb-3">Delivery Charges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Standard Delivery Fee (Rs.)</label>
                                <input type="number" value={settings.delivery_charge || ''} onChange={e => handleChange('delivery_charge', e.target.value)} className={inp} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Free Delivery Threshold (Rs.)</label>
                                <input type="number" value={settings.free_delivery_above || ''} onChange={e => handleChange('free_delivery_above', e.target.value)} className={inp} />
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-3 mt-6">Direct Bank Transfer Details</h3>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Bank Account Instructions</label>
                            <textarea rows={4} placeholder="Bank: Commercial Bank&#10;Branch: Colombo&#10;Acc No: 123456" value={settings.bank_account_number || ''} onChange={e => handleChange('bank_account_number', e.target.value)} className={`${inp} resize-none`} />
                        </div>
                    </div>
                )}

                {activeTab === 'Gift Wrapping & Add-ons' && (
                    <GiftServicesTab settings={settings} handleChange={handleChange} />
                )}

                {activeTab === 'WhatsApp' && (
                    <WhatsAppSettingsTab settings={settings} handleChange={handleChange} waStatus={waStatus} waQr={waQr} />
                )}
            </div>
        </AdminLayout>
    );
}
