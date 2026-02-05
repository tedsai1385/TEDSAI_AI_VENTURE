'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { login } from '@/lib/auth/utils';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                // Succès - redirection vers dashboard
                router.push('/admin');
                router.refresh(); // Force refresh to update auth state
            } else {
                setError('Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 via-transparent to-blue-900/5" />

            <div className="relative w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        TEDSAI Cortex
                    </h1>
                    <p className="text-gray-400">
                        Centre de commandement administratif
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    placeholder="admin@tedsai.cm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-900/10 border border-red-900/20 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-green-900/5 border border-green-900/20 rounded-lg">
                        <p className="text-xs font-medium text-green-400 mb-2">
                            🔐 Identifiants de démonstration
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                            <p>Email : <code className="text-white">admin@tedsai.cm</code></p>
                            <p>Mot de passe : <code className="text-white">demo</code></p>
                        </div>
                    </div>

                    {/* 2FA Notice */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            🔒 Authentification à deux facteurs (2FA) disponible en Phase 2
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>© 2026 TEDSAI Complex - L'Algorithme Organique</p>
                </div>
            </div>
        </div>
    );
}
