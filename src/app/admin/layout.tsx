'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';

    // Protect Route
    useEffect(() => {
        if (!loading && !user && !isPublicAdminRoute) {
            router.push('/login');
        }
    }, [user, loading, router, isPublicAdminRoute]);

    // --- RENDER HELPERS ---
    const getInitials = () => (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
    const getDisplayName = () => user?.displayName || user?.email?.split('@')[0] || 'Admin';
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    // Loading State
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Chargement du Dashboard...</p>
                </div>
            </div>
        );
    }

    // Public Routes (Login)
    if (isPublicAdminRoute) {
        return <>{children}</>;
    }

    // Unauthenticated Fallback (Should redirect)
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p>Redirection sécurisée...</p>
            </div>
        );
    }

    return (
        <div id="admin-root" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>

            {/* SIDEBAR */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`} id="sidebar">
                <div className="sidebar-brand">
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-cube text-blue-400 text-xl"></i>
                        <span className="font-bold text-lg tracking-wide">TED ADMIN</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2 px-3">Principal</div>
                    <Link href="/admin" className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
                        <i className="fa-solid fa-chart-pie w-6"></i>
                        <span>Tableau de bord</span>
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Gestion Modules</div>
                    <Link href="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <i className="fa-solid fa-users w-6"></i>
                        <span>Utilisateurs</span>
                    </Link>
                    <Link href="/admin/restaurant" className={`nav-item ${isActive('/admin/restaurant') ? 'active' : ''}`}>
                        <i className="fa-solid fa-utensils w-6"></i>
                        <span>Restaurant</span>
                    </Link>
                    <Link href="/admin/garden" className={`nav-item ${isActive('/admin/garden') ? 'active' : ''}`}>
                        <i className="fa-solid fa-leaf w-6"></i>
                        <span>Jardin</span>
                    </Link>
                    <Link href="/admin/ia" className={`nav-item ${isActive('/admin/ia') ? 'active' : ''}`}>
                        <i className="fa-solid fa-brain w-6"></i>
                        <span>Services IA</span>
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Système</div>
                    <Link href="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
                        <i className="fa-solid fa-sliders w-6"></i>
                        <span>Paramètres</span>
                    </Link>
                </div>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30">
                            {getInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{getDisplayName()}</div>
                            <div className="text-xs text-slate-400 truncate capitalize">{profile?.role || 'Admin'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">

                {/* TOP HEADER */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-slate-600 md:hidden">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">
                            {pathname === '/admin' ? "Vue d'ensemble" : pathname.split('/').pop()?.charAt(0).toUpperCase() + pathname.split('/').pop()?.slice(1)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Système Connecté
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium group">
                            <span>Déconnexion</span>
                            <i className="fa-solid fa-arrow-right-from-bracket group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </header>

                {/* DYNAMIC PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 scroll-smooth">
                    {children}
                </main>

            </div>
        </div>
    );
}
