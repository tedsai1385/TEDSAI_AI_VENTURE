'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Clear the cart on successful payment
        clearCart();
    }, [clearCart]);

    return (
        <div className="container mx-auto px-4 py-32 text-center" style={{ marginTop: '80px' }}>
            <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-xl border">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <i className="fa-solid fa-check text-5xl"></i>
                </div>

                <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Merci pour votre commande !</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Votre paiement a été accepté avec succès. Vous recevrez un e-mail de confirmation d'ici quelques instants.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="block bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                    >
                        Suivre ma commande
                    </Link>
                    <Link
                        href="/"
                        className="block text-gray-500 hover:text-green-600 font-medium transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
