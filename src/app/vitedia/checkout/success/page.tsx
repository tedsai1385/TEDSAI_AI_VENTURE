'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
            <Container size="sm" className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-lg">
                        <CheckCircle size={48} />
                    </div>

                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-4">Merci pour votre commande !</h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            Votre paiement a été validé avec succès. Nos chefs commencent à préparer vos délices.
                            Vous recevrez un appel de confirmation sous peu.
                        </p>
                    </div>

                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex items-center gap-4 text-left max-w-sm mx-auto">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <ChefHat className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="font-bold">viTEDia Restaurant</p>
                            <p className="text-sm text-gray-500">Préparation en cours...</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/vitedia">
                            <Button variant="primary" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]">
                                Retour au restaurant
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                Accueil TEDSAI
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
