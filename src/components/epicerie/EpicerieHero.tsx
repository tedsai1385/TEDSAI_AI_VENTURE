'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { ShoppingBag, Search } from 'lucide-react';

export const EpicerieHero = () => {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center overflow-hidden bg-[#Fdfbf7]">
            {/* Decorative Background */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-[var(--color-primary-50)] rounded-l-[10rem] opacity-50 z-0" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 z-0" />

            <Container className="relative z-10 flex items-center gap-12">
                <div className="max-w-2xl">
                    <div className="text-[var(--color-primary)] font-bold tracking-widest text-sm uppercase mb-4">
                        Épicerie Fine Camerounaise
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight text-gray-900">
                        L'Épicerie du <span className="text-[var(--color-primary)]">Futur</span> <br />
                        Pépites Locales.
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                        Le meilleur du Cameroun, certifié et livré.
                        Poivre de Penja IGP, Miel d'Oku, Cafés volcaniques. Une sélection rigoureuse, sourcée directement chez les petits producteurs.
                    </p>

                    <div className="bg-white p-2 rounded-full shadow-lg max-w-md flex items-center border border-gray-100 mb-8">
                        <Search className="ml-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher (ex: Poivre blanc...)"
                            className="flex-1 px-4 py-2 outline-none text-gray-700 bg-transparent"
                        />
                        <Button size="md" variant="primary" className="rounded-full" onClick={() => alert("Fonction de recherche en cours de développement (Demo)")}>
                            Trouver
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Bio & Naturel
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500" /> Commerce Équitable
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Paiement Mobile
                        </span>
                    </div>
                </div>
            </Container>
        </section>
    );
};
