'use client';

/**
 * SHOP PAGE - PREMIUM REBUILD
 * Features:
 * - Real-time Firestore usage
 * - Filter by category
 * - Persistent Cart (localStorage)
 * - Stripe Integration prepared
 * - Animations & Micro-interactions
 */

import React, { useState, useEffect, Suspense } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GardenProduct } from '@/types';
import styles from './shop.module.css';
import CartSidebar from '@/components/features/CartSidebar';

// Loading Component
const LoadingSkeleton = () => (
    <div className={styles.loadingGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeleton}></div>
        ))}
    </div>
);

// Main Content Component
const ShopContent = () => {
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    // 1. Fetch Products
    useEffect(() => {
        const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GardenProduct[];
            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Load Cart from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('tedsai_cart');
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    // 3. Save Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('tedsai_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Cart Logic
    const addToCart = (product: GardenProduct) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
        // Feedback could be added here (toast)
        setCartOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // Filter Logic
    const categories = ['all', 'Légumes', 'Fruits', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'];
    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    // Categories Counts
    const getCount = (cat: string) => {
        if (cat === 'all') return products.length;
        return products.filter(p => p.category === cat).length;
    };

    return (
        <div className={styles.modernShop}>
            {/* Header */}
            <header className={styles.shopHeader}>
                <div className={`${styles.shopContainer} ${styles.headerContent}`}>
                    <div className={styles.badge}>
                        <i className="fa-solid fa-leaf"></i> 100% Bio & Local
                    </div>
                    <h1 className={styles.shopTitle}>Le Marché TEDSAI</h1>
                    <p className={styles.shopSubtitle}>
                        Découvrez nos produits frais, nos épices rares et nos solutions d'élevage.
                        Directement de nos jardins à votre table.
                    </p>
                </div>
            </header>

            {/* Main Layout */}
            <main className={`${styles.shopContainer} ${styles.mainLayout}`}>

                {/* Sidebar */}
                <aside className={styles.filtersPanel}>
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Catégories</h3>
                        <ul className={styles.categoryList}>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <span>{cat === 'all' ? 'Tout le catalogue' : cat}</span>
                                        <span className={styles.countBadge}>{getCount(cat)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Grid */}
                <section>
                    {loading ? <LoadingSkeleton /> : (
                        filteredProducts.length > 0 ? (
                            <div className={styles.productGrid}>
                                {filteredProducts.map(product => (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.imgWrapper}>
                                            <span className={styles.stockBadge}>
                                                {product.inStock ? 'En Stock' : 'Épuisé'}
                                            </span>
                                            <img
                                                src={product.image || 'https://via.placeholder.com/400'}
                                                alt={product.name}
                                                className={styles.productImg}
                                            />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <span className={styles.catTag}>{product.category}</span>
                                            <h3 className={styles.prodTitle}>{product.name}</h3>
                                            <p className={styles.prodDesc}>{product.description}</p>

                                            <div className={styles.cardFooter}>
                                                <div className={styles.price}>
                                                    {product.price.toLocaleString()} XAF
                                                    <span> / {product.unit || 'unité'}</span>
                                                </div>
                                                <button
                                                    className={styles.addBtn}
                                                    onClick={() => addToCart(product)}
                                                    disabled={!product.inStock}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <i className="fa-regular fa-folder-open"></i>
                                <h3>Aucun produit trouvé</h3>
                                <p>Essayez de changer de catégorie.</p>
                            </div>
                        )
                    )}
                </section>

            </main>

            {/* Cart FAB */}
            <button className={styles.cartFab} onClick={() => setCartOpen(true)}>
                <i className="fa-solid fa-basket-shopping fa-lg"></i>
                {cartItems.length > 0 && (
                    <span className={styles.cartCount}>
                        {cartItems.reduce((acc, item) => acc + item.cartQuantity, 0)}
                    </span>
                )}
            </button>

            {/* Cart Sidebar */}
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
            />
        </div>
    );
};

export default function ShopPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ShopContent />
        </Suspense>
    );
}
