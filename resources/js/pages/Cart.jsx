import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Gift } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';
import OrderSummaryCard from '../components/cart/OrderSummaryCard';
import axios from 'axios';

const SUGGESTIONS = [
    { id: 's1', name: 'Rose Bouquet', price: 5990, image: 'https://images.unsplash.com/photo-1487530811015-780785d04c3f?w=200&q=80' },
    { id: 's2', name: 'Chocolate Box', price: 4750, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80' },
    { id: 's3', name: 'Teddy Bear', price: 3250, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
    { id: 's4', name: 'Gift Hamper', price: 7990, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=200&q=80' },
];

export default function Cart() {
    const { cartItems, updateQty, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
    const [giftWrapping, setGiftWrapping] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const deliveryCharge = (cartTotal > 5000 || appliedCoupon?.is_free_delivery) ? 0 : 350;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const res = await axios.post('/api/public/coupons/validate', { code: couponCode, sub_total: cartTotal });
            const coupon = res.data;
            const disc = coupon.calculated_discount ?? ((cartTotal * (coupon.discount_percent || 0)) / 100);
            setCouponDiscount(Number(disc));
            setAppliedCoupon(coupon);
        } catch {
            setCouponDiscount(0);
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-14 text-center border border-gray-100 shadow-sm max-w-md w-full">
                        <div className="text-6xl mb-5">🎁</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 text-sm mb-7">Looks like you haven't added any gifts yet.</p>
                        <Link to="/shop" className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-red-200">
                            Discover Thoughtful Gifts
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <PageHero
                title="Shopping Cart"
                subtitle="Review your selected items, luxury gift wrapping, and personalized messages."
                badge="Express Checkout"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Cart' }
                ]}
            />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Your Cart Items ({cartCount})</h2>
                        <div className="w-10 h-0.5 bg-[#c8102e] mt-1 rounded-full" />
                    </div>
                    <span className="bg-red-50 text-[#c8102e] font-semibold text-xs px-3 py-1 rounded-full border border-red-100">
                        {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Cart
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Items */}
                    <div className="flex-1 space-y-4">
                        {/* Desktop table header */}
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide px-4">
                            <span>Product</span><span className="text-center">Price</span>
                            <span className="text-center">Quantity</span><span className="text-center">Total</span><span />
                        </div>

                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                {/* Mobile layout */}
                                <div className="flex gap-4 md:hidden">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                                        <span className="inline-block mt-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Same Day Delivery Available</span>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-100 text-gray-600"><Minus size={13} /></button>
                                                <span className="px-3 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-100 text-red-600"><Plus size={13} /></button>
                                            </div>
                                            <span className="font-bold text-red-600 text-sm">LKR {(item.price * item.quantity).toLocaleString()}</span>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop layout */}
                                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-15 h-15 rounded-xl object-cover bg-gray-50 w-[60px] h-[60px]" />
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                            <span className="inline-block mt-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Same Day Delivery Available</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-sm text-gray-600">LKR {item.price.toLocaleString()}</p>
                                    <div className="flex justify-center">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2.5 py-2 hover:bg-gray-100 text-gray-600"><Minus size={13} /></button>
                                            <span className="px-3 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2.5 py-2 hover:bg-gray-100 text-red-600"><Plus size={13} /></button>
                                        </div>
                                    </div>
                                    <p className="text-center font-bold text-red-600 text-sm">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}

                        {/* Gift wrapping + Clear */}
                        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div onClick={() => setGiftWrapping(!giftWrapping)}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${giftWrapping ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${giftWrapping ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    <Gift size={15} className="inline mr-1 text-pink-500" />
                                    Add Gift Wrapping to All Items <span className="text-green-600">(+ LKR 350)</span>
                                </span>
                            </label>
                            <button onClick={() => clearCart && clearCart()} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                                Clear Cart
                            </button>
                        </div>

                        {/* You May Also Like */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">You May Also Like</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {SUGGESTIONS.map(p => (
                                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                                        <div className="p-3">
                                            <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                                            <p className="text-xs text-red-600 font-bold mt-0.5">LKR {p.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-96">
                        <OrderSummaryCard
                            subtotal={cartTotal}
                            giftWrapping={giftWrapping}
                            deliveryCharge={deliveryCharge}
                            couponDiscount={couponDiscount}
                            appliedCoupon={appliedCoupon}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            onApplyCoupon={handleApplyCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
