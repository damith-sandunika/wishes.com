import React from 'react';
import { Link } from 'react-router-dom';

const inp = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-[#c8102e] focus:bg-white text-sm transition-colors';
const lbl = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function CheckoutContactInfo({ form, onChange }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-800 text-base">Contact Information</h3>
                    <p className="text-xs text-gray-500 mt-0.5">We'll use this to send order updates.</p>
                </div>
                <Link to="/account" className="text-xs text-[#c8102e] font-semibold hover:underline">
                    Have an account? Sign In
                </Link>
            </div>
            <div className="space-y-4">
                <div>
                    <label className={lbl}>Full Name <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="text"
                        value={form.senderName}
                        onChange={e => onChange('senderName', e.target.value)}
                        placeholder="Your full name"
                        className={inp}
                    />
                </div>
                <div>
                    <label className={lbl}>WhatsApp / Phone Number <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="tel"
                        value={form.senderPhone}
                        onChange={e => onChange('senderPhone', e.target.value)}
                        placeholder="07X XXXXXXX"
                        className={inp}
                    />
                </div>
                <div>
                    <label className={lbl}>Email Address <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="email"
                        value={form.senderEmail}
                        onChange={e => onChange('senderEmail', e.target.value)}
                        placeholder="you@email.com"
                        className={inp}
                    />
                </div>

                {/* Optional Account Creation during checkout */}
                <div className="pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-700 select-none">
                        <input
                            type="checkbox"
                            checked={!!form.createAccount}
                            onChange={e => onChange('createAccount', e.target.checked)}
                            className="w-4 h-4 text-[#c8102e] rounded border-gray-300 focus:ring-[#c8102e]"
                        />
                        <span>Create an account for tracking &amp; future orders</span>
                    </label>
                    {form.createAccount && (
                        <div className="mt-3">
                            <label className={lbl}>Create Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                value={form.password || ''}
                                onChange={e => onChange('password', e.target.value)}
                                placeholder="At least 6 characters"
                                className={inp}
                                minLength={6}
                                required={form.createAccount}
                            />
                            <p className="text-[11px] text-gray-500 mt-1">An account will be created so you can easily track your order.</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className={lbl}>Gift Message <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                        rows={2}
                        value={form.giftMessage}
                        onChange={e => onChange('giftMessage', e.target.value)}
                        placeholder="Add a personal message for the recipient..."
                        className={inp + ' resize-none'}
                    />
                </div>
            </div>
        </div>
    );
}
