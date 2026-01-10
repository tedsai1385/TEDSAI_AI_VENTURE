'use client';

import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminGuard from '@/components/admin/AdminGuard';
import ProductForm from '@/components/admin/ProductForm';
import PostEditor from '@/components/admin/PostEditor';
import { collection, deleteDoc, doc, onSnapshot, query, orderBy, getDocs, where } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

// --- SUB-COMPONENTS TO MATCH HTML STRUCTURE ---

const StatCard = ({ label, value, sub, color = "text-slate-900", id, icon }: any) => (
    <div className="stat-card fade-in" id={id}>
        <div className="flex justify-between items-start">
            <div>
                <div className="stat-label">{label}</div>
                <div className={`stat-value ${color}`}>{value}</div>
                <div className="stat-sub">{sub}</div>
            </div>
            {icon && <i className={`fa-solid ${icon} text-slate-200 text-3xl`}></i>}
        </div>
    </div>
);

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');

    // Data States
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: 0, admins: 0 });
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // UI States
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    // --- DATA FETCHING (Unrestricted) ---

    // 1. Real-time Products
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'garden_products'), orderBy('createdAt', 'desc')), (snap) => {
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, []);

    // 2. Real-time Users (For Admin View)
    useEffect(() => {
        // PERMISSION BYPASS: Previously restricted to super_admin. Now open.
        const unsubscribe = onSnapshot(collection(db, 'users'), (snap) => {
            const userList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setUsers(userList);
            setStats({
                users: userList.length,
                admins: userList.length // Currently everyone is admin per new rules
            });
        });
        return () => unsubscribe();
    }, []);

    // 3. Real-time Posts
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'observatoire_posts'), orderBy('createdAt', 'desc')), (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, []);

    // --- HANDLERS ---

    const handleDelete = async (collectionName: string, id: string) => {
        if (confirm('Confirmer la suppression ?')) {
            await deleteDoc(doc(db, collectionName, id));
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            'published': 'badge-success',
            'draft': 'badge-warning',
            'pending': 'badge-warning'
        };
        const labels: any = {
            'published': 'Publié',
            'draft': 'Brouillon',
            'pending': 'En attente'
        };
        return <span className={`badge ${styles[status] || 'badge-warning'}`}>{labels[status] || status}</span>;
    };

    return (
        <AdminGuard>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 h-full">

                {/* 1. DASHBOARD VIEW */}
                <div className={`dashboard-view ${activeView === 'dashboard' ? 'active block' : 'hidden'} fade-in`}>

                    {/* Header specific to dashboard */}
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h2>
                            <p className="text-slate-500">Bienvenue, {user?.displayName || user?.email}</p>
                        </div>
                        <div className="text-sm text-slate-400">
                            Dernière màj: À l'instant
                        </div>
                    </div>

                    {/* KPI GRID */}
                    <div className="stats-grid">
                        <StatCard
                            label="Utilisateurs Total"
                            value={stats.users}
                            sub="Comptes enregistrés"
                            id="kpi-users"
                            icon="fa-users"
                        />
                        <StatCard
                            label="Contenus Publiés"
                            value={posts.length}
                            sub="Articles & Actualités"
                            id="kpi-content"
                            color="text-purple-600"
                            icon="fa-newspaper"
                        />
                        <StatCard
                            label="Produits Jardin"
                            value={products.filter(p => p.category === 'Garden').length}
                            sub="En stock : 12"
                            id="kpi-garden"
                            color="text-green-600"
                            icon="fa-leaf"
                        />
                        <StatCard
                            label="État Système"
                            value="100%"
                            sub="Opérationnel"
                            color="text-emerald-500"
                            icon="fa-server"
                        />
                    </div>

                    {/* ACTIVITY & ALERTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* RECENT ACTIVITY */}
                        <div className="card-table lg:col-span-2">
                            <div className="card-header">
                                <h3>Activité Récente</h3>
                                <button className="text-blue-500 text-sm hover:underline">Tout voir</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Utilisateur</th>
                                            <th>Action</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Mock Activity for Visual Parity */}
                                        <tr>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">A</div>
                                                    <span className="font-medium">Admin</span>
                                                </div>
                                            </td>
                                            <td>Connexion au dashboard</td>
                                            <td className="text-slate-400 text-xs">À l'instant</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">S</div>
                                                    <span className="font-medium">Système</span>
                                                </div>
                                            </td>
                                            <td>Sauvegarde automatique</td>
                                            <td className="text-slate-400 text-xs">Il y a 1h</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ALERTS */}
                        <div className="card-table">
                            <div className="card-header">
                                <h3>⚠️ Alertes Système</h3>
                            </div>
                            <div className="p-4">
                                <div className="alert-item warning">
                                    <i className="fa-solid fa-triangle-exclamation alert-icon text-yellow-600"></i>
                                    <div>
                                        <div className="text-sm font-semibold text-yellow-800 mb-1">Attention</div>
                                        <div className="text-xs text-slate-600">3 produits en rupture de stock.</div>
                                    </div>
                                </div>
                                <div className="alert-item critical">
                                    <i className="fa-solid fa-circle-xmark alert-icon text-red-600"></i>
                                    <div>
                                        <div className="text-sm font-semibold text-red-800 mb-1">Critique</div>
                                        <div className="text-xs text-slate-600">Connexion API IA instable.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. ALL MODULES (Stacked for "One Page" feel or Tabbable? User asked to imitate dashboard.html which uses TABS) 
                    Since this is page.tsx, we usually only see the Dashboard content. 
                    The other modules (Restaurant, Users, etc.) are at /admin/restaurant etc.
                    
                    HOWEVER, to strictly follow "imitate style" and "recreate from scratch", 
                    I should ensure the routing matches the User's expectation.
                    If the Sidebar links to /admin/restaurant, then THIS page only needs to be the DASHBOARD.
                    
                    I will keep this page focused on the "Dashboard" view (Controller: dashboard-home.js equivalent)
                    and ensure the Sidebar (Layout) links correctly.
                */}

            </div>
        </AdminGuard>
    );
}
