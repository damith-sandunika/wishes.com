import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import WhatsAppSettingsTab from './settings/WhatsAppSettingsTab';
import GiftServicesTab from './settings/GiftServicesTab';

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
        } catch (err) {
            setMessage('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm';

    if (loading) return <AdminLayout><div className="p-6 text-gray-500">Loading settings...</div></AdminLayout>;

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Settings</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Configure your store</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="relative z-10 bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2 justify-center w-full sm:w-auto">
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {message && <div className={`mb-6 px-4 py-3 rounded-md text-sm font-normal shadow-sm ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{message}</div>}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 flex overflow-x-auto custom-scrollbar">
                {['General', 'Delivery & Payment', 'Gift Wrapping & Add-ons', 'WhatsApp'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-normal transition-colors border-b-2 whitespace-nowrap ${
                            activeTab === tab 
                            ? 'border-[#1933C6] text-[#1933C6]' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                
                {activeTab === 'General' && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        <h3 className="font-normal text-gray-800 text-lg mb-2 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">🏢</span>
                            Shop Information
                        </h3>
                        <div>
                            <label className="block text-sm font-normal text-gray-700 mb-1.5">Shop Name</label>
                            <input value={settings.shop_name || ''} onChange={e => handleChange('shop_name', e.target.value)} className={inp} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">Email Address</label>
                                <input value={settings.shop_email || ''} onChange={e => handleChange('shop_email', e.target.value)} className={inp} />
                            </div>
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">Phone Number</label>
                                <input value={settings.shop_phone || ''} onChange={e => handleChange('shop_phone', e.target.value)} className={inp} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-normal text-gray-700 mb-1.5">Physical Address</label>
                            <textarea rows={3} value={settings.shop_address || ''} onChange={e => handleChange('shop_address', e.target.value)} className={`${inp} resize-none`} />
                        </div>
                    </div>
                )}

                {activeTab === 'Delivery & Payment' && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        <h3 className="font-normal text-gray-800 text-lg mb-2 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">🚚</span>
                            Delivery Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">Delivery Charge (Rs.)</label>
                                <input type="number" value={settings.delivery_charge || ''} onChange={e => handleChange('delivery_charge', e.target.value)} className={inp} />
                            </div>
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">Free Delivery Above (Rs.)</label>
                                <input type="number" value={settings.free_delivery_above || ''} onChange={e => handleChange('free_delivery_above', e.target.value)} className={inp} />
                            </div>
                        </div>
                        <h3 className="font-normal text-gray-800 text-lg mb-2 mt-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">💳</span>
                            Payment Details
                        </h3>
                        <div>
                            <label className="block text-sm font-normal text-gray-700 mb-1.5">Bank Account (For Transfers)</label>
                            <textarea rows={4} placeholder="Bank: Commercial Bank&#10;Branch: Colombo&#10;Acc No: 123456" value={settings.bank_account_number || ''} onChange={e => handleChange('bank_account_number', e.target.value)} className={`${inp} resize-none`} />
                        </div>
                    </div>
                )}

                {activeTab === 'Gift Wrapping & Add-ons' && (
                    <GiftServicesTab 
                        settings={settings} 
                        handleChange={handleChange} 
                    />
                )}

                {activeTab === 'WhatsApp' && (
                    <WhatsAppSettingsTab 
                        settings={settings} 
                        handleChange={handleChange} 
                        waStatus={waStatus} 
                        waQr={waQr} 
                    />
                )}
            </div>
        </AdminLayout>
    );
}
