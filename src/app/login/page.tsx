'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail } = useAuth();
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmail(email, password);
        } catch (err: any) {
            console.error(err);
            setError("Identifiants incorrects ou erreur serveur : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/unauthorized-domain') {
                setError("Ce domaine n'est pas autorisé. Ajoutez 'tedsai-ai-venture.vercel.app' dans la Console Firebase > Authentication > Settings.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("La fenêtre de connexion a été fermée.");
            } else {
                setError("Connexion Google échouée : " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user) {
            router.push('/admin');
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="mb-6">
                    <i className="fa-solid fa-cube text-4xl text-blue-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">TEDSAI Admin</h1>
                <p className="text-gray-500 mb-8">Connectez-vous pour accéder au tableau de bord</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2 text-left">
                        <i className="fa-solid fa-circle-exclamation mt-1"></i>
                        <div>
                            <strong>Erreur :</strong> {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="w-full mb-6 text-left space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="admin@tedsai.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-gray-500 bg-white">OU</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continuer avec Google
                </button>
            </div>
        </div>
    );
}
