'use client';

import React, { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import QRCodeGenerator from '@/components/admin/garden/QRCodeGenerator';

export default function AdminGardenPage() {
    const [mounted, setMounted] = useState(false);
    const [showHarvestForm, setShowHarvestForm] = useState(false);
    const [qrData, setQrData] = useState<{ data: string, label: string } | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    // ... (rest of implementation)

    if (!mounted) return null;

    return (

        <AdminGuard>
            {showHarvestForm && (
                <HarvestForm
                    onClose={() => setShowHarvestForm(false)}
                    onSuccess={() => { }}
                />
            )}

            {qrData && (
                <QRCodeGenerator
                    data={qrData.data}
                    label={qrData.label}
                    onClose={() => setQrData(null)}
                />
            )}

            <PageHeader
            // ... (header content)
            />

            {/* ... (stats) */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div>
                    {/* ... (table header) */}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            {/* ... (thead) */}
                            <tbody className="divide-y divide-white/5">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    onClick={() => setQrData({
                                                        data: `https://tedsai.com/garden/traceability/${p.id}`,
                                                        label: p.name
                                                    })}
                                                    className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 cursor-pointer hover:bg-emerald-500/20 hover:scale-110 transition-all"
                                                    title="Générer QR Code"
                                                >
                                                    <QrCode size={14} />
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
                                            <div className="flex items-center justify-end gap-2 text-slate-500">
                                                <button
                                                    onClick={() => {
                                                        const current = parseInt(p.stock) || 0;
                                                        updateStock(p.id, `${current + 1}kg`);
                                                    }}
                                                    className="p-1 hover:bg-emerald-500/10 rounded text-emerald-400 border border-transparent hover:border-emerald-500/20 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const current = parseInt(p.stock) || 0;
                                                        if (current > 0) updateStock(p.id, `${current - 1}kg`);
                                                    }}
                                                    className="p-1 hover:bg-red-500/10 rounded text-red-400 border border-transparent hover:border-red-500/20 transition-all font-bold"
                                                >
                                                    -
                                                </button>
                                            </div>
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

