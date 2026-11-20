import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, X } from 'lucide-react';

export default function OrderSummaryCard({
    subtotal, giftWrapping, deliveryCharge, couponDiscount,
    appliedCoupon, couponCode, setCouponCode, onApplyCoupon, onRemoveCoupon,
}) {
    const grand = subtotal + (giftWrapping ? 350 : 0) + deliveryCharge - couponDiscount;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-semibold text-gray-800 text-lg mb-4 border-b pb-3">Order Summary</h3>

            {/* Coupon */}
            <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    <Tag size={12} className="inline mr-1" />Promo Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={!!appliedCoupon}
                        className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none uppercase"
                    />
                    {appliedCoupon ? (
                        <button type="button" onClick={onRemoveCoupon}
                            className="shrink-0 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-1">
                            <X size={14} /> Remove
                        </button>
                    ) : (
                        <button type="button" onClick={onApplyCoupon}
                            className="shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Apply
                        </button>
                    )}
                </div>
                {appliedCoupon && (
                    <p className="text-green-600 text-xs mt-1.5 font-medium">
                        ✓ "{appliedCoupon.code}" applied — {appliedCoupon.discount_percent}% off
                    </p>
                )}
            </div>

            {/* Rows */}
            <div className="space-y-2.5 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-800 font-medium">LKR {subtotal.toLocaleString()}</span>
                </div>
                {giftWrapping && (
                    <div className="flex justify-between text-pink-600">
                        <span>🎁 Gift Wrapping</span>
                        <span>+ LKR 350</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'text-gray-800 font-medium'}>
                        {deliveryCharge === 0 ? 'FREE' : `LKR ${deliveryCharge}`}
                    </span>
                </div>
                {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>− LKR {couponDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3 mt-1">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">LKR {grand.toLocaleString()}</span>
                </div>
            </div>

            {/* Est. Delivery */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <MapPin size={13} className="text-red-500 shrink-0" />
                <span>Estimated Delivery: <span className="font-semibold text-gray-700">Tomorrow</span> · Colombo</span>
            </div>

            <Link to="/checkout"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm">
                🔒 Proceed to Checkout →
            </Link>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-2 gap-2">
                {['Fast & Reliable Delivery', 'Gift Wrapping Option', 'Scheduled Delivery', 'Secure & Safe Payment'].map(b => (
                    <div key={b} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {b}
                    </div>
                ))}
            </div>
        </div>
    );
}
