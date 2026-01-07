'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { profile } = useAuth();

    const menuItems = [
        {
            header: "Principal",
            items: [
                { href: '/admin', icon: 'fa-chart-pie', label: 'Tableau de bord' }
            ]
        },
        {
            header: "Gestion Modules",
            items: [
                { href: '/admin/users', icon: 'fa-users-gear', label: 'Utilisateurs' },
                { href: '/admin/restaurant', icon: 'fa-utensils', label: 'Restaurant' },
                { href: '/admin/garden', icon: 'fa-leaf', label: 'SelecTED Gardens' },
                { href: '/admin/ia', icon: 'fa-brain', label: 'IA / Services' }
            ]
        },
        {
            header: "Système",
            items: [
                { href: '/admin/settings', icon: 'fa-sliders', label: 'Paramètres' }
            ]
        }
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-full flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-lg">
                <i className="fa-solid fa-cube mr-2 text-blue-500"></i>
                TED ADMIN
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="mb-6">
                        <div className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {group.header}
                        </div>
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-6 py-3 text-sm transition-colors ${pathname === item.href
                                        ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
                                    }`}
                            >
                                <i className={`fa-solid ${item.icon} w-6 text-center mr-3`}></i>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        {profile?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{profile?.displayName || 'Utilisateur'}</div>
                        <div className="text-xs text-slate-500 truncate">{profile?.role || 'user'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
