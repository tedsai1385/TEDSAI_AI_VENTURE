import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Truck, CreditCard, ShieldCheck } from 'lucide-react';

export const LivraisonPaiement = () => {
    return (
        <Section spacing="base" className="bg-white">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <Truck size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Livraison Yaoundé Express</h3>
                        <p className="text-sm text-gray-600">
                            Livré chez vous ou au bureau en moins de 24h. <br />
                            <span className="font-bold text-blue-600">Gratuit dès 25 000 FCFA.</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Paiement Mobile Sécurisé</h3>
                        <p className="text-sm text-gray-600">
                            Payez directement avec Orange Money ou MTN Mobile Money.
                            Ou choisissez le paiement à la livraison (Cash).
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Garantie Qualité</h3>
                        <p className="text-sm text-gray-600">
                            Produits vérifiés et emballés avec soin.
                            Satisfait ou remboursé sous 48h en cas de problème.
                        </p>
                    </div>
                </div>

                {/* Zone Map Strip */}
                <div className="mt-12 h-24 bg-gray-200 rounded-xl overflow-hidden relative flex items-center justify-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest z-10">Carte des zones de livraison (Placeholder)</p>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Yaound%C3%A9_OpenStreetMap.png/640px-Yaound%C3%A9_OpenStreetMap.png')] bg-cover bg-center" />
                </div>
            </Container>
        </Section>
    );
};
