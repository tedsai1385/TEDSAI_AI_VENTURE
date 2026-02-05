import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const ImpactEcologique = () => {
    return (
        <Section spacing="base" className="bg-[var(--color-primary-50)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Plus de Goût, Moins d'Impact</h2>
                    <p className="text-[var(--color-text-secondary)]">
                        L'agriculture de demain est déjà là. Comparons les chiffres.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Colonne Traditionnelle */}
                    <div className="opacity-60 bg-white p-8 rounded-2xl border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-500 mb-6 text-center">Agriculture Traditionnelle</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Consommation d'eau</span>
                                <span className="font-bold text-red-400">100 Litres / kg</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Transport</span>
                                <span className="font-bold text-red-400">~200 km (Moyenne)</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Pesticides</span>
                                <span className="font-bold text-red-400">Présents</span>
                            </div>
                            <div className="flex items-center justify-between pb-4">
                                <span className="text-gray-500">Saisonnalité</span>
                                <span className="font-bold text-red-400">Limitée</span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne TEDSAI */}
                    <Card variant="elevated" className="bg-white p-8 border-2 border-[var(--color-primary)] relative transform md:-translate-y-4 shadow-2xl">
                        <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Technologie TEDSAI
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-6 text-center">SelecTED Garden</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-600 font-medium">Consommation d'eau</span>
                                <div className="text-right">
                                    <span className="font-bold text-[var(--color-primary)]">10 Litres / kg</span>
                                    <div className="flex items-center justify-end text-xs text-green-600 gap-1"><ArrowDown size={12} /> -90%</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-600 font-medium">Transport</span>
                                <div className="text-right">
                                    <span className="font-bold text-[var(--color-primary)]">0 km (Local)</span>
                                    <div className="flex items-center justify-end text-xs text-green-600 gap-1"><ArrowDown size={12} /> -100% CO2</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <span className="text-gray-600 font-medium">Pesticides</span>
                                <div className="text-right">
                                    <span className="font-bold text-[var(--color-primary)]">0% (Strict)</span>
                                    <div className="flex items-center justify-end text-xs text-green-600 gap-1"><ShieldCheck size={12} /> Garanti</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-4">
                                <span className="text-gray-600 font-medium">Saisonnalité</span>
                                <div className="text-right">
                                    <span className="font-bold text-[var(--color-primary)]">Toute l'année</span>
                                    <div className="flex items-center justify-end text-xs text-green-600 gap-1"><ArrowUp size={12} /> +Productivité</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Container>
        </Section>
    );
};

import { ShieldCheck } from 'lucide-react';
