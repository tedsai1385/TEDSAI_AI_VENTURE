'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { ShoppingBag, Search } from 'lucide-react';

export const BoutiqueHero = () => {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center overflow-hidden bg-[#Fdfbf7]">
            {/* Decorative Background */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-[var(--color-primary-50)] rounded-l-[10rem] opacity-50 z-0" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 z-0" />

            <Container className="relative z-10 flex items-center gap-12">
                <div className="max-w-2xl">
                    <div className="text-[var(--color-primary)] font-bold tracking-widest text-sm uppercase mb-4">
                        Boutique TEDSAI
                    </div>

                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight text-gray-900">
                        Pépites Locales & <br />
                        <span className="text-[var(--color-primary)]">Qualité Certifiée</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                        Le meilleur du Cameroun, en un clic.<br />
                        Produits de notre jardin aquaponique et sélection rigoureuse des meilleures pépites locales : miel d'Oku, poivre de Penja, épices rares, huiles artisanales.
                    </p>

                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => window.open('https://wa.me/237699999999', '_blank')}
                        >
                            📱 Commander sur WhatsApp
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full border-green-600 text-green-700 hover:bg-green-50"
                            onClick={() => {
                                document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            🛒 Voir le Catalogue
                        </Button>
                    </div>

                    <div className="mt-8 text-sm text-gray-500 font-medium">
                        Commandez sur WhatsApp, TikTok, Facebook, Telegram — nous livrons à Yaoundé.
                    </div>
                </div>
            </Container>
        </section>
    );
};
