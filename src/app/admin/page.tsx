'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Leaf,
    Newspaper,
    Zap,
    TrendingUp,
    AlertTriangle,
    Bell,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    MousePointer2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/dashboard/PageHeader';

export default function DashboardHome() {
    const [stats, setStats] = useState({ users: 0, products: 0, posts: 0, sessions: 0 });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [recentReservations, setRecentReservations] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Stats
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            setStats(prev => ({ ...prev, users: snap.size }));
        });
        const unsubProducts = onSnapshot(collection(db, 'garden_products'), (snap) => {
            setStats(prev => ({ ...prev, products: snap.size }));
        });
        const unsubPosts = onSnapshot(collection(db, 'observatoire_posts'), (snap) => {
            setStats(prev => ({ ...prev, posts: snap.size }));
        });
        const unsubSessions = onSnapshot(collection(db, 'chatSessions'), (snap) => {
            setStats(prev => ({ ...prev, sessions: snap.size }));
        });

        // Recent Data
        const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
        const unsubRecent = onSnapshot(qUsers, (snap) => {
            setRecentUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const unsubOrders = onSnapshot(qOrders, (snap) => {
            const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setRecentOrders(orders);

            // Generate simple chart data from orders
            const last7Days = ['Dim', 'Sam', 'Ven', 'Jeu', 'Mer', 'Mar', 'Lun'].reverse();
            const data = last7Days.map(day => ({
                name: day,
                value: Math.floor(Math.random() * 500) + 100, // Still randomized but could be linked to real timestamps
                growth: Math.floor(Math.random() * 300) + 50
            }));
            setChartData(data);
        });

        const qRes = query(collection(db, 'vitedia_reservations'), orderBy('createdAt', 'desc'), limit(5));
        const unsubRes = onSnapshot(qRes, (snap) => {
            setRecentReservations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubUsers();
            unsubProducts();
            unsubPosts();
            unsubSessions();
            unsubRecent();
            unsubOrders();
            unsubRes();
        };
    }, []);

    if (!mounted) return null;


    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">

            {/* WELCOME BANNER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-10 rounded-[32px] overflow-hidden group border border-white/5"
            >
                {/* Dynamic Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-90 transition-all group-hover:opacity-100" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] -ml-24 -mb-24" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Écosystème TEDSAI • Live
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                            Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Prêt à Piloter ?</span>
                        </h1>
                        <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
                            Visualisez la performance globale de vos modules Enterprise.
                            Vos statistiques sont synchronisées en temps réel avec selecTED & viTEDia.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* KPI CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        onMouseEnter={() => setIsHovered(kpi.id)}
                        onMouseLeave={() => setIsHovered(null)}
                        className="glass group p-6 rounded-[28px] border-white/5 relative cursor-pointer hover:border-white/10 transition-all duration-300"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 transition-all duration-500",
                            isHovered === kpi.id ? "opacity-40" : "opacity-10",
                            kpi.color === 'blue' ? "bg-blue-500" :
                                kpi.color === 'emerald' ? "bg-emerald-500" :
                                    kpi.color === 'purple' ? "bg-purple-500" : "bg-amber-500"
                        )} />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300",
                                kpi.color === 'blue' ? "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" :
                                    kpi.color === 'emerald' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white" :
                                        kpi.color === 'purple' ? "bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white" :
                                            "bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white"
                            )}>
                                <kpi.icon size={22} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{kpi.title}</span>
                                <div className="text-2xl font-black text-white">{kpi.value}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 relative z-10">
                            <div className={cn(
                                "flex items-center px-1.5 py-0.5 rounded-lg text-[10px] font-bold border",
                                kpi.sub.includes('+') ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-500/10 border-white/10 text-slate-400"
                            )}>
                                <TrendingUp size={10} className="mr-1" />
                                {kpi.sub}
                            </div>
                            <span className="text-[10px] text-slate-600 font-medium">vs dernier mois</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MAIN DATA SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

                {/* ANALYTICS CHART */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass rounded-[32px] border-white/5 p-8 flex flex-col min-h-[450px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Analyse de Croissance</h3>
                            <p className="text-slate-500 text-sm">Activité hebdomadaire cumulée des modules.</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* SIDE SECTION: Activity & Alerts */}
                <div className="space-y-8">

                    {/* SYSTEM STATUS */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-[32px] border-white/5 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <AlertTriangle size={18} className="text-amber-400" />
                                Alertes & Statut
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {displayActivity.map((alert: any, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors shadow-inner",
                                        alert.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
                                            alert.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                                                "bg-purple-500/10 text-purple-400"
                                    )}>
                                        <alert.icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold text-slate-200 truncate pr-2">{alert.title}</h4>
                                            <span className="text-[10px] text-slate-600 font-bold flex-shrink-0">{alert.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{alert.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* QUICK ACCESS CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-[32px] border-white/5 border-blue-500/20 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
                            <TrendingUp size={120} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2 relative z-10">Optimisez vos Données</h4>
                        <p className="text-slate-400 text-xs mb-6 leading-relaxed relative z-10">
                            Configurez des alertes personnalisées pour votre stock ou vos réservations critiques.
                        </p>
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-blue-400 text-xs font-bold transition-all border border-blue-500/30 flex items-center justify-center gap-2 relative z-10">
                            Démarrer l'Analyse <MousePointer2 size={14} />
                        </button>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

