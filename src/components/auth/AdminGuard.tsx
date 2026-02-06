'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { isAuthenticated } from '@/lib/auth/utils'; // Legacy check removed
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const isAuthPage = pathname?.startsWith('/admin/auth');

        if (!loading && !user && !isAuthPage) {
            setIsRedirecting(true);
            router.push('/admin/auth/login');
        } else if (!loading && user && isAuthPage) {
            // Si connecté et sur page auth -> dashboard
            router.push('/admin/dashboard');
        }
    }, [user, loading, pathname, router]);

    if (loading || isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cortex-primary to-cortex-secondary flex items-center justify-center animate-pulse blur-sm absolute inset-0 opacity-50"></div>
                        <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center relative z-10">
                            <Sparkles className="w-8 h-8 text-cortex-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-white font-medium text-lg">TEDSAI Cortex</p>
                        <p className="text-gray-400 text-sm">Vérification de l'habilitation...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user && !pathname?.startsWith('/admin/auth')) {
        return null;
    }

    return <>{children}</>;
}
