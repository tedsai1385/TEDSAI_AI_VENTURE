'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';

    React.useEffect(() => {
        if (!loading && !user && !isPublicAdminRoute) {
            router.push('/admin/login');
        }
    }, [user, loading, router, isPublicAdminRoute, pathname]); // Added pathname dependency

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isPublicAdminRoute) {
        return <>{children}</>;
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-gray-800">Tableau de bord</h2>
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        En ligne
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
