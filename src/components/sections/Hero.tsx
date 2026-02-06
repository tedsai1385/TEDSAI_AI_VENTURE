'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button-mobile';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Background avec parallax désactivé sur mobile */}
            <div className="absolute inset-0 hidden sm:block">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center"
                />
                {/* Overlay pour le texte desktop */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Mobile: background statique et léger */}
            <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-purple-50 to-white" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="text-center">

                    {/* ═══════════════════════════════════════════════════════════════
              TITRE AVEC TAILLE FLUIDE ET COULEUR FORCÉE
              ═══════════════════════════════════════════════════════════════ */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-fluid-5xl sm:text-fluid-6xl lg:text-fluid-7xl font-bold text-gray-900 sm:text-white text-mobile-dark leading-tight tracking-tight"
                    >
                        L'Intelligence Artificielle
                        <br className="hidden sm:block" />
                        <span className="text-purple-600 sm:text-purple-300"> au service de l'Afrique</span>
                    </motion.h1>

                    {/* Sous-titre */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-4 sm:mt-6 text-fluid-base sm:text-fluid-lg text-gray-600 sm:text-gray-100 max-w-2xl mx-auto px-2 sm:px-0"
                    >
                        TEDSAI développe des solutions AgriTech innovantes pour transformer
                        l'agriculture urbaine et créer un avenir durable.
                    </motion.p>

                    {/* ═══════════════════════════════════════════════════════════════
              BOUTONS CÔTE À CÔTE SUR MOBILE
              ═══════════════════════════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 sm:mt-10 flex flex-row items-center justify-center gap-2 sm:gap-4"
                    >
                        <Button
                            size="default"
                            className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none max-w-[160px] sm:max-w-none"
                        >
                            Découvrir
                            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2 hidden sm:inline" />
                        </Button>

                        <Button
                            variant="outline"
                            size="default"
                            className="border-gray-300 sm:border-white/30 sm:text-white sm:hover:bg-white/10 flex-1 sm:flex-none max-w-[160px] sm:max-w-none"
                        >
                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Vidéo
                        </Button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
