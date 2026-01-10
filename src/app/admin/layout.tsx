'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Bell,
    Search,
    LogOut,
    ChevronRight,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/Sidebar';
import { cn } from '@/lib/utils';
import './tailwind-admin.css';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';
    const [safetyLoading, setSafetyLoading] = useState(true);

    // Scroll listener for header polish
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Safety timeout to prevent infinite loading
        const timer = setTimeout(() => {
            setSafetyLoading(false);
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    const isLoading = loading && safetyLoading;

    // Protect Route
    useEffect(() => {
        if (!loading && !user && !isPublicAdminRoute) {
            router.push('/login');
        }
    }, [user, loading, router, isPublicAdminRoute]);

    const getPageTitle = () => {
        if (pathname === '/admin') return "Vue d'ensemble";
        const parts = pathname.split('/');
        const lastPart = parts[parts.length - 1];
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full blur-md animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isPublicAdminRoute) return <>{children}</>;

    if (!user) return null;

    return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-[280px] w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            {/* SIDEBAR */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed lg:relative z-30"
                    >
                        <AdminSidebar />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden absolute top-4 -right-12 p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* TOP HEADER */}
                <header className={cn(
                    "h-[70px] flex items-center justify-between px-8 z-20 transition-all duration-300 border-b border-white/5",
                    isScrolled ? "glass-dark shadow-lg" : "bg-transparent"
                )}>
                    <div className="flex items-center gap-6">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors ring-1 ring-white/10"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">Admin</span>
                            <ChevronRight size={14} className="text-slate-600" />
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {getPageTitle()}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar (Static for now) */}
                        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-64 group focus-within:border-blue-500/50 transition-all">
                            <Search size={16} className="text-slate-500 mr-3 group-focus-within:text-blue-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="bg-transparent border-none text-sm outline-none w-full placeholder:text-slate-600"
                            />
                        </div>

                        {/* Status Label */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20 ring-1 ring-emerald-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            Online
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                        {/* Notifications */}
                        <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all relative group">
                            <Bell size={20} className="text-slate-400 group-hover:text-white" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-[#020617] rounded-full group-hover:scale-110 transition-transform"></span>
                        </button>
                    </div>
                </header>

                {/* DYNAMIC PAGE CONTENT WITH TRANSITIONS */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="p-8 pb-12"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

            </div>
        </div>
    );
}
