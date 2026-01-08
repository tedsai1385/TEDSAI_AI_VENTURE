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

    // Filters Simulation state
    const [priceRange, setPriceRange] = useState([500, 10000]);

    const categories = ['Tout', 'Légumes', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'];

    // Load products from Firestore
    useEffect(() => {
        async function loadProducts() {
            setLoading(true); // Ensure loading state starts true
            try {
                const prodRef = collection(db, 'garden_products');
                const q = query(prodRef, where('inStock', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as GardenProduct[];

                // Seed some mock data if Firestore is empty for pretty demo
                if (data.length === 0) {
                    setProducts([
                        { id: '1', name: 'Tomates Cœur de Bœuf', variety: 'Bio - Ancienne', description: 'Chair ferme et savoureuse.', price: 1500, stock: 50, inStock: true, category: 'Légumes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800' },
                        { id: '2', name: 'Poivre de Penja', variety: 'Blanc Premium', description: 'Le meilleur poivre du monde.', price: 4500, stock: 20, inStock: true, category: 'Épices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
                        { id: '3', name: 'Basilic Grand Vert', variety: 'Genovese', description: 'Parfait pour le Pesto.', price: 500, stock: 100, inStock: true, category: 'Aromates', image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?q=80&w=800' },
                        { id: '4', name: 'Poulet Fermier', variety: 'Local', description: 'Élevé en plein air.', price: 6500, stock: 15, inStock: true, category: 'Élevage', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800' },
                        { id: '5', name: 'Avocat Beurre', variety: 'Tropical', description: 'Texture crémeuse.', price: 1000, stock: 40, inStock: true, category: 'Fruits', image: 'https://images.unsplash.com/photo-1523049673856-356a16d1d4d4?q=80&w=800' },
                        { id: '6', name: 'Miel des Savanes', variety: 'Pur', description: 'Récolté localement.', price: 3500, stock: 30, inStock: true, category: 'Épicerie Fine', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800' },
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
            <div className={styles.mainContainer}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Category</h3>
                        <div className={styles.checkboxList}>
                            {categories.filter(c => c !== 'Tout').map(cat => (
                                <label key={cat} className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkboxInput}
                                        checked={activeCategory === cat}
                                        onChange={() => setActiveCategory(activeCategory === cat ? 'Tout' : cat)}
                                    />
                                    {cat} <span style={{ marginLeft: 'auto', color: '#999' }}>(12)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Price</h3>
                        <div className={styles.priceRange}>
                            <input type="range" min="0" max="10000" className="w-full accent-[#00B207]" />
                            <div className={styles.priceRangeInputs}>
                                <div className={styles.priceInput}>
                                    Min: 500
                                </div>
                                <div className={styles.priceInput}>
                                    Max: 10,000
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Rating</h3>
                        <div className={styles.checkboxList}>
                            {[5, 4, 3, 2, 1].map(stars => (
                                <label key={stars} className={styles.checkboxItem}>
                                    <input type="checkbox" className={styles.checkboxInput} />
                                    <span className="flex text-[#FF8A00] gap-1 text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i >= stars ? 'text-gray-300' : ''}`}></i>
                                        ))}
                                    </span>
                                    <span style={{ marginLeft: 'auto', color: '#999' }}>{stars}.0</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={styles.contentArea}>
                    {/* Top Bar */}
                    <div className={styles.topBar}>
                        <button
                            className={styles.filterButtonMobile}
                            onClick={() => alert("Filters Sidebar Mobile")}
                        >
                            Filter <i className="fa-solid fa-sliders"></i>
                        </button>

                        <div className={styles.resultsCount}>
                            Showing 1-{filteredProducts.length} of {products.length} results
                        </div>

                        <div className={styles.sortDropdown}>
                            <span className="text-gray-500 text-sm">Sort by:</span>
                            <select className={styles.sortSelect}>
                                <option>Latest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeCategory !== 'Tout' && (
                        <div className={styles.activeFilters}>
                            <span className={styles.activeLabel}>Active Filter:</span>
                            <div className={styles.filterChip}>
                                {activeCategory} <i className={`fa-solid fa-times ${styles.closeChip}`} onClick={() => setActiveCategory('Tout')}></i>
                            </div>
                            <button className={styles.clearAll} onClick={() => setActiveCategory('Tout')}>
                                Clear All
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {loading ? (
                        <div className={styles.grid}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className={styles.skeleton} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
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
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Aucun produit dans cette catégorie</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <section className={styles.featuresSection}>
                <div className={styles.featuresContainer}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <div className={styles.featureText}>
                            <h4>Free Shipping</h4>
                            <p>Free shipping on all your order</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <div className={styles.featureText}>
                            <h4>Customer Support 24/7</h4>
                            <p>Instant access to Support</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </div>
                        <div className={styles.featureText}>
                            <h4>100% Secure Payment</h4>
                            <p>We ensure your money is save</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <div className={styles.featureText}>
                            <h4>Money-Back Guarantee</h4>
                            <p>30 Days Money-Back Guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className={styles.newsletterSection}>
                <div className={styles.newsletterContent}>
                    <h2 className={styles.newsletterTitle}>Subscribe to our Newsletter</h2>
                    <p className={styles.newsletterSubtitle}>Pellentesque eu nibh eget malesuada cursus ex turpis o.</p>
                    <div className={styles.newsletterForm}>
                        <input type="email" placeholder="Your email address" className={styles.emailInput} />
                        <button className="subscribeBtn" style={{
                            background: '#00B207',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            borderRadius: '50px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer'
                        }}>Subscribe</button>
                    </div>
                </div>
            </section>

            {/* Fab Cart Button (Sticky) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed bottom-8 right-8 bg-[#00B207] text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center gap-2"
            >
                <i className="fa-solid fa-basket-shopping fa-lg"></i>
                {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full absolute -top-2 -right-2 border-2 border-white">
                        {cartCount}
                    </span>
                )}
            </button>


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
