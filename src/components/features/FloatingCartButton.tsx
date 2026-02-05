'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import styles from './FloatingCartButton.module.css';

interface FloatingCartButtonProps {
    onClick: () => void;
}

import { ShoppingBasket } from 'lucide-react';

export default function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    if (itemCount === 0) return null;

    return (
        <div
            className={styles.floatingCart}
            onClick={onClick}
            title="Voir mon panier"
        >
            <ShoppingBasket size={28} strokeWidth={2.5} />
            <div className={styles.badge}>
                {itemCount}
            </div>
        </div>
    );
}
