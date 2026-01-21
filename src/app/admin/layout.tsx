'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UtensilsCrossed,
    Sprout,
    BrainCircuit,
    FileText,
    Settings,
    LogOut,
    Bell,
    Home,
    Package,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import AdminGuard from '@/components/auth/AdminGuard';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '/admin' },
        { icon: Home, label: 'Page d\'accueil', href: '/admin/homepage' },
        { icon: UtensilsCrossed, label: 'Restaurant', href: '/admin/restaurant' },
        { icon: Package, label: 'Épicerie / Shop', href: '/admin/shop' },
        { icon: FileText, label: 'Blog', href: '/admin/blog' },
        { icon: BrainCircuit, label: 'Services IA', href: '/admin/bia' },
        { icon: Mail, label: 'Contact', href: '/admin/contact' },
        { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
        { icon: Sprout, label: 'Jardin / Élevage', href: '/admin/garden' },
        { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
    ];

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white z-50 flex flex-col">
                    <div className="p-6 border-b border-slate-800">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-xl">
                                T
                            </div>
                            <span className="text-xl font-bold font-heading">TEDSAI<span className="text-blue-400">Admin</span></span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}>
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 mb-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                <span className="font-bold text-sm">AD</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-medium truncate">Admin User</div>
                                <div className="text-xs text-slate-500 truncate">admin@tedsai.cm</div>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </Button>
                            <Button variant="outline" size="sm" className="hidden md:flex">
                                Voir le site
                            </Button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
