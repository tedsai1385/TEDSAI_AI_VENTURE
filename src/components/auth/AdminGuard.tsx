'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!profile) {
                // Pour la phase de test, on autorise l'accès à tout utilisateur connecté
                // On garde quand même une vérification de profile pour s'assurer qu'il existe
                router.push('/login');
            }
            // Suppression temporaire de la vérification stricte du rôle pour les tests
            // else if (profile.role !== 'admin' && profile.role !== 'super_admin') { ... }
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
