import React from 'react';
import { X, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function CheckoutOrderSummary({
    cartItems, subtotal, deliveryCost, couponDiscount, appliedCoupon,
    couponCode, setCouponCode, onApplyCoupon, onRemoveCoupon,
    grandTotal, onSubmit, loading,
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-semibold text-gray-800 text-base mb-4 border-b pb-3">Order Summary</h3>

            {/* Product list */}
            <div className="max-h-44 overflow-y-auto space-y-3 mb-4 pr-1">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 shrink-0">
                            LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Coupon */}
            <div className="mb-4 pb-4 border-y border-gray-100">
                <div className="flex gap-2">
                    <input type="text" value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Promo code"
                        disabled={!!appliedCoupon}
                        className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none uppercase" />
                    {appliedCoupon ? (
                        <button type="button" onClick={onRemoveCoupon}
                            className="shrink-0 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-1">
                            <X size={13} />
                        </button>
                    ) : (
                        <button type="button" onClick={onApplyCoupon}
                            className="shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                            Apply
                        </button>
                    )}
                </div>
                {appliedCoupon && (
                    <p className="text-green-600 text-xs mt-1.5 font-medium">
                        ✓ Coupon applied — {appliedCoupon.discount_percent}% off
                    </p>
                )}
            </div>

            {/* Summary rows */}
            <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={deliveryCost === 0 ? 'font-semibold text-green-600' : 'font-medium text-gray-800'}>
                        {deliveryCost === 0 ? 'FREE' : `LKR ${deliveryCost}`}
                    </span>
                </div>
                {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>− LKR {couponDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-3">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">LKR {grandTotal.toLocaleString()}</span>
                </div>
            </div>

            {/* Place order */}
            <button type="button" onClick={onSubmit} disabled={loading}
                className="mt-5 w-full py-3.5 rounded-xl text-white font-bold bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                ) : '🔒 Place Order Now →'}
            </button>

            {/* Security badges */}
            <div className="mt-4 space-y-1.5">
                {[['Truck', 'Islandwide Delivery'], ['ShieldCheck', 'Safe & Secure Payments'], ['Headphones', 'Dedicated Support']].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
