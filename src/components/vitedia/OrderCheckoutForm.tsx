'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ShoppingBag, User, Phone, MessageSquare, CheckCircle, CreditCard } from 'lucide-react';
import { useOrderStore } from '@/lib/store/order-store';
import { cn } from '@/lib/utils';

export const OrderCheckoutForm = ({ cart, total, onClear }: { cart: any[], total: number, onClear: () => void }) => {
    const { } = useOrderStore(); // We only need the store structure now, orders are managed via API
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/restaurant/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    customerData: formData,
                    paymentMethod
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur lors de la création du paiement');
            }

            const data = await response.json();

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                setStep(2); // Fallback success if no url (should not happen)
                onClear();
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0 && step === 1) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-50 rounded-lg border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-400">Votre panier est vide</h3>
                <p className="text-sm text-gray-400">Sélectionnez des délices dans le menu pour commander.</p>
            </div>
        );
    }

    return (
        <Card padded className="bg-white shadow-xl relative overflow-hidden h-full border-t-4 border-[var(--color-secondary)]">
            {step === 1 ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-[var(--color-secondary)] mb-4">
                        <ShoppingBag size={24} />
                        <h3 className="text-xl font-bold">Finaliser ma Commande</h3>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg space-y-2 mb-6">
                        {cart.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="font-medium">{item.quantity}x {item.name}</span>
                                <span className="text-gray-500">{(item.price * item.quantity).toLocaleString()} CFA</span>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg text-[var(--color-secondary)]">
                            <span>Total</span>
                            <span>{total.toLocaleString()} CFA</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User size={14} /> Nom complet
                                </label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
                                    placeholder="M. / Mme ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone size={14} /> Téléphone
                                </label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none"
                                    placeholder="6XX XX XX XX"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                Mode de Paiement
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('momo')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                                        paymentMethod === 'momo'
                                            ? "border-[var(--color-secondary)] bg-neutral-50"
                                            : "border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-[8px] text-white font-bold">OM</div>
                                        <div className={cn("w-6 h-6 bg-yellow-400 rounded-md flex items-center justify-center text-[8px] text-black font-bold")}>MTN</div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">Mobile Money</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                                        paymentMethod === 'card'
                                            ? "border-[var(--color-secondary)] bg-neutral-50"
                                            : "border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <CreditCard size={20} className="text-blue-600" />
                                    <span className="text-xs font-bold text-gray-700">Carte Bancaire</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MessageSquare size={14} /> Instructions (Optionnel)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-secondary)] outline-none h-16"
                                placeholder="Ex: Sans piment, livraison à domicile..."
                            />
                        </div>

                        <Button
                            fullWidth
                            variant="primary"
                            type="submit"
                            className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] h-12"
                            loading={isLoading}
                        >
                            {paymentMethod === 'card' ? 'Payer par Carte' : 'Payer via MoMo / OM'}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-pulse">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Commande Validée !</h3>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                        C'est parti ! Nos chefs préparent vos délices. Vous recevrez un appel pour la livraison.
                    </p>
                    <Button onClick={() => setStep(1)} variant="outline" fullWidth>
                        Passer une autre commande
                    </Button>
                </div>
            )}
        </Card>
    );
};
