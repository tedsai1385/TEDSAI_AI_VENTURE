'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function CheckoutCancelPage() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
            <Container size="sm" className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-lg">
                        <XCircle size={48} />
                    </div>

                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-4">Paiement annulé</h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            Le processus de paiement a été interrompu. Ne vous inquiétez pas, votre panier est toujours intact.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/vitedia#order-form">
                            <Button variant="primary" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] flex items-center gap-2">
                                <ArrowLeft size={18} /> Revoir mon panier
                            </Button>
                        </Link>
                        <Link href="/vitedia">
                            <Button variant="ghost">Menu du Jour</Button>
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
