'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Cart } from '@/types';

interface CartContextType {
    cart: Cart;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    applyPromoCode: (code: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.19; // 19% TVA Cameroun
const SHIPPING_COST = 2000; // 2000 FCFA livraison standard

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('tedsai_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setCart(parsed);
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('tedsai_cart', JSON.stringify(cart));
    }, [cart]);

    // Recalculate totals
    const recalculateCart = (items: CartItem[], discount = 0, promoCode?: string) => {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = items.length > 0 ? SHIPPING_COST : 0;
        const tax = Math.round((subtotal - discount) * TAX_RATE);
        const total = subtotal + tax + shipping - discount;

        setCart({
            items,
            subtotal,
            tax,
            shipping,
            discount,
            total,
            promoCode,
        });
    };

    const addItem = (item: CartItem) => {
        const existingIndex = cart.items.findIndex(i => i.productId === item.productId);

        let newItems: CartItem[];
        if (existingIndex >= 0) {
            // Update quantity if item exists
            newItems = [...cart.items];
            newItems[existingIndex].quantity += item.quantity;
        } else {
            // Add new item
            newItems = [...cart.items, item];
        }

        recalculateCart(newItems, cart.discount, cart.promoCode);
    };

    const removeItem = (productId: string) => {
        const newItems = cart.items.filter(item => item.productId !== productId);
        recalculateCart(newItems, cart.discount, cart.promoCode);
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        const newItems = cart.items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        );
        recalculateCart(newItems, cart.discount, cart.promoCode);
    };

    const clearCart = () => {
        setCart({
            items: [],
            total: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
        });
    };

    const applyPromoCode = async (code: string): Promise<boolean> => {
        try {
            // Call API to validate promo code
            const response = await fetch('/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, subtotal: cart.subtotal }),
            });

            if (!response.ok) return false;

            const { discount } = await response.json();
            recalculateCart(cart.items, discount, code);
            return true;

        } catch (error) {
            console.error('Error applying promo code:', error);
            return false;
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            applyPromoCode,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
