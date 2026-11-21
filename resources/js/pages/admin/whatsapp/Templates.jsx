import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Save, MessageSquare, Check, Sparkles, Send } from 'lucide-react';

const TEMPLATES = [
    { key: 'wa_order_template', title: '1. Order Placed Template', desc: 'Sent automatically after a customer places an order', defaultVal: 'Hi {{customer_name}}! 🎁 Thank you for ordering from Wishes.com. Your invoice is #{{invoice}} for Rs. {{total}}. Track at: {{tracking}}' },
    { key: 'wa_confirm_template', title: '2. Order Confirmed Template', desc: 'Sent when payment is verified and gift assembly begins', defaultVal: 'Hello {{customer_name}}, good news! Your gift order #{{invoice}} has been confirmed and is being hand-crafted with love! ✨' },
    { key: 'wa_delivery_template', title: '3. Out for Delivery Template', desc: 'Sent when the courier rider picks up the parcel for delivery', defaultVal: 'Hi {{customer_name}}! 🚚 Your gift parcel (#{{invoice}}) is out for delivery today to {{address}}. Get ready to celebrate!' },
    { key: 'wa_completed_template', title: '4. Delivered & Completed Template', desc: 'Sent once the gift is successfully handed over to the recipient', defaultVal: 'Hooray {{customer_name}}! 🎉 Your gift (#{{invoice}}) has been successfully delivered! Thank you for spreading joy with Wishes.com ❤️' },
];

const TAGS = ['{{customer_name}}', '{{invoice}}', '{{total}}', '{{address}}', '{{tracking}}'];

export default function WhatsAppTemplates() {
    const [settings, setSettings] = useState({});
    const [activeKey, setActiveKey] = useState('wa_order_template');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/settings').then(res => setSettings(res.data || {})).catch(() => {});
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/api/settings', settings);
            setMessage('WhatsApp templates saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Failed to save templates.');
        } finally {
            setSaving(false);
        }
    };

    const insertTag = (tag) => {
        const cur = settings[activeKey] || '';
        setSettings(prev => ({ ...prev, [activeKey]: cur + (cur ? ' ' : '') + tag }));
    };

    const currentTemplate = TEMPLATES.find(t => t.key === activeKey) || TEMPLATES[0];
    const previewText = (settings[activeKey] || currentTemplate.defaultVal)
        .replace(/{{customer_name}}/g, 'Dilshan Silva')
        .replace(/{{invoice}}/g, 'INV-2026-8842')
        .replace(/{{total}}/g, '8,500')
        .replace(/{{address}}/g, 'No 45, Flower Road, Colombo 07')
        .replace(/{{tracking}}/g, 'WSH-LK-99412');

    return (
        <AdminLayout
            pageTitle="WhatsApp Message Templates"
            pageSubtitle="Customize dynamic WhatsApp dispatch notifications and order event automations"
            headerActions={
                <button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-60 flex items-center gap-1.5">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save All Templates'}
                </button>
            }
        >
            {message && (
                <div className="mb-5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Triggers</div>
                    {TEMPLATES.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveKey(t.key)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                activeKey === t.key 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <div className="font-bold text-xs">{t.title}</div>
                            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.desc}</div>
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-8 space-y-5">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-slate-900 text-sm">{currentTemplate.title}</h3>
                            <span className="text-[11px] text-slate-400">{currentTemplate.desc}</span>
                        </div>

                        <div className="mb-3">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">Click to insert tag:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => insertTag(tag)}
                                        className="text-[11px] font-mono bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-md transition border border-slate-200"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            rows={5}
                            value={settings[activeKey] ?? currentTemplate.defaultVal}
                            onChange={e => setSettings({ ...settings, [activeKey]: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-medium resize-none shadow-2xs"
                        />
                    </div>

                    <div className="bg-[#e5ddd5] rounded-xl p-4 border border-[#d1c7bc] shadow-sm max-w-md mx-auto">
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">📱 WhatsApp Customer Preview</div>
                        <div className="bg-white rounded-2xl p-3 shadow-xs rounded-tl-xs max-w-sm ml-auto border border-black/5">
                            <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">{previewText}</p>
                            <div className="text-right text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                                <span>10:45 AM</span>
                                <Check size={12} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
