'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'CM',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create checkout session
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.items,
                    userId: 'guest', // Using guest for now, can be updated with auth
                    shippingAddress,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Checkout failed');
            }

            const { url } = await response.json();

            // Redirect to Stripe Checkout Checkout
            window.location.href = url;

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Erreur lors de la commande. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center" style={{ minHeight: '60vh' }}>
                <i className="fa-solid fa-cart-shopping text-6xl text-gray-200 mb-6"></i>
                <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
                <p className="text-gray-600 mb-8">Ajoutez des produits pour passer commande.</p>
                <button
                    onClick={() => router.push('/shop')}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    Voir le catalogue
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16" style={{ marginTop: '80px' }}>
            <h1 className="text-4xl font-bold mb-8 text-center">Finaliser votre commande</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Shipping Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-truck text-green-600"></i>
                        Informations de livraison
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Nom Complet *</label>
                                <input
                                    type="text"
                                    required
                                    value={shippingAddress.name}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={shippingAddress.email}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="jean@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Téléphone *</label>
                            <input
                                type="tel"
                                required
                                value={shippingAddress.phone}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="+237 6XX XXX XXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Adresse de livraison *</label>
                            <input
                                type="text"
                                required
                                value={shippingAddress.street}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Rue, Quartier..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Ville *</label>
                                <input
                                    type="text"
                                    required
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Yaoundé / Douala"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Code Postal (Optionnel)</label>
                                <input
                                    type="text"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="00237"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all mt-6 shadow-lg shadow-green-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-spinner fa-spin"></i> Traitement...
                                </span>
                            ) : (
                                `Payer ${cart.total.toLocaleString()} XAF`
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-2xl border">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-list-check text-green-600"></i>
                            Récapitulatif
                        </h2>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center gap-4 border-b pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-white">
                                            <Image
                                                src={item.image || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} XAF</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-3 pt-6 border-t border-dashed border-gray-300">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{cart.subtotal.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>TVA (19%)</span>
                                <span>{cart.tax.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Livraison (Standard)</span>
                                <span>{cart.shipping.toLocaleString()} XAF</span>
                            </div>
                            <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t">
                                <span>Total</span>
                                <span>{cart.total.toLocaleString()} XAF</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <i className="fa-solid fa-shield-halved text-blue-600 text-xl mt-1"></i>
                        <p className="text-sm text-blue-800">
                            <strong>Paiement Sécurisé :</strong> Vos transactions sont protégées par Stripe. TedSAI ne stocke aucune information de carte bancaire.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
