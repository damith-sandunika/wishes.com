import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PageHero from '../components/PageHero';
import { Gift, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export default function Category() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        Promise.all([
            axios.get('/api/public/categories'),
            axios.get('/api/public/products')
        ]).then(([catRes, prodRes]) => {
            const currentCat = catRes.data.find(c => c.id == id || c.slug === id);
            setCategory(currentCat || { name: 'Gift Collection', description: 'Curated gifts for every special occasion.' });

            const rawList = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.data || []);
            const catProds = rawList.filter(p => {
                if (currentCat) return p.category_id === currentCat.id;
                return p.category_id == id;
            }).map(p => ({
                id: p.id,
                name: p.name,
                price: p.discount_price || p.selling_price,
                oldPrice: p.discount_price ? p.selling_price : null,
                discount: p.discount_price ? Math.round(((p.selling_price - p.discount_price) / p.selling_price) * 100) : 0,
                image: p.images?.length > 0
                    ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`)
                    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
                rating: 4.8,
                reviewsCount: 120,
            }));

            setProducts(catProds);
        }).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Banner */}
                <PageHero
                    title={category?.name || 'Gifts'}
                    subtitle={category?.description || 'Browse our best-selling gifts and create unforgettable memories.'}
                    badge="Category Collection"
                    breadcrumbs={[
                        { label: 'Home', to: '/' },
                        { label: 'Shop', to: '/shop' },
                        { label: category?.name || 'Category' }
                    ]}
                />

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                        <span className="text-sm text-gray-500">
                            Showing <strong className="text-gray-900">{products.length}</strong> items in this collection
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-brand"
                            >
                                <option value="popular">Popularity</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12">
                            <Gift size={48} className="mx-auto text-rose-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No items found</h3>
                            <p className="text-xs text-gray-500 mb-6">Explore our other categories or check back soon for fresh arrivals!</p>
                            <Link to="/shop" className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-dark transition-all">
                                <ArrowLeft size={16} /> Explore All Gifts
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
