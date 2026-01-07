'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/features/ProductCard';
import CartSidebar from '@/components/features/CartSidebar';
import { GardenProduct } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-[#0A2463] overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/assets/images/garden_hero_bg.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2000'}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A2463]/80 to-[#0A2463]/90"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-sm font-semibold tracking-wider uppercase mb-2">
                        De la terre à l'assiette
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        L'Épicerie <span className="text-green-400">SelecTED</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
                        Découvrez nos produits d'exception, cultivés avec amour dans nos jardins urbains et tracés par notre IA.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar mask-gradient">
                        {['Tout', 'Légumes', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${activeCategory === cat
                                        ? 'bg-[#0A2463] text-white shadow-md transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#0A2463]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="group relative flex items-center gap-3 bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <i className="fa-solid fa-cart-shopping text-xl"></i>
                        <span className="hidden md:inline">Mon Panier</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100 shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                            <i className="fa-solid fa-basket-shopping text-6xl text-gray-300"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-500 mb-2">Aucun produit dans cette catégorie</h3>
                        <p className="text-gray-400">Essayez une autre catégorie ou revenez plus tard !</p>
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
