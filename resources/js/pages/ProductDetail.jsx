import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductOptions from '../components/product/ProductOptions';
import ProductAddons from '../components/product/ProductAddons';
import PersonalizationModal from '../components/product/PersonalizationModal';
import ProductReviews from '../components/product/ProductReviews';
import ProductCard from '../components/ProductCard';
import { formatProduct } from '../components/product/productHelpers';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const [addons, setAddons] = useState([]);
    const [dbAddons, setDbAddons] = useState([]);
    const [selectedColorImg, setSelectedColorImg] = useState(null);
    const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
    const [pendingOpts, setPendingOpts] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        axios.get(`/api/public/products/${id}`)
            .then(res => {
                const item = formatProduct(res.data);
                setProduct(item);

                if (item.categoryId) {
                    axios.get(`/api/public/products?category_id=${item.categoryId}`)
                        .then(relRes => {
                            const list = (Array.isArray(relRes.data) ? relRes.data : (relRes.data?.data || []))
                                .filter(p => p.id != id)
                                .slice(0, 4)
                                .map(formatProduct);
                            setRelated(list);
                        })
                        .catch(() => { });
                }
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));

        axios.get('/api/public/addons')
            .then(res => setDbAddons(Array.isArray(res.data) ? res.data : []))
            .catch(() => {});
    }, [id]);

    const allGalleryImages = useMemo(() => {
        if (!product) return [];
        const base = Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : (product.image ? [product.image] : []);
        const colorImgs = (product.colorVariations || []).map(c => c.image).filter(Boolean);
        return Array.from(new Set([...base, ...colorImgs]));
    }, [product]);

    const personalizedItems = useMemo(() => {
        if (!product?.allowedAddons || !Array.isArray(product.allowedAddons)) return [];
        return product.allowedAddons.map(item => {
            const itemId = typeof item === 'object' && item !== null ? item.id : item;
            const dbMatch = dbAddons.find(d => d.id === itemId || d.name === item);
            const type = item?.type || dbMatch?.type || 'addon';
            if (type !== 'personalization') return null;

            const basePrice = item.custom_price !== null && item.custom_price !== undefined
                ? Number(item.custom_price)
                : Number(item?.price || dbMatch?.price || 0);

            return {
                id: itemId,
                name: item?.name || dbMatch?.name || 'Customized Item',
                price: basePrice,
                image: item?.image || dbMatch?.image || '',
                icon: item?.icon || dbMatch?.icon || '✨',
                type: 'personalization',
                description: item?.description || dbMatch?.description || '',
                options: Array.isArray(dbMatch?.options) ? dbMatch.options : (Array.isArray(item?.options) ? item.options : []),
                custom_fields: Array.isArray(dbMatch?.custom_fields) ? dbMatch.custom_fields : (Array.isArray(item?.custom_fields) ? item.custom_fields : []),
            };
        }).filter(Boolean);
    }, [product?.allowedAddons, dbAddons]);

    const proceedAddToCart = (opts, personalizedChoices = []) => {
        if (!product || !addToCart) return;
        const qty = opts?.qty || 1;
        const allChosen = [...addons, ...personalizedChoices];
        const addonTotal = allChosen.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
        const addonNames = allChosen.map(a => (a.selected_option?.name ? `${a.name} (${a.selected_option.name})` : a.name)).join(', ');

        addToCart({
            ...product,
            ...opts,
            price: product.price + addonTotal,
            addonsSummary: addonNames || null,
            selectedAddons: allChosen,
        }, qty);

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleAddToCartClick = (opts) => {
        if (personalizedItems.length > 0) {
            setPendingOpts(opts);
            setShowPersonalizeModal(true);
        } else {
            proceedAddToCart(opts, []);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center py-24">
                    <div className="w-9 h-9 border-3 border-[#c8102e] border-t-transparent rounded-full animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                    <p className="text-slate-500 text-xs mb-5">The requested gift product may have been archived or removed.</p>
                    <Link to="/shop" className="inline-block bg-[#c8102e] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-800 transition">
                        Explore All Gifts
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-6 w-full">
                <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
                    <Link to="/" className="hover:text-[#c8102e] transition">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-[#c8102e] transition">{product.categoryName}</Link>
                    <span>/</span>
                    <span className="text-slate-700 font-semibold truncate">{product.name}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                        <div className="w-full md:w-5/12 shrink-0">
                            <ProductImageGallery
                                images={allGalleryImages}
                                fallback={product.image}
                                productId={product.id}
                                isBestseller={product.isBestseller}
                                enablePersonalization={product.enablePersonalization}
                                selectedImage={selectedColorImg}
                            />
                        </div>

                        <div className="w-full md:w-7/12">
                            <ProductOptions
                                product={product}
                                onAddToCart={handleAddToCartClick}
                                addedToCart={addedToCart}
                                onColorSelect={(color) => { if (color?.image) setSelectedColorImg(color.image); }}
                            />
                            <ProductAddons allowedAddons={product.allowedAddons} onAddonsChange={setAddons} />
                        </div>
                    </div>
                </div>

                <ProductReviews productId={product.id} productName={product.name} initialReviews={product.reviews} />

                {related.length > 0 && (
                    <section className="mt-12 mb-6">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-5">Similar Gifts You Might Like</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {related.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <PersonalizationModal
                isOpen={showPersonalizeModal}
                onClose={() => setShowPersonalizeModal(false)}
                personalizedItems={personalizedItems}
                onConfirm={(selectedChoices) => {
                    setShowPersonalizeModal(false);
                    proceedAddToCart(pendingOpts, selectedChoices);
                }}
            />

            <Footer />
        </div>
    );
}
