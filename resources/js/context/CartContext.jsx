import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('wishes_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishes_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('wishes_cart', JSON.stringify(cartItems));
        } catch {}
    }, [cartItems]);

    useEffect(() => {
        try {
            localStorage.setItem('wishes_wishlist', JSON.stringify(wishlist));
        } catch {}
    }, [wishlist]);

    const addToCart = (product, quantity = 1) => {
        const qty = Number(quantity) > 0 ? Number(quantity) : 1;
        setCartItems(prev => {
            const existingIndex = prev.findIndex(i => i.id === product.id);
            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + qty,
                };
                return next;
            }
            return [...prev, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(i => i.id !== productId));
    };

    const updateQty = (productId, quantity) => {
        if (quantity < 1) { removeFromCart(productId); return; }
        setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(i => i.id === product.id);
            return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
        });
    };

    const isWishlisted = (productId) => wishlist.some(i => i.id === productId);
    const clearCart = () => setCartItems([]);
    const cartTotal = cartItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0);
    const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ cartItems, wishlist, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isWishlisted }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
