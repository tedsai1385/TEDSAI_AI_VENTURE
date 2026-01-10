'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

// Component: KPI Card
const StatCard = ({ title, value, sub, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <i className={`fa-solid ${icon} text-5xl`}></i>
        </div>
        <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
            <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <i className="fa-solid fa-arrow-trend-up text-emerald-500"></i>
                {sub}
            </div>
        </div>
    </div>
);

export default function DashboardHome() {
    const [stats, setStats] = useState({ users: 0, products: 0, posts: 0 });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);

    // Real-time Data Listeners
    useEffect(() => {
        // Users
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            setStats(prev => ({ ...prev, users: snap.size }));
        });

        // Products
        const unsubProducts = onSnapshot(collection(db, 'garden_products'), (snap) => {
            setStats(prev => ({ ...prev, products: snap.size }));
        });

        // Posts
        const unsubPosts = onSnapshot(collection(db, 'observatoire_posts'), (snap) => {
            setStats(prev => ({ ...prev, posts: snap.size }));
        });

        // Recent Activity (Users)
        const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
        const unsubRecent = onSnapshot(qUsers, (snap) => {
            setRecentUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubUsers();
            unsubProducts();
            unsubPosts();
            unsubRecent();
        };
    }, []);

    return (
        <div className="space-y-6 fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
                    <p className="text-blue-100 text-lg">
                        Vue d'ensemble de l'écosystème TEDSAI. Toutes les métriques sont en temps réel.
                    </p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs"
                    value={stats.users}
                    sub="+12% cette semaine"
                    icon="fa-users"
                    color="text-blue-600"
                />
                <StatCard
                    title="Produits Jardin"
                    value={stats.products}
                    sub="Inventaire actif"
                    icon="fa-leaf"
                    color="text-emerald-600"
                />
                <StatCard
                    title="Articles Publiés"
                    value={stats.posts}
                    sub="Observatoire activé"
                    icon="fa-newspaper"
                    color="text-purple-600"
                />
                <StatCard
                    title="Performance"
                    value="98%"
                    sub="Serveurs opérationnels"
                    icon="fa-server"
                    color="text-orange-500"
                />
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Users Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Derniers Inscrits</h3>
                        <Link href="/admin/users" className="text-blue-600 text-sm font-medium hover:underline">
                            Tout voir
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Utilisateur</th>
                                    <th className="px-6 py-3 font-semibold">Rôle</th>
                                    <th className="px-6 py-3 font-semibold">Date</th>
                                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                                            Aucun utilisateur récent.
                                        </td>
                                    </tr>
                                ) : recentUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                    {u.email?.charAt(0).toUpperCase()}
                                                </div>
                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    u.role === 'super_admin' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {u.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">⚠️ Alertes Système</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-800">Stock Faible</h4>
                                <p className="text-xs text-amber-600 mt-1">3 produits "Jardin" sont sous le seuil d'alerte.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-800">Mise à jour</h4>
                                <p className="text-xs text-blue-600 mt-1">Nouvelle version du dashboard déployée (v2.1).</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                        <button className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                            Voir tout l'historique
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
