'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/features/ProductCard';
import CartSidebar from '@/components/features/CartSidebar';
import { GardenProduct } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './shop.module.css';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface CartItem extends GardenProduct {
    cartQuantity: number;
}

function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tout');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [toast, setToast] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });

    const showToast = (message: string) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    };

    // Handle Stripe redirect status
    useEffect(() => {
        if (!searchParams) return;

        const success = searchParams.get('success');
        const canceled = searchParams.get('canceled');

        if (success) {
            setFeedback({ type: 'success', message: 'Merci pour votre commande ! Votre paiement a été validé avec succès.' });
            setCart([]); // Clear cart on success
            localStorage.removeItem('cart');
        } else if (canceled) {
            setFeedback({ type: 'error', message: 'Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.' });
        }
    }, [searchParams]);

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
        const itemIndex = cart.findIndex(item => item.id === product.id);
        let newCart;
        if (itemIndex > -1) {
            newCart = [...cart];
            newCart[itemIndex].cartQuantity += 1;
        } else {
            newCart = [...cart, { ...product, cartQuantity: 1 }];
        }
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        showToast(`${product.name} ajouté au panier !`);
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

    // Calculate dynamic category counts
    const getCategoryCount = (categoryName: string) => {
        if (categoryName === 'Tout') return products.length;
        return products.filter(p => p.category === categoryName).length;
    };

    return (
        <div className={styles.pageContainer}>
            {/* Shop Header (Breadcrumbs) */}
            <header className={styles.shopHeader}>
                <div className="container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h1 className={styles.shopTitle}>Shop</h1>
                    <div className={styles.breadcrumbs}>
                        Home <span>&gt;</span> <span className={styles.activeBreadcrumb}>Shop</span>
                    </div>
                </div>
            </header>

            {/* Feedback Message */}
            {feedback.type && (
                <div className="container" style={{ maxWidth: '1320px', margin: '1rem auto' }}>
                    <div className={`p-4 rounded-lg flex items-center justify-between ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                        } border`}>
                        <div className="flex items-center gap-3">
                            <i className={`fa-solid ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                            <span className="font-medium">{feedback.message}</span>
                        </div>
                        <button onClick={() => setFeedback({ type: null, message: '' })} className="hover:opacity-70">
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.mainContainer}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Category</h3>
                        <div className={styles.checkboxList}>
                            {categories.map(cat => (
                                <label key={cat} className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkboxInput}
                                        checked={activeCategory === cat}
                                        onChange={() => setActiveCategory(activeCategory === cat ? 'Tout' : cat)}
                                    />
                                    {cat} <span style={{ marginLeft: 'auto', color: '#999' }}>({getCategoryCount(cat)})</span>
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
                            Showing {filteredProducts.length} results
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
                            {[1, 2, 3, 4].map(i => (
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

            {/* Fab Cart Button (Sticky) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed bg-[#00B207] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center gap-2"
                style={{
                    bottom: '80px', /* Raised to avoid Footer overlap */
                    right: '30px',
                    zIndex: 9999, /* High z-index */
                    width: '60px',
                    height: '60px'
                }}
            >
                <div className="relative">
                    <i className="fa-solid fa-basket-shopping fa-xl"></i>
                    {cartCount > 0 && (
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                            {cartCount}
                        </span>
                    )}
                </div>
            </button>

            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#333] text-white px-6 py-3 rounded-full shadow-2xl z-[10000] flex items-center gap-3 animate-bounce">
                    <i className="fa-solid fa-cart-plus text-[#00B207]"></i>
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

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

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <ShopContent />
        </Suspense>
    );
}
