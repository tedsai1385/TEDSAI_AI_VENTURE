'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithEmailPassword, loginWithGoogle, AuthError } from '@/lib/firebase/auth-service';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Loader2,
    Mail,
    Lock,
    Chrome,
    AlertCircle,
    Eye,
    EyeOff,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    // Redirection si déjà connecté
    useEffect(() => {
        if (user) {
            const redirectTo = searchParams?.get('redirect') || '/admin/dashboard';
            router.push(redirectTo);
        }
    }, [user, router, searchParams]);

    // États formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'email' | 'google'>('email');

    // ═══════════════════════════════════════════════════════════════════
    // HANDLER CONNEXION EMAIL/PASSWORD
    // ═══════════════════════════════════════════════════════════════════

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation client
        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);

        try {
            await loginWithEmailPassword(email, password);
            // Redirection gérée par useEffect auth state

        } catch (err: any) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('Erreur inattendue. Réessayez.');
            }
            setIsLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // HANDLER CONNEXION GOOGLE
    // ═══════════════════════════════════════════════════════════════════

    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const { isNewUser } = await loginWithGoogle();

            if (isNewUser) {
                console.log('[Login] New Google user');
            }
            // Redirection gérée par useEffect

        } catch (err: any) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('Erreur connexion Google');
            }
            setIsLoading(false);
        }
    };

    // Loading initial
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Card principale */}
                <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="p-8 pb-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">TEDSAI Dashboard</h1>
                                <p className="text-sm text-gray-400">Espace administrateur</p>
                            </div>
                        </div>

                        {/* Toggle méthodes */}
                        <div className="flex p-1 bg-gray-800/50 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('email')}
                                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'email'
                                        ? 'bg-gray-700 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                    }
                `}
                            >
                                Email
                            </button>
                            <button
                                onClick={() => setActiveTab('google')}
                                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'google'
                                        ? 'bg-gray-700 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                    }
                `}
                            >
                                Google
                            </button>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-8 pt-4">
                        <AnimatePresence mode="wait">

                            {/* ═══════════════════════════════════════════════════════════ EMAIL FORM */}
                            {activeTab === 'email' && (
                                <motion.form
                                    key="email"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleEmailLogin}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">
                                            Adresse email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="admin@tedsai.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-300">
                                            Mot de passe
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Erreur */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg"
                                            >
                                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-red-200">{error}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium h-11"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : (
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                        )}
                                        Se connecter
                                    </Button>
                                </motion.form>
                            )}

                            {/* ═══════════════════════════════════════════════════════════ GOOGLE BUTTON */}
                            {activeTab === 'google' && (
                                <motion.div
                                    key="google"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="text-center py-4">
                                        <p className="text-gray-400 mb-6">
                                            Connectez-vous avec votre compte Google autorisé
                                        </p>

                                        <Button
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="w-full h-12 border-gray-600 bg-white text-gray-900 hover:bg-gray-100 font-medium"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                <Chrome className="w-5 h-5 mr-2" />
                                            )}
                                            Continuer avec Google
                                        </Button>
                                    </div>

                                    {/* Erreur Google */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg"
                                            >
                                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-red-200">{error}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Separator className="my-6 bg-gray-800" />

                        {/* Footer aide */}
                        <p className="text-xs text-center text-gray-500">
                            Accès réservé aux utilisateurs autorisés.{' '}
                            <a href="#" className="text-purple-400 hover:text-purple-300">
                                Demander un accès
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
