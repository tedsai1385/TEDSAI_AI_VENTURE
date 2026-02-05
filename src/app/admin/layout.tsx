'use client';

import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { CommandPalette } from '@/components/admin/command-palette/CommandPalette';
import { Copilot } from '@/components/admin/Copilot';
import AdminGuard from '@/components/auth/AdminGuard';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/admin/auth');

    if (isAuthPage) {
        return <div className="min-h-screen bg-dark-bg text-white">{children}</div>;
    }

    return (
        <AdminGuard>
            <CommandPalette />
            <Copilot />
            <div className="min-h-screen bg-neutral-950">
                <AdminSidebar />
                <div className="md:pl-72 flex flex-col min-h-screen transition-all duration-300">
                    <AdminHeader />
                    <main className="flex-1 p-6 pt-20 animate-fade-in text-neutral-200">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
