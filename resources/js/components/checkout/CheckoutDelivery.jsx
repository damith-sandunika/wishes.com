import React from 'react';
import { Truck, Clock, Globe } from 'lucide-react';

const inp = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white text-sm transition-colors';
const lbl = 'block text-sm font-medium text-gray-700 mb-1.5';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle', 'International / Overseas'
];
const TIMES = ['10:00 AM – 1:00 PM', '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM'];

export default function CheckoutDelivery({ form, onChange, zones = [], activeZone }) {
    const handleDistrictChange = (d) => {
        onChange('district', d);
        if (zones.length > 0) {
            const matched = zones.find(z => Array.isArray(z.districts) && z.districts.includes(d));
            if (matched) onChange('zoneId', String(matched.id));
        }
    };

    const isOverseas = form.district === 'International / Overseas' || activeZone?.name?.toLowerCase().includes('overseas');

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5 pb-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                    <Truck size={18} className="text-[#c8102e]" /> Delivery Details &amp; Shipping Rates
                </h3>
                {activeZone && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-[#c8102e] rounded-full border border-red-100">
                        {activeZone.name}
                    </span>
                )}
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
                        placeholder="House No, Street, Landmark" className={inp} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className={lbl}>District / Destination <span className="text-red-500">*</span></label>
                        <select required value={form.district} onChange={e => handleDistrictChange(e.target.value)} className={inp}>
                            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={lbl}>City / Town <span className="text-red-500">*</span></label>
                        <input required type="text" value={form.city}
                            onChange={e => onChange('city', e.target.value)}
                            placeholder="City / Country" className={inp} />
                    </div>
                    <div>
                        <label className={lbl}>Postal Code</label>
                        <input type="text" value={form.postalCode}
                            onChange={e => onChange('postalCode', e.target.value)}
                            placeholder="Postal / ZIP" className={inp} />
                    </div>
                </div>

                {/* Delivery Zone Notice */}
                {activeZone && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-600" /> {activeZone.estimated_time || 'Standard duration'}</span>
                            <span className="text-[#c8102e]">Zone Rate: Rs. {Number(activeZone.rate).toLocaleString()}</span>
                        </div>
                        {activeZone.free_delivery_above && (
                            <p className="text-[11px] text-emerald-600 font-semibold">
                                🎁 Free delivery on orders over Rs. {Number(activeZone.free_delivery_above).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}

                {/* Delivery Method */}
                <div>
                    <label className={lbl}>Delivery Speed <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'standard', icon: '🚚', label: 'Standard', sub: activeZone?.estimated_time || '1-2 Days' },
                            { id: 'sameday', icon: '⚡', label: 'Same Day Express', sub: 'Order before 12 PM (+Rs 400)', disabled: isOverseas },
                            { id: 'scheduled', icon: '📅', label: 'Schedule Date', sub: 'Pick exact date' },
                        ].map(m => (
                            <label key={m.id} className={`flex flex-col gap-0.5 p-3.5 border-2 rounded-xl cursor-pointer transition-all
                                ${m.disabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' : form.deliveryMethod === m.id ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="deliveryMethod" value={m.id} disabled={m.disabled} className="sr-only"
                                    checked={form.deliveryMethod === m.id}
                                    onChange={() => !m.disabled && onChange('deliveryMethod', m.id)} />
                                <span className="text-lg">{m.icon}</span>
                                <span className="font-semibold text-gray-800 text-xs">{m.label}</span>
                                <span className="text-[11px] text-gray-500">{m.sub}</span>
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
                            <label className={lbl}>Preferred Time Window</label>
                            <select value={form.deliveryTime} onChange={e => onChange('deliveryTime', e.target.value)} className={inp}>
                                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <p className="text-xs text-gray-400 italic">⚠ Fast, insured, and handled with utmost care for your celebration gifts.</p>
            </div>
        </div>
    );
}
