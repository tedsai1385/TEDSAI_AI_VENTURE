'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { checkPermission } from '@/lib/dashboard/roles';

export default function AdminGuard({
    children,
    permission
}: {
    children: React.ReactNode,
    permission?: string
}) {
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
                return;
            }

            setAuthorized(true);
        }
    }, [user, profile, loading, router]);


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500/10 rounded-full blur-sm animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}

