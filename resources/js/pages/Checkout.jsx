import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import StepIndicator from '../components/checkout/StepIndicator';
import CheckoutContactInfo from '../components/checkout/CheckoutContactInfo';
import CheckoutDelivery from '../components/checkout/CheckoutDelivery';
import CheckoutPayment from '../components/checkout/CheckoutPayment';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';

const DELIVERY_COSTS = { standard: 350, sameday: 750, scheduled: 350 };

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { settings } = useSettings();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        senderName: '', senderPhone: '', senderEmail: '',
        recipientName: '', recipientPhone: '',
        address: '', district: 'Colombo', city: '', postalCode: '',
        deliveryMethod: 'standard', deliveryDate: '', deliveryTime: '10:00 AM – 1:00 PM',
        paymentMethod: 'online', giftMessage: '', paymentSlip: null,
        createAccount: false, password: '',
    });
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                setForm(f => ({ ...f, senderName: u.name || f.senderName, senderEmail: u.email || f.senderEmail }));
            }
        } catch {}
    }, []);

    const onChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

    const rawDelivery = DELIVERY_COSTS[form.deliveryMethod] ?? 350;
    const deliveryCost = cartTotal > 5000 ? 0 : rawDelivery;
    const grandTotal = cartTotal + deliveryCost - couponDiscount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const res = await axios.post('/api/public/coupons/validate', { code: couponCode });
            const coupon = res.data;
            let disc = (cartTotal * coupon.discount_percent) / 100;
            if (coupon.max_discount && disc > coupon.max_discount) disc = parseFloat(coupon.max_discount);
            setCouponDiscount(disc);
            setAppliedCoupon(coupon);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid coupon code.');
            setCouponDiscount(0);
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); };

    const handleSubmit = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        setError('');
        try {
            await axios.get('/sanctum/csrf-cookie');
            const formData = new FormData();
            formData.append('customer_name', form.senderName);
            formData.append('whatsapp_number', form.senderPhone);
            formData.append('sender_email', form.senderEmail);
            formData.append('recipient_name', form.recipientName);
            formData.append('recipient_phone', form.recipientPhone);
            formData.append('delivery_address', `${form.address}, ${form.city}, ${form.district}`);
            formData.append('postal_code', form.postalCode);
            formData.append('delivery_method', form.deliveryMethod);
            formData.append('delivery_date', form.deliveryDate);
            formData.append('delivery_time', form.deliveryTime);
            formData.append('gift_message', form.giftMessage);
            formData.append('payment_method', form.paymentMethod === 'cod' ? 'COD' : form.paymentMethod === 'bank' ? 'Bank Transfer' : 'Online');
            formData.append('delivery_charge', deliveryCost);
            formData.append('sub_total', cartTotal);
            formData.append('discount_amount', couponDiscount);
            if (appliedCoupon) formData.append('coupon_code', appliedCoupon.code);
            formData.append('grand_total', grandTotal);
            formData.append('items', JSON.stringify(cartItems.map(i => ({
                product_id: i.id, product_name: i.name,
                quantity: i.quantity, unit_price: i.price, total_price: i.price * i.quantity,
            }))));
            if (form.paymentMethod === 'bank' && form.paymentSlip) formData.append('payment_slip', form.paymentSlip);
            if (form.createAccount && form.password) {
                formData.append('create_account', '1');
                formData.append('password', form.password);
            }
            const res = await axios.post('/api/public/orders', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data?.user && res.data?.token) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('auth_token', res.data.token);
            }
            if (clearCart) clearCart();
            setOrderPlaced(true);
            window.scrollTo(0, 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    // Empty cart
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Your cart is empty.</p>
                        <Link to="/shop" className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                            Shop Now
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Success screen
    if (orderPlaced) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-green-100 text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Order Placed Successfully!</h2>
                        <p className="text-gray-500 text-sm mb-8">Thank you! We'll contact you via WhatsApp to confirm delivery.</p>
                        <button onClick={() => navigate('/')}
                            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-200">
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                <StepIndicator activeStep={1} />

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                        ⚠ {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left col: 60% */}
                    <div className="flex-[3] space-y-5">
                        <CheckoutContactInfo form={form} onChange={onChange} />
                        <CheckoutDelivery form={form} onChange={onChange} />
                        <CheckoutPayment form={form} onChange={onChange} settings={settings} />
                    </div>

                    {/* Right col: 40% */}
                    <div className="flex-[2] min-w-0">
                        <CheckoutOrderSummary
                            cartItems={cartItems}
                            subtotal={cartTotal}
                            deliveryCost={deliveryCost}
                            couponDiscount={couponDiscount}
                            appliedCoupon={appliedCoupon}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            onApplyCoupon={handleApplyCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                            grandTotal={grandTotal}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
