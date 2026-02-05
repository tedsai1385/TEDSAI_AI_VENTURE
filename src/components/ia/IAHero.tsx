import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MessageSquare, BarChart3, Bot } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const IAHero = () => {
    return (
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-[#0A1A2F]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/ia-placeholder.jpg"
                    alt="Intelligence Artificielle TEDSAI"
                    fill
                    className="object-cover object-center opacity-70"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A2F]/80 via-[#0A1A2F]/40 to-transparent z-10" />
            </div>

            {/* Background Tech Elements (kept for texture) */}
            <div className="absolute inset-0 z-1 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(13,148,136,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <Container className="relative z-20 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                        <Badge variant="secondary" className="mb-6 bg-blue-900/50 text-blue-200 border border-blue-700/50 backdrop-blur">
                            <Bot size={14} className="mr-2" /> Intelligence Artificielle pour PME
                        </Badge>

                        <h1 className="text-white text-5xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                            TEDSAI Digital Solutions — <span className="text-cyan-400">Zéro Hasard</span>.
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                            L'IA qui parle le terrain camerounais. Ne subissez plus votre business. Pilotez-le.
                            Des algorithmes conçus pour les PME. Pas de jargon. Juste des économies mesurables.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/solutions-ia#demo">
                                <Button size="lg" variant="primary" className="bg-cyan-600 hover:bg-cyan-700 border-none" leftIcon={<MessageSquare size={20} />}>
                                    Démo Chatbot
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                                    leftIcon={<BarChart3 size={20} />}
                                >
                                    Diagnostic Gratuit
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 text-sm text-gray-400">
                            <div>
                                <strong className="block text-2xl text-white font-heading">-31%</strong>
                                Gaspillage
                            </div>
                            <div className="w-px h-8 bg-gray-700" />
                            <div>
                                <strong className="block text-2xl text-white font-heading">ROI &lt; 180j</strong>
                                Investissement
                            </div>
                            <div className="w-px h-8 bg-gray-700" />
                            <div>
                                <strong className="block text-2xl text-white font-heading">100% Local</strong>
                                Données Hébergées
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        {/* Abstract visual representation of AI */}
                        <div className="relative w-full h-[500px] border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-4 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="text-xs text-mono text-gray-400">IA-Venture-OS v2.4</div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex gap-2">
                                    <span className="text-cyan-400">➜</span>
                                    <span className="text-gray-300">Analyse données ventes (S1 2026)...</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-cyan-200">Terminé (0.4s)</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-cyan-400">➜</span>
                                    <span className="text-gray-300">Prédiction stock semaine prochaine :</span>
                                </div>
                                <div className="pl-6 bg-black/20 p-2 rounded border border-white/5 text-xs">
                                    <div className="flex justify-between mb-1">
                                        <span>Produit A</span>
                                        <span className="text-green-400">+12% (Forte demande)</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span>Produit B</span>
                                        <span className="text-yellow-400">-5% (Stable)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Produit C</span>
                                        <span className="text-red-400">-30% (Surstock risque)</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 animate-pulse">
                                    <span className="text-cyan-400">➜</span>
                                    <span className="text-gray-300">Génération rapport WhatsApp...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
