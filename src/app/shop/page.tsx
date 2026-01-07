'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/features/ProductCard';
import CartSidebar from '@/components/features/CartSidebar';
import { GardenProduct } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './shop.module.css';

interface CartItem extends GardenProduct {
    cartQuantity: number;
}

export default function ShopPage() {
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tout');

    // Load products from Firestore
    useEffect(() => {
        async function loadProducts() {
            try {
                const prodRef = collection(db, 'garden_products');
                const q = query(prodRef, where('inStock', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as GardenProduct[];

                // Seed some mock data if Firestore is empty for initial UI testing
                if (data.length === 0) {
                    setProducts([
                        { id: '1', name: 'Tomates Cœur de Bœuf', variety: 'Bio - Ancienne', description: 'Chair ferme et savoureuse, idéale pour les salades estivales. Cultivée sans pesticides.', price: 1500, stock: 50, inStock: true, category: 'Légumes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800' },
                        { id: '2', name: 'Poivre de Penja', variety: 'Blanc Premium', description: 'Le meilleur poivre du monde, aux notes animales et mentholées. Indication Géographique Protégée.', price: 4500, stock: 20, inStock: true, category: 'Épices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
                        { id: '3', name: 'Basilic Grand Vert', variety: 'Genovese', description: 'Feuilles larges et parfumées. Le roi du Pesto, récolté le matin même de la livraison.', price: 500, stock: 100, inStock: true, category: 'Aromates', image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?q=80&w=800' },
                        { id: '4', name: 'Poulet Fermier', variety: 'Local', description: 'Élevé en plein air pendant 90 jours. Une chair ferme et un goût authentique.', price: 6500, stock: 15, inStock: true, category: 'Élevage', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800' },
                    ]);
                } else {
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    const addToCart = (product: GardenProduct) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
        setIsSidebarOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) } : item
        ));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

    const filteredProducts = activeCategory === 'Tout'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroBackground}>
                    <img
                        src="/assets/images/garden_hero_bg.jpg"
                        alt="Background"
                        className={styles.heroImg}
                        onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000'}
                    />
                </div>
                <div className={styles.heroOverlay}></div>

                <div className={styles.heroContent}>
                    <span className={styles.tagline}>
                        De la terre à l'assiette
                    </span>
                    <h1 className={styles.title}>
                        L'Épicerie <span className={styles.highlight}>SelecTED</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Découvrez nos produits d'exception, cultivés avec amour dans nos jardins urbains et tracés par notre IA.
                    </p>
                </div>
            </div>

            <div className={styles.toolbarContainer}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    {/* Categories */}
                    <div className={styles.categories}>
                        {['Tout', 'Légumes', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={styles.cartBtn}
                    >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>Mon Panier</span>
                        {cartCount > 0 && (
                            <span className={styles.cartBadge}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className={styles.grid}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} style={{ height: '350px', backgroundColor: 'white', borderRadius: '1rem' }} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredProducts.map((product, index) => (
                            <div key={product.id} style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }}>
                                <ProductCard
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <i className="fa-solid fa-basket-shopping"></i>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Aucun produit dans cette catégorie</h3>
                        <p>Essayez une autre catégorie ou revenez plus tard !</p>
                    </div>
                )}
            </div>

            <CartSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                items={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
            />
        </div>
    );
}
