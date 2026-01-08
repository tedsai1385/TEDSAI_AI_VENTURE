'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GardenProduct } from '@/types';
import ProductCard from '@/components/features/ProductCard';
import CartSidebar from '@/components/features/CartSidebar';
import styles from './shop.module.css';

interface CartItem extends GardenProduct {
    cartQuantity: number;
}

function ShopContent() {
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tout');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
        type: null,
        message: ''
    });
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: ''
    });

    const categories = ['Tout', 'Légumes', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'];

    // Load products from Firestore
    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            try {
                const q = query(collection(db, 'garden_products'), where('inStock', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GardenProduct[];

                // Fallback mock data if Firestore is empty
                if (data.length === 0) {
                    setProducts([
                        { id: '1', name: 'Tomates Cœur de Bœuf', variety: 'Bio', description: 'Chair ferme et savoureuse', price: 1500, stock: 50, inStock: true, category: 'Légumes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800' },
                        { id: '2', name: 'Poivre de Penja', variety: 'Premium', description: 'Le meilleur poivre du monde', price: 4500, stock: 20, inStock: true, category: 'Épices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
                        { id: '3', name: 'Basilic Grand Vert', variety: 'Genovese', description: 'Parfait pour le Pesto', price: 500, stock: 100, inStock: true, category: 'Aromates', image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?q=80&w=800' },
                        { id: '4', name: 'Poulet Fermier', variety: 'Local', description: 'Élevé en plein air', price: 6500, stock: 15, inStock: true, category: 'Élevage', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800' },
                        { id: '5', name: 'Avocat Beurre', variety: 'Tropical', description: 'Texture crémeuse', price: 1000, stock: 40, inStock: true, category: 'Fruits', image: 'https://images.unsplash.com/photo-1523049673856-356a16d1d4d4?q=80&w=800' },
                        { id: '6', name: 'Miel des Savanes', variety: 'Pur', description: 'Récolté localement', price: 3500, stock: 30, inStock: true, category: 'Épicerie Fine', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800' },
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

        // Restore cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Invalid cart data');
            }
        }
    }, []);

    // Handle Stripe redirect feedback
    useEffect(() => {
        if (!searchParams) return;

        const success = searchParams.get('success');
        const canceled = searchParams.get('canceled');

        if (success) {
            setFeedback({
                type: 'success',
                message: '🎉 Merci pour votre commande ! Votre paiement a été validé avec succès.'
            });
            setCart([]);
            localStorage.removeItem('cart');
        } else if (canceled) {
            setFeedback({
                type: 'error',
                message: '❌ Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.'
            });
        }
    }, [searchParams]);

    // Cart functions
    const addToCart = (product: GardenProduct) => {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        let newCart: CartItem[];

        if (existingIndex > -1) {
            newCart = [...cart];
            newCart[existingIndex].cartQuantity += 1;
        } else {
            newCart = [...cart, { ...product, cartQuantity: 1 }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));

        // Show toast
        setToast({ visible: true, message: `✨ ${product.name} ajouté au panier !` });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);

        setIsSidebarOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        const newCart = cart.map(item =>
            item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) } : item
        );
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (id: string) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Computed values
    const filteredProducts = activeCategory === 'Tout'
        ? products
        : products.filter(p => p.category === activeCategory);

    const getCategoryCount = (cat: string) => {
        if (cat === 'Tout') return products.length;
        return products.filter(p => p.category === cat).length;
    };

    const cartCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

    return (
        <div className={styles.modernShop}>
            <div className={styles.container}>
                {/* Animated Gradient Header */}
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>🛒 Shop</h1>
                        <div className={styles.breadcrumbs}>
                            Home &gt; <span>Shop</span>
                        </div>
                    </div>
                </header>

                {/* Feedback Banner */}
                {feedback.type && (
                    <div className={styles.feedback}>
                        <div className={`${styles.feedbackContent} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
                            <div className={styles.feedbackText}>
                                <i className={`fa-solid ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                                <span>{feedback.message}</span>
                            </div>
                            <button className={styles.feedbackClose} onClick={() => setFeedback({ type: null, message: '' })}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className={styles.main}>
                    {/* Sidebar Filters */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Catégories</h3>
                            <div className={styles.filterList}>
                                {categories.map(cat => (
                                    <label key={cat} className={styles.filterItem}>
                                        <input
                                            type="checkbox"
                                            checked={activeCategory === cat}
                                            onChange={() => setActiveCategory(activeCategory === cat ? 'Tout' : cat)}
                                        />
                                        <span>{cat}</span>
                                        <span style={{ marginLeft: 'auto', color: '#999', fontSize: '0.85rem' }}>
                                            ({getCategoryCount(cat)})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className={styles.content}>
                        <div className={styles.topBar}>
                            <div className={styles.resultsCount}>
                                <span>{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.grid}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={styles.skeleton} />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className={styles.grid}>
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <h3>🔍 Aucun produit trouvé</h3>
                                <p>Essayez une autre catégorie pour découvrir nos produits</p>
                                <button className={styles.emptyButton} onClick={() => setActiveCategory('Tout')}>
                                    Voir tous les produits
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart FAB */}
                <button className={styles.cartFab} onClick={() => setIsSidebarOpen(true)}>
                    <i className="fa-solid fa-basket-shopping fa-xl"></i>
                    {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                </button>

                {/* Toast */}
                {toast.visible && (
                    <div className={styles.toast}>
                        <i className="fa-solid fa-cart-plus" style={{ color: '#00B207' }}></i>
                        <span>{toast.message}</span>
                    </div>
                )}

                {/* Cart Sidebar */}
                <CartSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                />
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #00B207 0%, #00D609 100%)',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600'
            }}>
                ✨ Chargement...
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
