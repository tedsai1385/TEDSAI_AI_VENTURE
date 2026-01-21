'use client';

import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    ShieldCheck,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Zap,
    Terminal
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminSetupPage() {
    const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'error' | 'warn' }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const log = (msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') =>
        setLogs(prev => [...prev, { msg, type }]);

    const createAllAccounts = async () => {
        setLoading(true);
        setLogs([]);
        log('🚀 Initialisation du système TEDSAI...', 'info');

        const accounts = [
            { email: 'superadmin@tedsai.cm', pass: 'admin123', role: 'super_admin', name: 'Super Admin' },
            { email: 'resto@tedsai.cm', pass: 'resto123', role: 'admin_resto', name: 'Chef Cuisine' },
            { email: 'garden@tedsai.cm', pass: 'garden123', role: 'admin_garden', name: 'Chef Jardinier' },
            { email: 'ia@tedsai.cm', pass: 'ia123', role: 'admin_ia', name: 'Responsable IA' }
        ];

        for (const acc of accounts) {
            try {
                log(`Création de ${acc.email}...`, 'info');

                const userCredential = await createUserWithEmailAndPassword(auth, acc.email, acc.pass);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: acc.email,
                    role: acc.role,
                    displayName: acc.name,
                    createdAt: serverTimestamp(),
                    status: 'active'
                });

                log(`✅ Succès : ${acc.name} (${acc.role})`, 'success');
                await signOut(auth);

            } catch (err: any) {
                if (err.code === 'auth/email-already-in-use') {
                    log(`⚠️ Ignoré : ${acc.email} existe déjà.`, 'warn');
                } else {
                    log(`❌ Échec pour ${acc.email}: ${err.message}`, 'error');
                }
            }
        }

        log('✨ Provisionnement terminé avec succès !', 'success');
        setLoading(false);
        setIsDone(true);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -mr-24 -mb-24 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl glass p-8 md:p-10 rounded-[40px] border-white/5 relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6">
                        <Database className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Initialisation Admin</h1>
                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                        Configurez les comptes administrateurs par défaut pour les modules
                        <span className="text-blue-400 font-bold ml-1">viTEDia</span>,
                        <span className="text-emerald-400 font-bold ml-1">selecTED</span> &
                        <span className="text-indigo-400 font-bold ml-1">Solution IA</span>.
                    </p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={createAllAccounts}
                        disabled={loading || isDone}
                        className={cn(
                            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                            isDone
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                : loading
                                    ? "bg-blue-600/50 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95"
                        )}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : isDone ? <CheckCircle2 size={20} /> : <Zap size={20} />}
                        {loading ? 'Traitement en cours...' : isDone ? 'Initialisation Terminée' : 'Lancer le Provisionnement'}
                    </button>

                    {/* CONSOLE LOG BOX */}
                    <div className="bg-black/40 rounded-3xl border border-white/5 p-6 font-mono text-xs overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-white/5 pb-3">
                            <Terminal size={14} />
                            <span className="uppercase tracking-widest font-black">Console Output</span>
                        </div>
                        <div className="h-56 overflow-y-auto custom-scrollbar space-y-2">
                            {logs.length === 0 ? (
                                <div className="text-slate-700 italic">En attente de commandes...</div>
                            ) : (
                                logs.map((l, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className={cn(
                                            "flex gap-2",
                                            l.type === 'success' ? "text-emerald-400" :
                                                l.type === 'error' ? "text-red-400" :
                                                    l.type === 'warn' ? "text-amber-400" : "text-blue-300"
                                        )}
                                    >
                                        <span className="opacity-30">{'>'}</span>
                                        {l.msg}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link
                            href="/login"
                            className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Retour Connexion
                        </Link>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-blue-500" />
                        Environnement Sécurisé
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
