import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import Features from '../components/Features';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import PersonalizedBanner from '../components/PersonalizedBanner';
import WhyOrganic from '../components/WhyOrganic';
import Preloader from '../components/Preloader';

export default function Home() {
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [specialOffers, setSpecialOffers] = useState([]);
    const [heroReady, setHeroReady] = useState(false);
    const [productsReady, setProductsReady] = useState(false);

    useEffect(() => {
        axios.get('/api/public/products')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
                const formatted = list.map((p, i) => {
                    const revs = Array.isArray(p.reviews) ? p.reviews : [];
                    const count = revs.length;
                    const avg = count > 0
                        ? Number((revs.reduce((sum, r) => sum + Number(r.rating || 5), 0) / count).toFixed(1))
                        : 5.0;

                    return {
                        id: p.id,
                        name: p.name,
                        short_description: p.short_description || '',
                        categoryName: p.category?.name || '',
                        price: p.discount_price || p.selling_price,
                        oldPrice: p.discount_price ? p.selling_price : null,
                        image: p.images?.length > 0
                            ? (p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`)
                            : `https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80`,
                        discount: p.discount_price
                            ? Math.round(((p.selling_price - p.discount_price) / p.selling_price) * 100)
                            : 0,
                        rating: avg,
                        reviewsCount: count,
                        free_items: p.free_items || [],
                        isBestseller: i < 4 || p.is_featured,
                    };
                });

                // Separate sections for Best Sellers, New Arrivals, Special Offers
                setBestSellers(formatted.slice(0, 8));
                setNewArrivals([...formatted].reverse().slice(0, 8));
                setSpecialOffers(formatted.filter(p => p.discount > 0).slice(0, 8));
            })
            .catch(err => console.error(err))
            .finally(() => setProductsReady(true));
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Preloader isLoaded={heroReady && productsReady} />
            <Header />

            {/* Hero — full width edge-to-edge */}
            <HeroSlider onLoaded={() => setHeroReady(true)} />

            {/* Categories Auto-rotating with Clean Header */}
            <ScrollReveal>
                <CategoryGrid />
            </ScrollReveal>

            {/* Separate Section 1: Best Sellers */}
            <ScrollReveal>
                <ProductGrid
                    title="Best Sellers"
                    viewAllLink="/shop?filter=bestsellers"
                    products={bestSellers}
                    limit={8}
                />
            </ScrollReveal>

            {/* Personalized Banner */}
            <PersonalizedBanner />

            {/* Separate Section 2: New Arrivals */}
            <ScrollReveal>
                <ProductGrid
                    title="New Arrivals"
                    viewAllLink="/shop?filter=new"
                    products={newArrivals}
                    limit={8}
                />
            </ScrollReveal>

            {/* Trust Badges / Features */}
            <ScrollReveal>
                <div className="my-3 sm:my-5">
                    <Features />
                </div>
            </ScrollReveal>

            {/* Separate Section 3: Special Offers */}
            <ScrollReveal>
                <ProductGrid
                    title="Special Offers"
                    viewAllLink="/shop?filter=offers"
                    products={specialOffers.length > 0 ? specialOffers : bestSellers}
                    limit={8}
                />
            </ScrollReveal>

            {/* Why Wishes */}
            <ScrollReveal>
                <WhyOrganic />
            </ScrollReveal>

            <Footer />
        </div>
    );
}
