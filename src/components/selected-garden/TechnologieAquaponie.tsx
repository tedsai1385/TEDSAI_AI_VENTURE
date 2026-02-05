import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Droplets, Sprout, Fish, ShieldCheck } from 'lucide-react';

export const TechnologieAquaponie = () => {
    return (
        <Section spacing="lg" className="bg-white">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="uppercase tracking-widest text-sm font-bold text-green-600 mb-2">Technologie</div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            L'Aquaponie : <br />
                            L'Intelligence de la Nature
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                            C'est un cercle vertueux. Les poissons nourrissent les plantes, et les plantes purifient l'eau pour les poissons.
                            Ce cycle naturel bi-directionnel permet une production intensive sur de petites surfaces urbaines, sans aucun intrant chimique.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50">
                                <Fish className="text-blue-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold">Le Poisson nourrit la plante</h4>
                                    <p className="text-sm text-gray-600">Les déjections des poissons sont transformées en nutriments naturels.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50">
                                <Sprout className="text-green-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold">L'IA règle le climat</h4>
                                    <p className="text-sm text-gray-600">Capteurs pH, température et oxygène en temps réel.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50">
                                <ShieldCheck className="text-orange-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold">Vous vérifiez tout</h4>
                                    <p className="text-sm text-gray-600">Chaque récolte a son certificat blockchain unique.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                <Droplets className="text-gray-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold">Zéro Déchet</h4>
                                    <p className="text-sm text-gray-600">Circuit fermé. L'eau purifiée retourne aux poissons.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        {/* Diagramme visuel simplifié de l'aquaponie */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Cercle Poissons */}
                            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center bg-blue-50/50">
                                <div className="text-center p-8">
                                    <Fish className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                                    <h3 className="font-bold text-blue-800">Aquaculture</h3>
                                    <p className="text-xs text-blue-600">Les déjections des poissons créent de l'ammoniaque</p>
                                </div>
                            </div>

                            {/* Cercle Plantes */}
                            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-full border-4 border-dashed border-green-200 flex items-center justify-center bg-green-50/50 mix-blend-multiply">
                                <div className="text-center p-8">
                                    <Sprout className="w-16 h-16 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-bold text-green-800">Hydroponie</h3>
                                    <p className="text-xs text-green-600">Les plantes absorbent les nitrates et filtrent l'eau</p>
                                </div>
                            </div>

                            {/* Flèches de cycle center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border-4 border-[var(--color-accent)] animate-spin-slow">
                                <div className="text-[var(--color-accent)] text-xs font-bold text-center">
                                    Biofiltre<br />Bactéries
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
