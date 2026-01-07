'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
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
                setError("Connexion échouée : " + err.message);
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

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    {loading ? 'Connexion...' : 'Continuer avec Google'}
                </button>
            </div>
        </div>
    );
}
