import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Truck, Shield, Package, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductOptions from '../components/product/ProductOptions';
import ProductAddons from '../components/product/ProductAddons';
import ProductReviews from '../components/product/ProductReviews';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const formatProduct = (p) => {
  const imgs = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
  const formattedImgs = imgs.map(img => img.startsWith('http') ? img : `/storage/${img}`);
  const fallbackImg = formattedImgs[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80';

  return {
    id: p.id,
    name: p.name,
    price: p.discount_price || p.selling_price,
    oldPrice: p.discount_price ? p.selling_price : null,
    image: fallbackImg,
    images: formattedImgs.length > 0 ? formattedImgs : [fallbackImg],
    discount: p.discount_price ? Math.round(((p.selling_price - p.discount_price) / p.selling_price) * 100) : 0,
    isBestseller: p.is_featured,
    categoryName: p.category?.name || 'Gifts',
    description: p.description || 'A wonderful gift for your loved ones. Carefully crafted and beautifully packaged.',
    enablePersonalization: Boolean(p.enable_personalization),
    enableWrapping: p.enable_wrapping !== false,
    colorVariations: p.color_variations || [],
    allowedAddons: p.allowed_addons || ['card', 'teddy', 'ferrero', 'candle'],
    reviews: p.reviews || [],
    reviewsCount: (p.reviews?.length || 0) + 120,
    rating: 4.8,
  };
};

const TRUST_BADGES = [
  { icon: Truck, label: 'Same Day Delivery', sub: 'Order before 12 PM in Colombo' },
  { icon: Shield, label: 'Secure Payments', sub: 'Encrypted Visa / Master / COD' },
  { icon: Package, label: 'Signature Packaging', sub: 'Luxury box & ribbon included' },
  { icon: Award, label: '100% Freshness Guarantee', sub: 'Fresh or free replacement' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addons, setAddons] = useState([]);
  const [selectedColorImg, setSelectedColorImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios.get('/api/public/products')
      .then(res => {
        const all = res.data.map(formatProduct);
        const found = all.find(p => p.id == id);
        setProduct(found || null);
        setRelated(all.filter(p => p.id != id).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (opts) => {
    if (!product || !addToCart) return;

    const qty = opts?.qty || 1;
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const addonNames = addons.map(a => a.name).join(', ');

    addToCart({ 
      ...product, 
      ...opts,
      price: product.price + addonTotal,
      addonsSummary: addonNames || null
    }, qty);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found.</p>
          <Link to="/shop" className="inline-block bg-brand text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand transition-colors">{product.categoryName}</Link>
          <span>/</span>
          <span className="text-gray-700 font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Gallery (Left) */}
            <div className="w-full md:w-5/12 flex-shrink-0">
              <ProductImageGallery 
                images={selectedColorImg ? [selectedColorImg, ...product.images.filter(x => x !== selectedColorImg)] : product.images} 
                fallback={product.image} 
                productId={product.id} 
              />
            </div>

            {/* Options (Right) */}
            <div className="w-full md:w-7/12">
              <ProductOptions 
                product={product} 
                onAddToCart={handleAddToCart} 
                addedToCart={addedToCart} 
                onColorSelect={(color) => { if (color?.image) setSelectedColorImg(color.image); }}
              />
              <ProductAddons allowedAddons={product.allowedAddons} onAddonsChange={setAddons} />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0 text-brand">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-800 leading-tight">{label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews productId={product.id} productName={product.name} initialReviews={product.reviews} />

        {/* Related Gifts */}
        {related.length > 0 && (
          <section className="mt-12 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
