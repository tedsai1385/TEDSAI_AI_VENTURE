'use client';

import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminGuard from '@/components/admin/AdminGuard';
import ProductForm from '@/components/admin/ProductForm';
import PostEditor from '@/components/admin/PostEditor';
import { collection, deleteDoc, doc, onSnapshot, query, orderBy, getDocs, limit, where } from 'firebase/firestore';
import Link from 'next/link';
import { GardenProduct } from '@/types';
import { db } from '@/lib/firebase/config';

// Legacy-style StatCard
const StatCard = ({ label, value, sub, color = "text-slate-900", id }: any) => (
    <div className="stat-card fade-in" id={id}>
        <div className="stat-label">{label}</div>
        <div className={`stat-value ${color}`}>{value}</div>
        <div className="stat-sub">{sub}</div>
    </div>
);

export default function AdminDashboardPage() {
    const [activeView, setActiveView] = useState('dashboard');
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GardenProduct | null>(null);

    // New State for Activity Log & Alerts
    const [activityLog, setActivityLog] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);

    // Mock Data for Activity/Alerts (Since backend logging isn't fully implemented yet)
    useEffect(() => {
        setActivityLog([
            { id: 1, user: 'Franck V.', action: 'Connexion Admin', module: 'Auth', date: 'À l\'instant' },
            { id: 2, user: 'Système', action: 'Backup Auto', module: 'System', date: 'Il y a 2h' },
            { id: 3, user: 'Admin Resto', action: 'Nouveau Plat', module: 'Restaurant', date: 'Il y a 4h' },
        ]);

        setAlerts([
            { id: 1, type: 'critical', message: 'Espace disque serveur > 80%', icon: 'fa-triangle-exclamation', color: 'text-red-600' },
            { id: 2, type: 'warning', message: 'Mise à jour de sécurité disponible', icon: 'fa-circle-info', color: 'text-yellow-600' }
        ]);
    }, []);

    // ... (Existing useEffects for Products and Blogs remain the same) ...
    // Fetch Products Real-time
    useEffect(() => {
        const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GardenProduct[];
            setProducts(data);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Blog Posts
    useEffect(() => {
        if (activeView === 'blog' || activeView === 'dashboard') { // Also fetch for dashboard stats
            const fetchBlog = async () => {
                const q = query(collection(db, 'observatoire_posts'), orderBy('createdAt', 'desc'));
                const snap = await getDocs(q);
                setBlogPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            };
            fetchBlog();
        }
    }, [activeView, isPostEditorOpen]);

    const handleDeleteProduct = async (id: string | undefined) => {
        if (!id) return;
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            await deleteDoc(doc(db, 'garden_products', id));
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            await deleteDoc(doc(db, 'observatoire_posts', id));
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
            <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                {/* Sidebar is handled by Layout now, but checking if this page replaces Layout contents? 
                     Actually AdminLayout wraps this. The sidebar in AdminLayout needs to be checked, 
                     but here we just render the MAIN content. 
                     Wait, AdminLayout renders Sidebar AND children. 
                     So this page only needs to render the dashboard CONTENT.
                     BUT, the legacy HTML has specific classes for the wrapper. 
                     Let's assume AdminLayout handles the outer shell correct-enough, 
                     or we might need to adjust Layout styles.
                     For now, we focus on the Dashboard View styles.
                 */}

                {/* Re-implementing the inner dashboard view to match legacy 'content-area' */}
                <div className="flex-1 overflow-y-auto p-8 fade-in">

                    {/* DASHBOARD VIEW */}
                    {activeView === 'dashboard' && (
                        <div className="space-y-6">

                            {/* KPI GRID */}
                            <div className="stats-grid">
                                <StatCard label="Utilisateurs Total" value="1,240" sub="+12% ce mois" id="kpi-users" />
                                <StatCard label="Admins Actifs" value="4" sub="Sur 5 rôles" id="kpi-admins" color="text-blue-600" />
                                <StatCard label="Contenus Publiés" value={blogPosts.length} sub="Articles Observatoire" id="kpi-content" color="text-purple-600" />
                                <StatCard label="État Système" value="Opérationnel" sub="Tout fonctionne" color="text-green-500" />
                            </div>

                            {/* RECENT ACTIVITY & ALERTS SPLIT */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Activity Log */}
                                <div className="card-table lg:col-span-2">
                                    <div className="card-header">
                                        <h3>Activité Récente</h3>
                                        <button className="text-blue-500 text-sm hover:underline">Tout voir</button>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Utilisateur</th>
                                                <th>Action</th>
                                                <th>Module</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activityLog.map((log) => (
                                                <tr key={log.id}>
                                                    <td>
                                                        <div className="font-medium text-slate-700">{log.user}</div>
                                                    </td>
                                                    <td>{log.action}</td>
                                                    <td><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{log.module}</span></td>
                                                    <td className="text-slate-400 text-xs">{log.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* System Alerts */}
                                <div className="card-table">
                                    <div className="card-header">
                                        <h3>⚠️ Alertes Système</h3>
                                    </div>
                                    <div className="p-5">
                                        {alerts.map((alert) => (
                                            <div key={alert.id} className={`alert-item ${alert.type}`}>
                                                <i className={`fa-solid ${alert.icon} alert-icon ${alert.color}`}></i>
                                                <div>
                                                    <div className={`text-sm font-semibold ${alert.color} mb-1`}>
                                                        {alert.type === 'critical' ? 'Critique' : 'Attention'}
                                                    </div>
                                                    <div className="text-xs text-slate-600">{alert.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* QUICK ACTIONS ROW (Legacy style) */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Accès Rapide Modules</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Link href="/admin/restaurant" className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <i className="fa-solid fa-utensils"></i>
                                        </div>
                                        <span className="font-semibold text-gray-700">Restaurant</span>
                                    </Link>
                                    <Link href="/admin/garden" className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <i className="fa-solid fa-leaf"></i>
                                        </div>
                                        <span className="font-semibold text-gray-700">Garden</span>
                                    </Link>
                                    <Link href="/admin/ia" className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <i className="fa-solid fa-brain"></i>
                                        </div>
                                        <span className="font-semibold text-gray-700">Services IA</span>
                                    </Link>
                                    <Link href="/admin/settings" className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                            <i className="fa-solid fa-cog"></i>
                                        </div>
                                        <span className="font-semibold text-gray-700">Paramètres</span>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* RESTAURANT VIEW (Now Redirected but kept for parity if using in-page view, 
                        BUT user structure is /admin/restaurant. So we just link there. 
                        However for 'activeView === shop' which was generic products, we keep it here or merge with restaurant/garden? 
                        The legacy dashboard had separate modules. 
                        To keep it simple and robust, we will remove the partial views (shop, etc) from here 
                        if they are covered by the new specific pages, OR we reimplement them using the new visual style.
                        
                        Let's keep 'shop' (General Products) for now as it handles 'Garden Products' generally.
                    */}

                    {activeView === 'shop' && (
                        <div className="space-y-6 fade-in">
                            <div className="card-header bg-white rounded-t-xl border-b-0">
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <h3 className="text-lg font-bold">Catalogue Global</h3>
                                        <p className="text-sm text-gray-500">Vue d'ensemble des produits du jardin</p>
                                    </div>
                                    <button onClick={handleNewProduct} className="bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 transition">
                                        <i className="fa-solid fa-plus mr-2"></i> Nouveau
                                    </button>
                                </div>
                            </div>

                            <div className="card-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Catégorie</th>
                                            <th>Prix</th>
                                            <th>Stock</th>
                                            <th>Statut</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <img src={p.image} className="w-10 h-10 rounded object-cover border" />
                                                        <span className="font-semibold text-slate-700">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="px-2 py-1 bg-slate-100 rounded text-xs">{p.category}</span></td>
                                                <td className="font-mono">{p.price} XAF</td>
                                                <td>{p.stock}</td>
                                                <td>
                                                    {p.inStock ?
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">En Stock</span> :
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Épuisé</span>
                                                    }
                                                </td>
                                                <td className="text-right">
                                                    <button onClick={() => handleEditProduct(p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"><i className="fa-solid fa-pen"></i></button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><i className="fa-solid fa-trash"></i></button>
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
                        <div className="space-y-6 fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Blog & Actualités</h3>
                                <button onClick={() => setIsPostEditorOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded shadow-sm hover:bg-purple-700 transition">
                                    <i className="fa-solid fa-pen-nib mr-2"></i> Rédiger
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {blogPosts.map(post => (
                                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                                        <div className="h-40 bg-gray-100 relative">
                                            <img src={post.image} className="w-full h-full object-cover" />
                                            <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-purple-700">{post.category}</span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-800 mb-2 truncate">{post.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{post.excerpt}</p>
                                            <div className="flex justify-between items-center border-t pt-3 mt-auto">
                                                <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                <button onClick={() => handleDeletePost(post.id)} className="text-red-500 text-xs hover:underline">Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODALS */}
                {isProductFormOpen && (
                    <ProductForm
                        initialData={editingProduct}
                        onClose={() => setIsProductFormOpen(false)}
                        onSuccess={() => setIsProductFormOpen(false)}
                    />
                )}
                {isPostEditorOpen && (
                    <PostEditor
                        onClose={() => setIsPostEditorOpen(false)}
                        onSuccess={() => setIsPostEditorOpen(false)}
                    />
                )}
            </div>
        </AdminGuard>
    );
}
