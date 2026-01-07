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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A2463]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                    <i className="fa-solid fa-cube text-5xl text-white relative z-10 drop-shadow-lg"></i>
                </div>

                <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">TEDSAI Admin</h1>
                <p className="text-blue-100 mb-8 font-light text-lg">Portail de gestion unifié pour l'écosystème.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white text-sm rounded-xl flex items-start gap-3 text-left animate-shake">
                        <i className="fa-solid fa-triangle-exclamation mt-1 text-red-300"></i>
                        <div>
                            <strong className="block font-semibold mb-1">Erreur de connexion</strong>
                            <span className="text-red-100 opacity-90">{error}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="w-full mb-6 text-left space-y-4">
                    <div>
                        <label className="block text-blue-100 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="admin@tedsai.com"
                        />
                    </div>
                    <div>
                        <label className="block text-blue-100 text-sm font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-blue-200/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-blue-100 bg-transparent">OU</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-blue-50 text-[#0A2463] font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A2463]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion en cours...
                        </>
                    ) : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>Continuer avec Google</span>
                        </>
                    )}
                </button>

                <p className="mt-8 text-sm text-blue-200/60">
                    &copy; {new Date().getFullYear()} TEDSAI AI Venture. <br /> Accès sécurisé réservé au personnel.
                </p>
            </div>
        </div>
    );
}
