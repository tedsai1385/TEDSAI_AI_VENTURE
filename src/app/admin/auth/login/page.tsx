'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword, loginWithGoogle, AuthError } from '@/lib/firebase/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();

    // États
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    // Vérification configuration au montage
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

        if (!apiKey || apiKey.includes('undefined') || apiKey.length < 10) {
            setDebugInfo('⚠️ Configuration Firebase invalide. Vérifiez votre fichier .env.local');
            console.error('Firebase Config:', {
                apiKey: apiKey ? 'Présente mais invalide' : 'Manquante',
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            });
        } else {
            console.log('✅ Firebase API Key configurée');
        }
    }, []);

    // Handler Email/Password
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await loginWithEmailPassword(email, password);
            router.push('/admin/dashboard');

        } catch (err: any) {
            if (err instanceof AuthError) {
                setError(`${err.message}`);
                console.error('Détails techniques:', err.technicalDetails);
            } else {
                setError('Erreur inattendue. Consulter la console.');
                console.error('Erreur non gérée:', err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handler Google
    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await loginWithGoogle();
            router.push('/admin/dashboard');

        } catch (err: any) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('Erreur connexion Google');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">TEDSAI Admin</h1>
                        <p className="text-gray-400">Connexion sécurisée</p>
                    </div>

                    {/* Debug Info */}
                    {debugInfo && (
                        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                            <p className="text-sm text-yellow-200">{debugInfo}</p>
                        </div>
                    )}

                    {/* Erreur */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-2"
                        >
                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Formulaire Email */}
                    <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@tedsai.com"
                                className="bg-gray-800 border-gray-700 text-white"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Mot de passe</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white pr-10"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Se connecter
                        </Button>
                    </form>

                    {/* Séparateur */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-gray-900 text-gray-500">ou</span>
                        </div>
                    </div>

                    {/* Google */}
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full border-gray-600 text-white hover:bg-gray-800"
                    >
                        <Chrome className="w-4 h-4 mr-2" />
                        Continuer avec Google
                    </Button>

                </div>
            </motion.div>
        </div>
    );
}
