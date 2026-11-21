import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import OrderView from './pages/admin/orders/View';
import AdminReviews from './pages/admin/Reviews';
import ProductIndex from './pages/admin/products/Index';
import ProductView from './pages/admin/products/View';
import ProductForm from './pages/admin/products/Form';
import CategoryIndex from './pages/admin/categories/Index';
import CategoryForm from './pages/admin/categories/Form';
import OccasionIndex from './pages/admin/occasions/Index';
import OccasionForm from './pages/admin/occasions/Form';
import AddonIndex from './pages/admin/addons/Index';
import AddonForm from './pages/admin/addons/Form';
import PersonalizationIndex from './pages/admin/personalizations/Index';
import FreeItemIndex from './pages/admin/free-items/Index';
import FreeItemForm from './pages/admin/free-items/Form';
import DeliveryZonesIndex from './pages/admin/delivery/Index';
import DeliveryZoneForm from './pages/admin/delivery/Form';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import FAQSettings from './pages/admin/settings/FAQSettings';
import PrivacyPolicySettings from './pages/admin/settings/PrivacyPolicySettings';
import DeliveryPolicySettings from './pages/admin/settings/DeliveryPolicySettings';
import TermsSettings from './pages/admin/settings/TermsSettings';
import ReturnsSettings from './pages/admin/settings/ReturnsSettings';
import AdminInventory from './pages/admin/Inventory';
import CouponIndex from './pages/admin/coupons/Index';
import SupplierIndex from './pages/admin/suppliers/Index';
import SupplierForm from './pages/admin/suppliers/Form';
import AdminReports from './pages/admin/Reports';
import AdminSliders from './pages/admin/Sliders';
import StaffIndex from './pages/admin/staff/Index';
import WhatsAppTemplates from './pages/admin/whatsapp/Templates';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { SettingsProvider } from './context/SettingsContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Category from './pages/Category';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Occasions from './pages/Occasions';
import FAQ from './pages/FAQ';
import DeliveryPolicy from './pages/DeliveryPolicy';
import Returns from './pages/Returns';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Account from './pages/Account';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <SettingsProvider>
            <CartProvider>
                <QuickViewProvider>
                    <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/category/:id" element={<Category />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/occasion" element={<Occasions />} />
                        <Route path="/occasions" element={<Occasions />} />
                        <Route path="/occasion/:slug" element={<Shop />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/track-order" element={<TrackOrder />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/help" element={<FAQ />} />
                        <Route path="/delivery-policy" element={<DeliveryPolicy />} />
                        <Route path="/returns" element={<Returns />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                        {/* Admin Auth */}
                        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Protected Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
                        <Route path="/admin/orders/:id" element={<ProtectedRoute><OrderView /></ProtectedRoute>} />
                        <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
                        <Route path="/admin/products" element={<ProtectedRoute><ProductIndex /></ProtectedRoute>} />
                        <Route path="/admin/products/:id" element={<ProtectedRoute><ProductView /></ProtectedRoute>} />
                        <Route path="/admin/products/create" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                        <Route path="/admin/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                        <Route path="/admin/categories" element={<ProtectedRoute><CategoryIndex /></ProtectedRoute>} />
                        <Route path="/admin/occasions" element={<ProtectedRoute><OccasionIndex /></ProtectedRoute>} />
                        <Route path="/admin/occasions/create" element={<ProtectedRoute><OccasionForm /></ProtectedRoute>} />
                        <Route path="/admin/occasions/:id/edit" element={<ProtectedRoute><OccasionForm /></ProtectedRoute>} />
                        <Route path="/admin/delivery" element={<ProtectedRoute><DeliveryZonesIndex /></ProtectedRoute>} />
                        <Route path="/admin/delivery/create" element={<ProtectedRoute><DeliveryZoneForm /></ProtectedRoute>} />
                        <Route path="/admin/delivery/:id/edit" element={<ProtectedRoute><DeliveryZoneForm /></ProtectedRoute>} />
                        <Route path="/admin/addons" element={<ProtectedRoute><AddonIndex /></ProtectedRoute>} />
                        <Route path="/admin/addons/create" element={<ProtectedRoute><AddonForm defaultType="addon" /></ProtectedRoute>} />
                        <Route path="/admin/addons/:id/edit" element={<ProtectedRoute><AddonForm defaultType="addon" /></ProtectedRoute>} />
                        <Route path="/admin/personalizations" element={<ProtectedRoute><PersonalizationIndex /></ProtectedRoute>} />
                        <Route path="/admin/personalizations/create" element={<ProtectedRoute><AddonForm defaultType="personalization" /></ProtectedRoute>} />
                        <Route path="/admin/personalizations/:id/edit" element={<ProtectedRoute><AddonForm defaultType="personalization" /></ProtectedRoute>} />
                        <Route path="/admin/free-items" element={<ProtectedRoute><FreeItemIndex /></ProtectedRoute>} />
                        <Route path="/admin/free-items/create" element={<ProtectedRoute><FreeItemForm /></ProtectedRoute>} />
                        <Route path="/admin/free-items/:id/edit" element={<ProtectedRoute><FreeItemForm /></ProtectedRoute>} />
                        <Route path="/admin/categories/create" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
                        <Route path="/admin/categories/:id/edit" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
                        <Route path="/admin/sliders" element={<ProtectedRoute><AdminSliders /></ProtectedRoute>} />
                        <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
                        <Route path="/admin/inventory" element={<ProtectedRoute><AdminInventory /></ProtectedRoute>} />
                        <Route path="/admin/coupons" element={<ProtectedRoute><CouponIndex /></ProtectedRoute>} />
                        <Route path="/admin/staff" element={<ProtectedRoute><StaffIndex /></ProtectedRoute>} />
                        <Route path="/admin/whatsapp-templates" element={<ProtectedRoute><WhatsAppTemplates /></ProtectedRoute>} />
                        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                        <Route path="/admin/settings/faq" element={<ProtectedRoute><FAQSettings /></ProtectedRoute>} />
                        <Route path="/admin/settings/privacy-policy" element={<ProtectedRoute><PrivacyPolicySettings /></ProtectedRoute>} />
                        <Route path="/admin/settings/delivery-policy" element={<ProtectedRoute><DeliveryPolicySettings /></ProtectedRoute>} />
                        <Route path="/admin/settings/terms" element={<ProtectedRoute><TermsSettings /></ProtectedRoute>} />
                        <Route path="/admin/settings/returns-policy" element={<ProtectedRoute><ReturnsSettings /></ProtectedRoute>} />
                        <Route path="/admin/suppliers" element={<ProtectedRoute><SupplierIndex /></ProtectedRoute>} />
                        <Route path="/admin/suppliers/create" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
                        <Route path="/admin/suppliers/:id/edit" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
                        <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    </BrowserRouter>
                </QuickViewProvider>
            </CartProvider>
            </SettingsProvider>
        </React.StrictMode>
    );
}
