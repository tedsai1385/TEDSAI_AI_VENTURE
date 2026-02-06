'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { ShoppingBag, Search } from 'lucide-react';

export const BoutiqueHero = () => {
    return (
        <section className="relative w-full h-auto min-h-[500px] py-12 md:py-0 flex items-center overflow-hidden bg-[#Fdfbf7]">
            {/* Decorative Background - Hidden on mobile or adjusted */}
            <div className="absolute right-0 top-0 w-full md:w-1/2 h-1/2 md:h-full bg-[var(--color-primary-50)] rounded-bl-[5rem] md:rounded-l-[10rem] opacity-30 md:opacity-50 z-0" />
            <div className="absolute -right-20 -top-20 w-64 h-64 md:w-96 md:h-96 bg-orange-100 rounded-full blur-3xl opacity-50 z-0" />

            <Container className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="max-w-2xl w-full">
                    <div className="text-[var(--color-primary)] font-bold tracking-widest text-xs md:text-sm uppercase mb-3 md:mb-4">
                        Boutique TEDSAI
                    </div>

                    <h1 className="text-hero font-heading font-bold mb-4 md:mb-6 leading-tight text-gray-900 break-words">
                        Pépites Locales & <br />
                        <span className="text-[var(--color-primary)]">Qualité Certifiée</span>
                    </h1>

                    <p className="text-body text-gray-600 mb-6 md:mb-8 leading-relaxed font-light">
                        Le meilleur du Cameroun, en un clic.<br className="hidden md:block" />
                        Produits de notre jardin aquaponique et sélection rigoureuse des meilleures pépites locales : miel d'Oku, poivre de Penja, épices rares, huiles artisanales.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="rounded-full bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto justify-center text-btn py-4"
                            onClick={() => window.open('https://wa.me/237699999999', '_blank')}
                        >
                            📱 Commander sur WhatsApp
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full border-green-600 text-green-700 hover:bg-green-50 w-full sm:w-auto justify-center text-btn py-4"
                            onClick={() => {
                                document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            🛒 Voir le Catalogue
                        </Button>
                    </div>

                    <div className="mt-8 text-xs md:text-sm text-gray-500 font-medium max-w-md">
                        Commandez sur WhatsApp, TikTok, Facebook, Telegram — nous livrons à Yaoundé.
                    </div>
                </div>
            </Container>
        </section>
    );
};
