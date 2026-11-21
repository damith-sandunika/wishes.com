import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import StepIndicator from '../components/checkout/StepIndicator';
import CheckoutContactInfo from '../components/checkout/CheckoutContactInfo';
import CheckoutDelivery from '../components/checkout/CheckoutDelivery';
import CheckoutPayment from '../components/checkout/CheckoutPayment';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import EmptyCartView from '../components/checkout/EmptyCartView';
import OrderSuccessView from '../components/checkout/OrderSuccessView';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { settings } = useSettings();
    const navigate = useNavigate();

    const [deliveryZones, setDeliveryZones] = useState([]);
    const [form, setForm] = useState({
        senderName: '', senderPhone: '', senderEmail: '',
        recipientName: '', recipientPhone: '',
        address: '', district: 'Colombo', city: '', postalCode: '',
        zoneId: '',
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

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                setForm(f => ({ ...f, senderName: u.name || f.senderName, senderEmail: u.email || f.senderEmail }));
            }
        } catch {}

        axios.get('/api/public/delivery-zones')
            .then(res => {
                const zones = Array.isArray(res.data) ? res.data : [];
                setDeliveryZones(zones);
                if (zones.length > 0) {
                    const matched = zones.find(z => Array.isArray(z.districts) && z.districts.includes('Colombo')) || zones[0];
                    setForm(f => ({ ...f, zoneId: String(matched.id) }));
                }
            })
            .catch(() => {});
    }, []);

    const onChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

    const activeZone = deliveryZones.find(z => String(z.id) === String(form.zoneId))
        || deliveryZones.find(z => Array.isArray(z.districts) && z.districts.includes(form.district))
        || deliveryZones[0];

    const baseDelivery = activeZone ? Number(activeZone.rate) : 350;
    const methodExtra = form.deliveryMethod === 'sameday' ? 400 : 0;
    const isFree = (activeZone?.free_delivery_above && cartTotal >= Number(activeZone.free_delivery_above))
        || (cartTotal > 15000)
        || appliedCoupon?.is_free_delivery;
    const deliveryCost = isFree ? 0 : (baseDelivery + methodExtra);
    const grandTotal = cartTotal + deliveryCost - couponDiscount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const res = await axios.post('/api/public/coupons/validate', { code: couponCode, sub_total: cartTotal });
            const coupon = res.data;
            const disc = coupon.calculated_discount ?? ((cartTotal * (coupon.discount_percent || 0)) / 100);
            setCouponDiscount(Number(disc));
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
            formData.append('delivery_address', `${form.address}, ${form.city}, ${form.district} (${activeZone?.name || ''})`);
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

    if (cartItems.length === 0 && !orderPlaced) return <EmptyCartView />;
    if (orderPlaced) return <OrderSuccessView onContinue={() => navigate('/')} />;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <PageHero
                title="Secure Checkout"
                subtitle="Provide recipient delivery address, delivery date/time, and custom card message."
                badge="256-Bit SSL Encrypted"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Cart', to: '/cart' },
                    { label: 'Checkout' }
                ]}
            />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                <StepIndicator activeStep={1} />
                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">⚠ {error}</div>}
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-[3] space-y-5">
                        <CheckoutContactInfo form={form} onChange={onChange} />
                        <CheckoutDelivery form={form} onChange={onChange} zones={deliveryZones} activeZone={activeZone} />
                        <CheckoutPayment form={form} onChange={onChange} settings={settings} />
                    </div>
                    <div className="flex-[2] min-w-0">
                        <CheckoutOrderSummary
                            cartItems={cartItems} subtotal={cartTotal} deliveryCost={deliveryCost}
                            couponDiscount={couponDiscount} appliedCoupon={appliedCoupon} couponCode={couponCode}
                            setCouponCode={setCouponCode} onApplyCoupon={handleApplyCoupon} onRemoveCoupon={handleRemoveCoupon}
                            grandTotal={grandTotal} onSubmit={handleSubmit} loading={loading}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
