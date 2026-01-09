'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import ProductForm from '@/components/admin/ProductForm';
import PostEditor from '@/components/admin/PostEditor';
import { collection, deleteDoc, doc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GardenProduct } from '@/types';

// Stats Card Component
const StatCard = ({ label, value, sub, color = "text-slate-900" }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-400 mt-2">{sub}</div>
    </div>
);

export default function AdminDashboardPage() {
    const [activeView, setActiveView] = useState('dashboard');
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GardenProduct | null>(null);

    // Fetch Products Real-time
    useEffect(() => {
        const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GardenProduct[];
            setProducts(data);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Blog Posts Logic (On demand when view is blog)
    useEffect(() => {
        if (activeView === 'blog') {
            const fetchBlog = async () => {
                const q = query(collection(db, 'observatoire_posts'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                setBlogPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            };
            fetchBlog();
        }
    }, [activeView, isPostEditorOpen]); // Refresh when editor closes

    const handleDeleteProduct = async (id: string | undefined) => {
        if (!id) return;
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            await deleteDoc(doc(db, 'garden_products', id));
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            await deleteDoc(doc(db, 'observatoire_posts', id));
            // Refresh list manually for simplicity or set up listener
            setBlogPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleEditProduct = (product: GardenProduct) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };

    const handleNewProduct = () => {
        setEditingProduct(null);
        setIsProductFormOpen(true);
    };

    return (
        <AdminGuard>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Sidebar Simple */}
                <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-lg">
                    <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-3">
                        <i className="fa-solid fa-cube text-blue-500"></i> TED ADMIN
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-chart-pie w-6"></i> Tableau de bord
                        </button>
                        <button
                            onClick={() => setActiveView('shop')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'shop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-store w-6"></i> Boutique / Produits
                        </button>
                        <button
                            onClick={() => setActiveView('blog')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'blog' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-newspaper w-6"></i> Blog / Actus
                        </button>
                        <button
                            onClick={() => setActiveView('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-users w-6"></i> Utilisateurs
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Header */}
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                            {activeView === 'dashboard' ? 'Vue d\'ensemble' : activeView === 'shop' ? 'Gestion Boutique' : activeView === 'blog' ? 'Blog & Analyses' : 'Utilisateurs'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> En ligne
                            </span>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* DASHBOARD VIEW */}
                        {activeView === 'dashboard' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard label="Produits en vente" value={products.length} sub="Catalogue actuel" color="text-blue-600" />
                                    <StatCard label="Articles publiés" value={blogPosts.length > 0 ? blogPosts.length : "..."} sub="Observatoire" color="text-purple-600" />
                                    <StatCard label="Visiteurs" value="1,240" sub="+12% ce mois" />
                                    <StatCard label="État Système" value="Opérationnel" color="text-green-500" sub="Tout fonctionne" />
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Derniers produits ajoutés</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {products.slice(0, 3).map(p => (
                                            <div key={p.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
                                                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                                                <div>
                                                    <div className="font-bold text-sm text-gray-800">{p.name}</div>
                                                    <div className="text-xs text-gray-500">{p.price} XAF</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SHOP / PRODUCTS VIEW */}
                        {activeView === 'shop' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Catalogue Produits</h3>
                                        <p className="text-sm text-gray-500">Gérez les produits visibles sur la page Shop</p>
                                    </div>
                                    <button
                                        onClick={handleNewProduct}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <i className="fa-solid fa-plus"></i> Nouveau Produit
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                            <tr>
                                                <th className="px-6 py-3 text-left">Image</th>
                                                <th className="px-6 py-3 text-left">Nom</th>
                                                <th className="px-6 py-3 text-left">Catégorie</th>
                                                <th className="px-6 py-3 text-left">Prix</th>
                                                <th className="px-6 py-3 text-left">Stock</th>
                                                <th className="px-6 py-3 text-left">Statut</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {products.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                        Aucun produit trouvé. Ajoutez votre premier produit !
                                                    </td>
                                                </tr>
                                            ) : products.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover shadow-sm bg-white" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.variety}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-sm text-gray-700">
                                                        {product.price.toLocaleString()} XAF
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {product.stock}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.inStock ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">En stock</span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Épuisé</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditProduct(product)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* BLOG VIEW */}
                        {activeView === 'blog' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Articles & Analyses</h3>
                                        <p className="text-sm text-gray-500">Publiez du contenu pour l'Observatoire</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPostEditorOpen(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <i className="fa-solid fa-pen-nib"></i> Nouvel Article
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogPosts.map(post => (
                                        <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                            <div className="h-48 bg-gray-200 relative">
                                                <img src={post.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt={post.title} />
                                                <span className="absolute top-2 left-2 bg-white/90 text-purple-700 text-xs font-bold px-2 py-1 rounded-md">{post.category}</span>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h4>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{post.excerpt}</p>
                                                <div className="mt-auto flex justify-between items-center text-xs text-gray-400 border-t pt-3">
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-700">
                                                        <i className="fa-solid fa-trash"></i> Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {blogPosts.length === 0 && (
                                        <div className="col-span-full text-center py-12 text-gray-400">
                                            Aucun article publié.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* USERS VIEW PLACEHOLDER */}
                        {activeView === 'users' && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <i className="fa-solid fa-users-gear text-6xl mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-600">Module Utilisateurs</h3>
                                <p>Gestion des rôles et accès bientôt disponible.</p>
                            </div>
                        )}

                    </div>
                </main>

                {/* MODALS */}
                {isProductFormOpen && (
                    <ProductForm
                        initialData={editingProduct}
                        onClose={() => setIsProductFormOpen(false)}
                        onSuccess={() => {
                            setIsProductFormOpen(false);
                            // Toast or refresh handled by onSnapshot
                        }}
                    />
                )}
                {isPostEditorOpen && (
                    <PostEditor
                        onClose={() => setIsPostEditorOpen(false)}
                        onSuccess={() => {
                            setIsPostEditorOpen(false);
                            // Set active view to trigger refresh if needed
                            // Logic handled by useEffect dependency
                        }}
                    />
                )}
            </div>
        </AdminGuard>
    );
}
