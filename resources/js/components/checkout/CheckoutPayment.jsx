import React, { useState } from 'react';

const inp = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-colors';

export default function CheckoutPayment({ form, onChange, settings }) {
    const [agreed, setAgreed] = useState(false);
    const bankDetails = settings?.bank_account_number || 'Commercial Bank\nBranch: Colombo\nAcc Name: Wishes Gift Shop\nAcc No: 1234567890';

    const methods = [
        {
            id: 'online', label: 'Pay Online (Card / Mobile)',
            sub: null,
            badge: (
                <div className="flex gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-blue-700 text-white text-xs font-bold rounded">VISA</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">MC</span>
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">PayHere</span>
                </div>
            ),
        },
        {
            id: 'cod', label: 'Cash on Delivery (COD)',
            sub: 'Pay when the gift is delivered.',
            badge: null,
        },
        {
            id: 'bank', label: 'Bank Transfer',
            sub: 'Transfer to our bank account and send the receipt.',
            badge: null,
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Payment Method</h3>
            </div>
            <div className="space-y-3">
                {methods.map(m => (
                    <label key={m.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${form.paymentMethod === m.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="paymentMethod" value={m.id}
                            checked={form.paymentMethod === m.id}
                            onChange={() => onChange('paymentMethod', m.id)}
                            className="mt-0.5 accent-red-600 w-4 h-4 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                            {m.sub && <p className="text-xs text-gray-500 mt-0.5">{m.sub}</p>}
                            {m.badge}
                        </div>
                    </label>
                ))}
            </div>

            {/* Bank Transfer Details */}
            {form.paymentMethod === 'bank' && (
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-blue-800 text-sm">Bank Account Details</h4>
                    <pre className="text-sm text-blue-700 whitespace-pre-wrap font-sans">{bankDetails}</pre>
                    <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                            Upload Payment Slip / Receipt <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                            required={form.paymentMethod === 'bank'}
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const ext = '.' + f.name.split('.').pop().toLowerCase();
                                const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
                                if (!allowed.includes(ext)) {
                                    alert('⚠️ Invalid format!\nOnly JPG, JPEG, PNG, WEBP, or PDF payment slips are allowed.');
                                    e.target.value = '';
                                    return;
                                }
                                if (f.size > 3 * 1024 * 1024) {
                                    alert('⚠️ File size exceeds the 3MB limit!\nPlease upload a payment slip under 3MB.');
                                    e.target.value = '';
                                    return;
                                }
                                onChange('paymentSlip', f);
                            }}
                            className="w-full text-sm text-blue-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-800 hover:file:bg-blue-300 cursor-pointer"
                        />
                        <p className="text-xs text-blue-500 mt-2">* Your order is processed after payment is verified.</p>
                    </div>
                </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 mt-5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-red-600 w-4 h-4 shrink-0" required />
                <span className="text-xs text-gray-600">
                    I have read and agree to the{' '}
                    <a href="/terms" className="text-red-600 underline hover:text-red-700">Terms & Conditions</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-red-600 underline hover:text-red-700">Privacy Policy</a>.
                </span>
            </label>
        </div>
    );
}
