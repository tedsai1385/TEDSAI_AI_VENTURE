'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    Users as UsersIcon,
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Shield,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ROLES, Role } from '@/lib/dashboard/roles';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (!mounted) return null;

    return (
        <AdminGuard>
            <PageHeader
                title="Gestion des Utilisateurs"
                subtitle="Administrez les comptes et les accès de l'écosystème TEDSAI."
                icon={UsersIcon}
                actions={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                        <UserPlus size={18} />
                        Inviter un Admin
                    </button>
                }
            />

            <div className="glass rounded-[32px] border-white/5 overflow-hidden flex flex-col">
                {/* Header / Search */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-2 w-full md:w-80 group focus-within:border-blue-500/50 transition-all">
                            <Search size={18} className="text-slate-500 mr-2 group-focus-within:text-blue-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un nom, email..."
                                className="bg-transparent border-none text-sm text-slate-200 outline-none w-full placeholder:text-slate-600"
                            />
                        </div>
                        <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-400 transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {users.length} Utilisateurs au total
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-500 uppercase tracking-wider bg-white/[0.03]">
                                <th className="px-8 py-5">Utilisateur</th>
                                <th className="px-8 py-5">Rôle / Permission</th>
                                <th className="px-8 py-5">Date d'inscription</th>
                                <th className="px-8 py-5">Statut</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-blue-400 group-hover:border-blue-500/50 transition-colors">
                                                {user.displayName?.charAt(0) || user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-200">{user.displayName || user.name || 'Sans nom'}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "p-1.5 rounded-lg",
                                                user.role === 'super_admin' ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                                            )}>
                                                <Shield size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300">
                                                {user.role ? (ROLES[user.role as Role]?.name || user.role) : 'Utilisateur'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs text-slate-400 flex items-center gap-2">
                                            <Calendar size={14} />
                                            {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Récemment'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            Actif
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="text-xs text-slate-500 font-medium">Affichage de {users.length} sur {users.length} utilisateurs</div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-50" disabled>Précédent</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-50" disabled>Suivant</button>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
