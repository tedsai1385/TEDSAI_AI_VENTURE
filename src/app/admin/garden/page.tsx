'use client';

import React, { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    Leaf,
    Plus,
    QrCode,
    Warehouse,
    ShieldCheck,
    Map as MapIcon,
    ChevronRight,
    ArrowUpRight,
    Beaker
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminGardenPage() {
    const [products, setProducts] = useState([
        { id: '1', name: 'Tomate Cerise', stock: '45kg', parcel: 'Parcelle A1', cert: 'Bio', status: 'optimal' },
        { id: '2', name: 'Basilic Grand Vert', stock: '12kg', parcel: 'Serre 2', cert: 'AB', status: 'recolte_urgente' },
        { id: '3', name: 'Piment de Cayenne', stock: '8kg', parcel: 'Parcelle C4', cert: 'Bio', status: 'optimal' },
    ]);

    const stats = [
        { label: 'Produits en Stock', value: '24', icon: Warehouse, color: 'emerald' },
        { label: 'Surface Cultivée', value: '1.2ha', icon: MapIcon, color: 'blue' },
        { label: 'Récoltes ce Mois', value: '156kg', icon: Leaf, color: 'amber' },
        { label: 'Indice Qualité', value: '98%', icon: ShieldCheck, color: 'green' },
    ];

    return (
        <AdminGuard>

            <PageHeader
                title="SelecTED Gardens"
                subtitle="Gestion de l'inventaire agricole et traçabilité QR Code."
                icon={Leaf}
                actions={
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95">
                            <Plus size={18} />
                            Enregistrer Récolte
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 transition-all">
                            <QrCode size={18} />
                            Générer QR
                        </button>
                    </div>
                }
            />

            {/* DASHBOARD STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-6 rounded-3xl group border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-3 rounded-2xl",
                                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
                                    stat.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                                        stat.color === 'amber' ? "bg-amber-500/10 text-amber-400" :
                                            "bg-green-500/10 text-green-400"
                            )}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* INVENTORY TABLE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 glass rounded-3xl border-white/5 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Warehouse size={20} className="text-emerald-400" />
                            Inventaire Produits
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">Tous</span>
                            <span className="px-3 py-1 bg-emerald-500/10 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/20 cursor-pointer">Bio</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-black/20">
                                    <th className="px-6 py-4">Produit</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Parcelle</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <Leaf size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-200">{p.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{p.cert}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">{p.stock}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{p.parcel}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    p.status === 'optimal' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase",
                                                    p.status === 'optimal' ? "text-emerald-400" : "text-amber-400"
                                                )}>
                                                    {p.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-emerald-500/10 rounded-lg text-slate-500 hover:text-emerald-400 transition-all">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* SENSORS / ANALYTICS */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-3xl border-white/5 p-6"
                    >
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Beaker size={20} className="text-blue-400" />
                            Analyse Sol
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Humidité', value: 65, color: 'blue' },
                                { label: 'Température', value: 24, color: 'amber', unit: '°C' },
                                { label: 'Nutriments (N-P-K)', value: 88, color: 'emerald' },
                            ].map(sensor => (
                                <div key={sensor.label}>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-slate-500">{sensor.label}</span>
                                        <span className="text-white">{sensor.value}{sensor.unit || '%'}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sensor.value}%` }}
                                            className={cn(
                                                "h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                                sensor.color === 'blue' ? "bg-blue-500" :
                                                    sensor.color === 'amber' ? "bg-amber-500" : "bg-emerald-500"
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl border-white/5 p-6 border-indigo-500/20"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <QrCode size={20} />
                            </div>
                            <h3 className="font-bold text-white">Traçabilité</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Générez des QR codes pour chaque lot de récolte afin d'assurer une transparence totale client.</p>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-bold transition-all border border-white/10">
                            Historique Codes
                        </button>
                    </motion.div>
                </div>
            </div>
        </AdminGuard>
    );
}

