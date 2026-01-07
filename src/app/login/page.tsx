'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();

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

                <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continuer avec Google
                </button>
            </div>
        </div>
    );
}
