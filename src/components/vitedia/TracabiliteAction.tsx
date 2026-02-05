import React from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScanLine, ArrowRight } from 'lucide-react';

export const TracabiliteAction = () => {
    return (
        <Section spacing="base" className="bg-white overflow-hidden">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="flex-1 order-2 lg:order-1 relative">
                        {/* Mockup smartphone scan */}
                        <div className="relative w-64 mx-auto lg:w-80 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20" />

                            {/* Screen content */}
                            <div className="w-full h-full bg-white relative">
                                {/* Camera view bg */}
                                <div className="absolute inset-0 bg-gray-200">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-accent)]" />
                                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-accent)]" />
                                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-accent)]" />
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-accent)]" />

                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--color-accent)] animate-scan shadow-[0_0_10px_var(--color-accent)]" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-20 left-0 w-full text-center px-8">
                                        <div className="bg-black/60 backdrop-blur text-white text-xs py-2 px-4 rounded-full inline-block">
                                            Scannez le code sur votre assiette
                                        </div>
                                    </div>
                                </div>

                                {/* Result Overlay (Slide up) */}
                                <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-transform transform translate-y-0">
                                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                                    <h4 className="font-bold text-lg mb-1">Poulet DG Revisité</h4>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✅ Certifié</span>
                                        <span className="text-xs text-gray-500">Lot #PDG-2026-01</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">Plantains</span>
                                            <span className="font-medium">SelecTED Garden (0km)</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">Récolte</span>
                                            <span className="font-medium text-[var(--color-primary)]">Ce matin, 07:15</span>
                                        </div>
                                    </div>
                                    <Button fullWidth size="sm" variant="primary" className="mt-4">
                                        Voir fiche complète
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--color-accent)]/20 rounded-full -z-10" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[var(--color-accent)]/40 rounded-full -z-10" />
                    </div>

                    <div className="flex-1 order-1 lg:order-2">
                        <Badge variant="accent" className="mb-4">Live Demo</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            L'histoire de votre plat <br />
                            <span className="text-[var(--color-primary)]">révélée en un scan.</span>
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                            Chaque ingrédient clé proviennent de sources identifiées, souvent de notre propre SelecTED Garden.
                        </p>

                        <div className="space-y-6 mb-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="font-bold text-lg">Commandez votre plat</h4>
                                    <p className="text-sm text-gray-600">Choisissez parmi notre sélection traçable.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="font-bold text-lg">Localisez le QR Code</h4>
                                    <p className="text-sm text-gray-600">Sur le menu, l'étiquette ou le petit chevalet.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="font-bold text-lg">Scannez et Découvrez</h4>
                                    <p className="text-sm text-gray-600">Accédez instantanément à la fiche d'identité du produit.</p>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
                            Essayer la démo maintenant
                        </Button>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
