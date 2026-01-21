'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Mail,
    Lock,
    AlertTriangle,
    Loader2,
    ArrowRight,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const { user, signInWithGoogle, signInWithEmail } = useAuth();
    const router = useRouter();

    // Map Firebase errors to user-friendly French messages
    const mapErrorToFrench = (code: string): string => {
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return "Email ou mot de passe incorrect.";
            case 'auth/too-many-requests':
                return "Compte bloqué temporairement (trop d'essais). Réessayez plus tard.";
            case 'auth/user-disabled':
                return "Ce compte a été désactivé.";
            case 'auth/operation-not-allowed':
                return "La connexion par email n'est pas activée.";
            case 'auth/popup-closed-by-user':
                return "Connexion Google annulée.";
            default:
                return "Une erreur technique est survenue. Veuillez réessayer.";
        }
    };

    // Ultra-simple: if user is authenticated, redirect to admin
    useEffect(() => {
        if (user && !success) {
            setSuccess(true);
            setTimeout(() => router.push('/admin'), 800);
        }
    }, [user, success]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setStatusMessage("Authentification en cours...");

        try {
            await signInWithEmail(email, password);
            // Redirection logic in useEffect
        } catch (err: any) {
            setError(mapErrorToFrench(err.code));
            setLoading(false);
            setStatusMessage('');
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        setStatusMessage("Connexion Google...");
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(mapErrorToFrench(err.code));
            setLoading(false);
            setStatusMessage('');
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl mb-6 shadow-blue-200"
                    >
                        <ShieldCheck className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">TEDSAI Admin</h1>
                    <p className="text-slate-500 font-medium">Portail d'Accès Sécurisé</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
                >
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion Réussie</h2>
                                    <p className="text-slate-500">Redirection vers le tableau de bord...</p>
                                    <div className="mt-8 flex justify-center">
                                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="form">
                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium"
                                            >
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleLogin} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Email professionnel</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                                    placeholder="admin@tedsaiventures.com"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                                                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Oublié ?</button>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                                    placeholder="••••••••"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-slate-200"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {statusMessage}
                                                </>
                                            ) : (
                                                <>
                                                    Connexion
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>

                                        <div className="relative my-8 text-center">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-100"></div>
                                            </div>
                                            <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">Ou continuer avec</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                            Google Workspace
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            &copy; {new Date().getFullYear()} TEDSAI AI VENTURES &bull; Système de Contrôle Alpha
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
