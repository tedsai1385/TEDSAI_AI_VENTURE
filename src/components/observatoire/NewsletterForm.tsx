'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Mail, Shield } from 'lucide-react';

export const NewsletterForm = () => {
    return (
        <Section spacing="none" className="py-20 bg-[#0A1A2F] text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-20" />

            <Container className="relative z-10 text-center max-w-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-6">
                    <Mail size={32} className="text-blue-300" />
                </div>

                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    Restez en avance sur le futur.
                </h2>
                <p className="text-gray-300 mb-8 text-lg">
                    Rejoignez les 5,000+ décideurs qui reçoivent chaque mardi notre condensé d'innovations agri-tech et business.
                </p>

                <form className="max-w-md mx-auto relative mb-6" onSubmit={(e) => { e.preventDefault(); alert("Merci pour votre inscription ! (Demo)"); }}>
                    <input
                        type="email"
                        placeholder="votre.email@entreprise.com"
                        className="w-full pl-6 pr-32 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        required
                    />
                    <div className="absolute top-1.5 right-1.5">
                        <Button variant="primary" size="md" className="rounded-full shadow-lg" type="submit">
                            S'inscrire
                        </Button>
                    </div>
                </form>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield size={12} />
                    <span>Pas de spam. Désinscription en 1 clic.</span>
                </div>
            </Container>
        </Section>
    );
};
