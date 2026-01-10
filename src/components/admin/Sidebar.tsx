'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    UtensilsCrossed,
    Leaf,
    BrainCircuit,
    Settings,
    Users,
    ChevronRight,
    LogOut,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLES, Role, checkPermission } from '@/lib/dashboard/roles';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { profile, logout } = useAuth();

    const menuItems = [
        {
            header: "Principal",
            items: [
                { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', permission: null }
            ]
        },
        {
            header: "Gestion Modules",
            items: [
                { href: '/admin/restaurant', icon: UtensilsCrossed, label: 'Restaurant', permission: 'menu:read' },
                { href: '/admin/garden', icon: Leaf, label: 'SelecTED Gardens', permission: 'garden:products:read' },
                { href: '/admin/ia', icon: BrainCircuit, label: 'IA / Services', permission: 'leads:read' }
            ]
        },
        {
            header: "Système",
            items: [
                { href: '/admin/users', icon: Users, label: 'Utilisateurs', permission: 'super_admin' },
                { href: '/admin/settings', icon: Settings, label: 'Paramètres', permission: null }
            ]
        }
    ];

    const isPathActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname?.startsWith(href);
    };

    const hasAccess = (permission: string | null) => {
        if (!permission) return true;
        if (permission === 'super_admin') return profile?.role === 'super_admin';
        return checkPermission(profile?.role, permission);
    };

    return (
        <aside className="w-[280px] h-screen glass-dark text-white flex flex-col flex-shrink-0 z-20 border-r border-white/5 relative overflow-hidden">
            {/* Glossy Background Effect */}
            <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="h-[70px] flex items-center px-8 border-b border-white/5 font-bold text-xl tracking-tight relative z-10">
                <motion.div
                    initial={{ rotate: -10, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20"
                >
                    <BarChart3 size={18} className="text-white" />
                </motion.div>
                TED <span className="text-blue-400 ml-1">ADMIN</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar relative z-10">
                {menuItems.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-8 last:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: groupIdx * 0.1 }}
                            className="px-4 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]"
                        >
                            {group.header}
                        </motion.div>
                        <div className="space-y-1">
                            {group.items.filter(item => hasAccess(item.permission)).map((item, itemIdx) => {
                                const active = isPathActive(item.href);
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                                                active
                                                    ? "bg-gradient-to-r from-blue-600/20 to-transparent text-blue-400 active-nav-glow"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {active && (
                                                <motion.div
                                                    layoutId="active-indicator"
                                                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                                                />
                                            )}
                                            <item.icon size={20} className={cn("mr-4", active ? "text-blue-400" : "group-hover:text-white")} />
                                            <span className="flex-1">{item.label}</span>
                                            {active && <ChevronRight size={14} className="opacity-50" />}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md relative z-10 group/profile">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-blue-400 border border-white/10 group-hover/profile:border-blue-500/50 transition-colors">
                            {profile?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate group-hover/profile:text-blue-400 transition-colors">
                            {profile?.displayName || 'Utilisateur'}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            {profile?.role ? (ROLES[profile.role as Role]?.name || profile.role) : 'Administrateur'}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Déconnexion"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
