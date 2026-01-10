'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    Settings,
    Save,
    Bell,
    Lock,
    Globe,
    Database,
    Zap,
    Shield,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const sections = [
        {
            title: "Général",
            icon: Settings,
            items: [
                { title: "Mode Maintenance", description: "Désactiver l'accès public au site pour maintenance.", type: "toggle", value: false },
                { title: "Nom de l'Écosystème", description: "Nom affiché dans le dashboard et les emails.", type: "text", value: "TEDSAI AI VENTURE" }
            ]
        },
        {
            title: "Sécurité & Accès",
            icon: Shield,
            items: [
                { title: "Authentification à deux facteurs", description: "Renforcer la sécurité des comptes admins.", type: "toggle", value: true },
                { title: "Session Timeout", description: "Déconnexion automatique après inactivité.", type: "select", options: ["15 min", "30 min", "1 heure", "Jamais"], value: "1 heure" }
            ]
        },
        {
            title: "Notifications",
            icon: Bell,
            items: [
                { title: "Alertes CRM", description: "Recevoir un email pour chaque nouveau lead IA.", type: "toggle", value: true },
                { title: "Rapports Hebdomadaires", description: "Résumé des performances par email.", type: "toggle", value: true }
            ]
        },
        {
            title: "Données & Système",
            icon: Database,
            items: [
                { title: "Supprimer le Cache", description: "Forcer la régénération des pages statiques.", type: "button", label: "Purger maintenant", color: "blue", icon: Trash2 }
            ]
        }
    ];

    return (
        <AdminGuard>
            <PageHeader
                title="Paramètres Globaux"
                subtitle="Configurez le comportement et la sécurité de votre plateforme."
                icon={Settings}
                actions={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Save size={18} />
                        Enregistrer les modifications
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SETTINGS MENU (TABLE OF CONTENTS) */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map(section => (
                        <button
                            key={section.title}
                            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-blue-500/30 transition-all group text-left"
                        >
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <section.icon size={18} />
                            </div>
                            <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{section.title}</span>
                        </button>
                    ))}

                    <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
                        <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                            <Zap size={16} />
                            Version 2.0
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Vous utilisez la version Enterprise Premium. Toutes vos modifications sont répercutées en temps réel sur les modules viTEDia & selecTED.
                        </p>
                    </div>
                </div>

                {/* SETTINGS CONTENT */}
                <div className="lg:col-span-2 space-y-6">
                    {sections.map((section, sIdx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sIdx * 0.1 }}
                            className="glass rounded-[32px] border-white/5 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <section.icon size={18} className="text-blue-400" />
                                    {section.title}
                                </h3>
                            </div>

                            <div className="divide-y divide-white/5">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                                        <div className="max-w-md">
                                            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</div>
                                            <div className="text-xs text-slate-500">{item.description}</div>
                                        </div>

                                        <div>
                                            {item.type === 'toggle' && (
                                                <button className={cn(
                                                    "w-12 h-6 rounded-full relative transition-all",
                                                    item.value ? "bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]" : "bg-slate-800"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                                        item.value ? "left-7" : "left-1"
                                                    )} />
                                                </button>
                                            )}

                                            {item.type === 'text' && (
                                                <input
                                                    type="text"
                                                    defaultValue={item.value as string}
                                                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500/50 w-full sm:w-64"
                                                />
                                            )}

                                            {item.type === 'select' && (
                                                <select className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500/50 w-full sm:w-48 appearance-none cursor-pointer">
                                                    {(item.options as string[]).map(opt => (
                                                        <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {item.type === 'button' && (
                                                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all">
                                                    {item.icon && <item.icon size={14} />}
                                                    {item.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AdminGuard>
    );
}
