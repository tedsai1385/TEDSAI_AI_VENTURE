'use client';

import React, { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    BrainCircuit,
    Plus,
    Users,
    MessageSquare,
    Zap,
    LineChart,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminIAPage() {
    const [leads, setLeads] = useState([
        { id: '1', company: 'TechNova', contact: 'Alice Martin', status: 'Nouveau', value: '1,500€', priority: 'high' },
        { id: '2', company: 'Global Solutions', contact: 'Marc Dubois', status: 'En Cours', value: '4,200€', priority: 'medium' },
        { id: '3', company: 'EcoBâtiment', contact: 'Sarah J.', status: 'Gagné', value: '850€', priority: 'low' },
    ]);

    const stats = [
        { label: 'Leads Générés (IA)', value: '124', icon: Zap, color: 'purple' },
        { label: 'Conversations IA', value: '1.2k', icon: MessageSquare, color: 'blue' },
        { label: 'Taux de Conversion Business', value: '18%', icon: LineChart, color: 'emerald' },
        { label: 'Satisfaction Client (Bot)', value: '4.9', icon: Star, color: 'amber' },
    ];

    const kanbanColumns = ['Nouveau', 'En Cours', 'Négociation', 'Gagné'];

    return (
        <AdminGuard>

            <PageHeader
                title="IA Solutions & Leads"
                subtitle="Optimisez votre business avec l'IA et gérez vos opportunités B2B."
                icon={BrainCircuit}
                actions={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus size={18} />
                        Noyeau Lead / Prompt
                    </button>
                }
            />

            {/* PERFORMANCE OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-6 rounded-3xl border-white/5 flex items-center gap-5 group hover:border-purple-500/30 transition-all"
                    >
                        <div className={cn(
                            "p-3 rounded-2xl shadow-inner",
                            stat.color === 'purple' ? "bg-purple-500/10 text-purple-400" :
                                stat.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                                    stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
                                        "bg-amber-500/10 text-amber-400"
                        )}>
                            <stat.icon size={26} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white leading-none">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* LEADS CRM - KANBAN LIGHT */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-xl text-white">Pipeline de Vente</h3>
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-purple-500/30 transition-all">
                            <Search size={14} className="text-slate-500 mr-2" />
                            <input type="text" placeholder="Filtrer leads..." className="bg-transparent border-none text-xs text-white outline-none w-40" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-slate-400"><Filter size={16} /></button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-slate-400"><MoreHorizontal size={16} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kanbanColumns.map((col, colIdx) => (
                        <div key={col} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", colIdx === 0 ? "bg-blue-400" : colIdx === 1 ? "bg-amber-400" : colIdx === 2 ? "bg-purple-400" : "bg-emerald-400")} />
                                    {col}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-md">
                                    {leads.filter(l => l.status === col).length}
                                </span>
                            </div>

                            <div className="min-h-[400px] bg-black/20 rounded-3xl p-3 border border-dashed border-white/5 flex flex-col gap-3">
                                {leads.filter(l => l.status === col).map((lead, leadIdx) => (
                                    <motion.div
                                        key={lead.id}
                                        whileHover={{ y: -3, scale: 1.02 }}
                                        className="glass-dark p-4 rounded-2xl border-white/10 hover:border-purple-500/30 cursor-grab active:cursor-grabbing transition-all shadow-xl"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{lead.company}</div>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                lead.priority === 'high' ? "bg-red-500" : lead.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                                            )} />
                                        </div>
                                        <div className="font-bold text-slate-200 text-sm mb-1">{lead.contact}</div>
                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                                            <span className="text-xs font-bold text-purple-400">{lead.value}</span>
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[8px] font-black">AI</div>
                                                <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-900 flex items-center justify-center text-[8px] font-black">{lead.contact.charAt(0)}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {col === 'Nouveau' && (
                                    <button className="py-4 border-2 border-dashed border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:text-slate-400 transition-all gap-1 group">
                                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Nouveau Prospect</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminGuard>
    );
}

