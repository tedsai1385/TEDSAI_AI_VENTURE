'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-32 text-center" style={{ marginTop: '80px' }}>
            <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-xl border">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <i className="fa-solid fa-times text-5xl"></i>
                </div>

                <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Paiement annulé</h1>
                <p className="text-xl text-gray-600 mb-8">
                    La transaction a été interrompue. Votre panier a été conservé afin que vous puissiez réessayer plus tard.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/checkout"
                        className="block bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
                    >
                        Réessayer le paiement
                    </Link>
                    <Link
                        href="/shop"
                        className="block text-gray-500 hover:text-green-600 font-medium transition-colors"
                    >
                        Retourner à la boutique
                    </Link>
                </div>
            </div>
        </div>
    );
}
