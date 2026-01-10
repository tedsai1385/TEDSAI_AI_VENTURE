'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css'; // Import the CSS globally for the Admin Layout

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';

    React.useEffect(() => {
        if (!loading && !user && !isPublicAdminRoute) {
            router.push('/login');
        }
    }, [user, loading, router, isPublicAdminRoute]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="loader"></div>
            </div>
        );
    }

    if (isPublicAdminRoute) {
        return <>{children}</>;
    }

    if (!user) return null;

    // Helper to check active link
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    return (
        // BODY WRAPPER
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>

            {/* 2️⃣ BARRE LATÉRALE GAUCHE (Replicated from HTML) */}
            <aside className="sidebar" id="sidebar">
                <div className="sidebar-brand">
                    <div><i className="fa-solid fa-cube"></i> <span>TED ADMIN</span></div>
                </div>

                <div id="sidebar-content" style={{ overflowY: 'auto' }}>

                    {/* MENU STRUCTURE */}
                    <div className="menu-category">Principal</div>
                    <Link href="/admin" className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
                        <i className="fa-solid fa-chart-pie"></i> Tableau de bord
                    </Link>

                    <div className="menu-category">Gestion Modules</div>
                    <Link href="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <i className="fa-solid fa-users-gear"></i> Utilisateurs & Rôles
                    </Link>
                    <Link href="/admin/restaurant" className={`nav-item ${isActive('/admin/restaurant') ? 'active' : ''}`}>
                        <i className="fa-solid fa-utensils"></i> Restaurant
                    </Link>
                    <Link href="/admin/garden" className={`nav-item ${isActive('/admin/garden') ? 'active' : ''}`}>
                        <i className="fa-solid fa-leaf"></i> SelecTED Gardens
                    </Link>
                    <Link href="/admin/ia" className={`nav-item ${isActive('/admin/ia') ? 'active' : ''}`}>
                        <i className="fa-solid fa-brain"></i> IA / Services
                    </Link>

                    <div className="menu-category">Contenu Site</div>
                    <Link href="/admin/pages" className={`nav-item ${isActive('/admin/pages') ? 'active' : ''}`}>
                        <i className="fa-solid fa-file-lines"></i> Pages du site
                    </Link>
                    <Link href="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}>
                        <i className="fa-solid fa-sliders"></i> Paramètres
                    </Link>
                </div>

                {/* User Footer in Sidebar */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                    <div className="flex items-center gap-3">
                        <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {user.displayName || 'Admin'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{profile?.role || 'user'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN WRAPPER */}
            <div className="wrapper">
                {/* 1️⃣ EN-TÊTE */}
                <header className="top-header">
                    <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 id="page-title">
                            {pathname === '/admin' ? 'Tableau de bord' :
                                pathname.includes('restaurant') ? 'Restaurant' :
                                    pathname.includes('garden') ? 'Jardin' :
                                        'Administration'}
                        </h2>
                    </div>
                    <div className="header-right">
                        <div className="status-indicator">
                            <span className="dot"></span> En ligne
                        </div>

                        <div className="user-profile">
                            <div className="user-info">
                                <div>{user.displayName || user.email?.split('@')[0]}</div>
                                <span>{profile?.role || 'Authentifié'}</span>
                            </div>
                            <div className="user-avatar">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={() => logout()} title="Déconnexion"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '10px' }}>
                                <i className="fa-solid fa-power-off fa-lg"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
}
