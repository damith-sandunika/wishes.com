import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, MessageSquare } from 'lucide-react';

const DEFAULT_FAQS = [
    {
        q: 'Do you offer same-day delivery in Colombo and suburbs?',
        a: 'Yes! We offer same-day delivery across Colombo 1-15 and immediate suburbs for orders placed before 12:00 PM.'
    },
    {
        q: 'Can I choose a specific delivery date and time slot?',
        a: 'During checkout, you can select your preferred delivery date as well as a convenient time slot.'
    },
    {
        q: 'How does personalization work for mugs, frames, and greeting cards?',
        a: 'When you select any personalized gift item, customization input boxes appear directly on the product page.'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, MasterCard, and American Express online, local bank transfers, and Cash on Delivery (COD).'
    },
    {
        q: 'Are the flowers delivered fresh?',
        a: 'Yes, 100%! All our floral bouquets and arrangements are freshly sourced on the day of delivery from local growers.'
    }
];

export default function FAQSettings() {
    const [faqs, setFaqs] = useState([]);
    const [supportText, setSupportText] = useState('Chat with our dedicated support team on WhatsApp for instant assistance.');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api/settings')
            .then(res => {
                const raw = res.data?.faq_items;
                if (raw) {
                    try {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setFaqs(parsed);
                        } else setFaqs(DEFAULT_FAQS);
                    } catch (_) { setFaqs(DEFAULT_FAQS); }
                } else setFaqs(DEFAULT_FAQS);

                if (res.data?.faq_support_text) setSupportText(res.data.faq_support_text);
            })
            .catch(() => setFaqs(DEFAULT_FAQS))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/api/settings', {
                faq_items: faqs,
                faq_support_text: supportText
            });
            setMessage('FAQ and Help support settings saved successfully!');
            setTimeout(() => setMessage(''), 3500);
        } catch {
            setMessage('Error: Failed to save FAQ settings.');
        } finally {
            setSaving(false);
        }
    };

    const addFaq = () => {
        setFaqs([...faqs, { q: 'New Frequently Asked Question', a: '' }]);
    };

    const updateFaq = (idx, field, val) => {
        setFaqs(faqs.map((f, i) => i === idx ? { ...f, [field]: val } : f));
    };

    const removeFaq = (idx) => {
        if (faqs.length <= 1 && !window.confirm('Delete this FAQ item?')) return;
        setFaqs(faqs.filter((_, i) => i !== idx));
    };

    const moveFaq = (idx, dir) => {
        const target = idx + dir;
        if (target < 0 || target >= faqs.length) return;
        const copy = [...faqs];
        const temp = copy[idx];
        copy[idx] = copy[target];
        copy[target] = temp;
        setFaqs(copy);
    };

    const inp = "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-600 font-semibold shadow-2xs";

    return (
        <AdminLayout
            pageTitle="Help &amp; FAQ Management"
            pageSubtitle="Configure storefront frequently asked questions (wishes.com/help) and customer WhatsApp support banner."
            headerActions={
                <div className="flex items-center gap-2">
                    <button type="button" onClick={addFaq} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                        <Plus size={15} /> Add FAQ
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition">
                        <Save size={15} /> {saving ? 'Saving...' : 'Save FAQs'}
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

                {/* WhatsApp Help Banner Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><MessageSquare size={16} /></span>
                        <div>
                            <h3 className="font-bold text-slate-800 text-xs">Help Banner WhatsApp Support Text</h3>
                            <p className="text-[10px] text-slate-400">Displayed at the bottom of the /help and /faq storefront pages.</p>
                        </div>
                    </div>
                    <input
                        value={supportText}
                        onChange={e => setSupportText(e.target.value)}
                        placeholder="Chat with our dedicated support team on WhatsApp for instant assistance."
                        className={inp}
                    />
                </div>

                {/* FAQ Items List */}
                {loading ? (
                    <div className="h-64 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading FAQ questions...</div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <HelpCircle size={15} className="text-blue-600" /> Frequently Asked Questions ({faqs.length})
                            </span>
                        </div>

                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3 hover:border-slate-300 transition-colors">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 font-mono text-xs font-bold shrink-0">Q{idx + 1}</span>
                                        <input
                                            value={faq.q || ''}
                                            onChange={e => updateFaq(idx, 'q', e.target.value)}
                                            placeholder="Question..."
                                            className={`${inp} font-bold text-slate-800`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button type="button" onClick={() => moveFaq(idx, -1)} disabled={idx === 0} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"><ArrowUp size={14} /></button>
                                        <button type="button" onClick={() => moveFaq(idx, 1)} disabled={idx === faqs.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"><ArrowDown size={14} /></button>
                                        <button type="button" onClick={() => removeFaq(idx)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        rows={2}
                                        value={faq.a || ''}
                                        onChange={e => updateFaq(idx, 'a', e.target.value)}
                                        placeholder="Detailed answer for shoppers..."
                                        className={`${inp} resize-none font-normal leading-relaxed`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between pt-3">
                            <button type="button" onClick={addFaq} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs">
                                <Plus size={15} /> Add Another Question
                            </button>
                            <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition">
                                <Save size={15} /> {saving ? 'Saving...' : 'Save All FAQs'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
