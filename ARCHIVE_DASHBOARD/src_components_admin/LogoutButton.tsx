'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth/utils';
import { LogOut } from 'lucide-react';

export function LogoutButton({ className }: { className?: string }) {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/admin/auth/login');
        router.refresh();
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className={className || "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"}
        >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
        </Button>
    );
}
