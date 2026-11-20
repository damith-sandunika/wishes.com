import React from 'react';

const inp = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-colors';
const lbl = 'block text-sm font-medium text-gray-700 mb-1.5';
const DISTRICTS = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Kurunegala', 'Ratnapura'];
const TIMES = ['10:00 AM – 1:00 PM', '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM'];
const METHODS = [
    { id: 'standard', icon: '🚚', label: 'Standard Delivery', sub: 'Within 1-2 working days', price: 'LKR 350' },
    { id: 'sameday', icon: '⚡', label: 'Same Day Delivery', sub: 'Order before 12:00 PM', price: 'LKR 750' },
    { id: 'scheduled', icon: '📅', label: 'Schedule Delivery', sub: 'Choose your preferred date & time', price: 'LKR 350' },
];

export default function CheckoutDelivery({ form, onChange }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Delivery Details</h3>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={lbl}>Recipient Name <span className="text-red-500">*</span></label>
                        <input required type="text" value={form.recipientName}
                            onChange={e => onChange('recipientName', e.target.value)}
                            placeholder="Who's receiving the gift?" className={inp} />
                    </div>
                    <div>
                        <label className={lbl}>Recipient Phone <span className="text-red-500">*</span></label>
                        <input required type="tel" value={form.recipientPhone}
                            onChange={e => onChange('recipientPhone', e.target.value)}
                            placeholder="07X XXXXXXX" className={inp} />
                    </div>
                </div>
                <div>
                    <label className={lbl}>Delivery Address <span className="text-red-500">*</span></label>
                    <input required type="text" value={form.address}
                        onChange={e => onChange('address', e.target.value)}
                        placeholder="House No, Street, Area" className={inp} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className={lbl}>District <span className="text-red-500">*</span></label>
                        <select required value={form.district} onChange={e => onChange('district', e.target.value)} className={inp}>
                            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={lbl}>City / Town <span className="text-red-500">*</span></label>
                        <input required type="text" value={form.city}
                            onChange={e => onChange('city', e.target.value)}
                            placeholder="City" className={inp} />
                    </div>
                    <div>
                        <label className={lbl}>Postal Code</label>
                        <input type="text" value={form.postalCode}
                            onChange={e => onChange('postalCode', e.target.value)}
                            placeholder="00100" className={inp} />
                    </div>
                </div>

                {/* Delivery Method */}
                <div>
                    <label className={lbl}>Delivery Method <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {METHODS.map(m => (
                            <label key={m.id} className={`flex flex-col gap-1 p-4 border-2 rounded-xl cursor-pointer transition-all
                                ${form.deliveryMethod === m.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="deliveryMethod" value={m.id} className="sr-only"
                                    checked={form.deliveryMethod === m.id}
                                    onChange={() => onChange('deliveryMethod', m.id)} />
                                <span className="text-xl">{m.icon}</span>
                                <span className="font-semibold text-gray-800 text-sm">{m.label}</span>
                                <span className="text-xs text-gray-500">{m.sub}</span>
                                <span className={`text-xs font-bold mt-1 ${form.deliveryMethod === m.id ? 'text-red-600' : 'text-gray-600'}`}>{m.price}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Date & Time */}
                {(form.deliveryMethod === 'scheduled' || form.deliveryMethod === 'standard') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}>Delivery Date <span className="text-red-500">*</span></label>
                            <input required type="date" value={form.deliveryDate}
                                onChange={e => onChange('deliveryDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Delivery Time</label>
                            <select value={form.deliveryTime} onChange={e => onChange('deliveryTime', e.target.value)} className={inp}>
                                {TIMES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <p className="text-xs text-gray-400 italic">⚠ Sorry, we don't deliver on public holidays.</p>
            </div>
        </div>
    );
}
