'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/utils';
import { Sparkles } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const isAuth = isAuthenticated();
            setAuthenticated(isAuth);
            setLoading(false);

            // Redirect to login if not authenticated
            if (!isAuth && !pathname?.startsWith('/admin/auth')) {
                router.push('/admin/auth/login');
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cortex-primary to-cortex-secondary flex items-center justify-center animate-pulse">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Chargement du dashboard TEDSAI Cortex...</p>
                </div>
            </div>
        );
    }

    // Si non authentifié et pas sur une page auth, ne rien afficher (redirection en cours)
    if (!authenticated && !pathname?.startsWith('/admin/auth')) {
        return null;
    }

    return <>{children}</>;
}
