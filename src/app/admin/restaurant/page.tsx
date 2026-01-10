'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    UtensilsCrossed,
    Plus,
    CalendarCheck,
    Clock,
    TrendingUp,
    ChevronRight,
    Users,
    ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminRestaurantPage() {
    const [reservations, setReservations] = useState([
        { id: '1', name: 'Dupont Jean', time: '19:30', guestCount: 4, status: 'confirmed' },
        { id: '2', name: 'Sarah Miller', time: '20:00', guestCount: 2, status: 'pending' },
        { id: '3', name: 'Robert Chen', time: '12:30', guestCount: 6, status: 'completed' },
    ]);

    const stats = [
        { label: 'Réservations Aujourd\'hui', value: '12', icon: CalendarCheck, color: 'blue', sub: '+2 vs hier' },
        { label: 'Temps Moyen Service', value: '45m', icon: Clock, color: 'amber', sub: '-5m ce mois' },
        { label: 'Clients ce Mois', value: '342', icon: Users, color: 'emerald', sub: '+12% croissance' },
        { label: 'Satisfaction', value: '4.8/5', icon: TrendingUp, color: 'indigo', sub: 'Basé sur 89 avis' },
    ];

    return (
        <AdminGuard permission="menu:read">
            <PageHeader
                title="Restaurant viTEDia"
                subtitle="Gérez vos menus, réservations et performance en temps réel."
                icon={UtensilsCrossed}
                actions={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus size={18} />
                        Nouveau Plat / Menu
                    </button>
                }
            />

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-6 rounded-3xl relative overflow-hidden group border-white/5"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40",
                            stat.color === 'blue' ? "bg-blue-500" :
                                stat.color === 'amber' ? "bg-amber-500" :
                                    stat.color === 'emerald' ? "bg-emerald-500" : "bg-indigo-500"
                        )} />

                        <div className="flex flex-col gap-4 relative z-10">
                            <stat.icon className={cn(
                                "p-2 rounded-xl w-10 h-10",
                                stat.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                                    stat.color === 'amber' ? "bg-amber-500/10 text-amber-400" :
                                        stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                            )} />
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 text-xs font-medium">{stat.label}</p>
                                    <span className="text-[10px] text-emerald-400 font-bold">{stat.sub}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* UPCOMING RESERVATIONS */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass rounded-3xl border-white/5 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarCheck size={20} className="text-blue-400" />
                            <h3 className="font-bold text-lg">Réservations Prochaines</h3>
                        </div>
                        <button className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center gap-1 group">
                            Voir Tout <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/5">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Heure</th>
                                    <th className="px-6 py-4">Convives</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-200">{res.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={14} />
                                                {res.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 font-medium">
                                            {res.guestCount} personnes
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border",
                                                res.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    res.status === 'pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                        "bg-slate-500/10 text-slate-400 border-white/10"
                                            )}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* MENU DRAFT / ACTIVE */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-3xl border-white/5 p-6 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">Menu Actif</h3>
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Aujourd'hui
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Menu du Jour</h4>
                                <span className="text-[12px] font-bold text-emerald-400">Publié</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">Entrée: Velouté de potiron | Plat: Suprême de volaille | Dessert: Tarte Tatin</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center justify-center py-4 gap-2 text-slate-500 group-hover:text-blue-400">
                                <Plus size={24} />
                                <span className="text-sm font-medium">Préparer le menu de demain</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Stock Ingrédients Jardim</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Tomates Bio', 'Basilic Frais', 'Poivrons', 'Menthe'].map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-emerald-500/5 text-emerald-400 rounded-md border border-emerald-500/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AdminGuard>
    );
}

