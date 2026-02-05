'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

export const ObservatoireHero = () => {
    return (
        <section className="relative w-full py-20 bg-[var(--color-primary)] text-white overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-10 bg-repeat"
                style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}
            />

            <Container className="relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur border border-blue-500/30 text-sm font-bold tracking-wider uppercase mb-6 text-blue-200">
                        57 articles • 12 000 lecteurs
                    </span>

                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                        Comprendre, Décider, <br /><span className="text-green-300">Agir</span>.
                    </h1>

                    <p className="text-xl text-green-50 mb-10 font-light leading-relaxed">
                        Analyses de fond, tendances technologiques et guides pratiques pour l'agriculteur urbain, le restaurateur moderne et l'entrepreneur connecté.
                    </p>

                    <div className="bg-white p-2 rounded-full shadow-2xl max-w-xl mx-auto flex items-center">
                        <Search className="ml-4 text-gray-400" size={24} />
                        <input
                            type="text"
                            placeholder="Rechercher un article, un dossier..."
                            className="flex-1 px-4 py-3 outline-none text-gray-800 text-lg placeholder-gray-400"
                        />
                        <Button size="lg" variant="primary" className="rounded-full px-8" onClick={() => alert("Recherche d'articles de l'Observatoire (Demo)")}>
                            Rechercher
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
};
