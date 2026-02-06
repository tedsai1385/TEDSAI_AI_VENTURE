'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const HeroSection = () => {
    return (
        <section className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden">
            {/* Background inchangé */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                <Image
                    src="/images/hero_main.png"
                    alt="TEDSAI - L'Algorithme Organique"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#002200]/90 via-[#002200]/60 to-transparent mix-blend-multiply" />
            </div>

            <Container className="relative z-20 text-white h-full flex flex-col justify-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15,
                                delayChildren: 0.3
                            }
                        }
                    }}
                    className="max-w-5xl pt-20"
                >
                    {/* Badges - taille augmentée */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex gap-3 mb-8 flex-wrap justify-center sm:justify-start"
                    >
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-2 text-sm md:text-base font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ 100% Traçabilité
                        </Badge>
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-2 text-sm md:text-base font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ 5 Piliers
                        </Badge>
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-2 text-sm md:text-base font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ -40% Gaspillage
                        </Badge>
                    </motion.div>

                    {/* ═════════════════════════════════════════════════════════════════
                        TITRE PRINCIPAL - TAILLE MAXIMUM FLUIDE
                        ═════════════════════════════════════════════════════════════════ */}
                    <div className="overflow-hidden mb-2">
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 100 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                                }
                            }}
                            className="text-[clamp(2.5rem,12vw,8rem)] leading-[0.9] font-bold font-heading text-white tracking-tighter break-words max-w-full sm:text-[clamp(3rem,10vw,7rem)] lg:text-[clamp(4rem,9vw,8rem)] xl:text-[clamp(5rem,8vw,9rem)]"
                        >
                            L'ALGORITHME
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 100 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                                }
                            }}
                            className="text-[clamp(2.5rem,12vw,8rem)] leading-[0.9] font-bold font-heading text-[var(--color-primary-light)] tracking-tighter break-words max-w-full sm:text-[clamp(3rem,10vw,7rem)] lg:text-[clamp(4rem,9vw,8rem)] xl:text-[clamp(5rem,8vw,9rem)]"
                        >
                            ORGANIQUE
                        </motion.h1>
                    </div>

                    {/* ═════════════════════════════════════════════════════════════════
                        SOUS-TITRE - AUGMENTÉ PROPORTIONNELLEMENT
                        ═════════════════════════════════════════════════════════════════ */}
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-[clamp(1.125rem,3vw,2rem)] font-light text-gray-200 mb-8 max-w-3xl leading-snug sm:text-[clamp(1.25rem,2.5vw,1.75rem)] lg:text-[clamp(1.5rem,2vw,2rem)]"
                    >
                        L'écosystème où la technologie sert la terre, la table et votre business.
                    </motion.h2>

                    {/* ═════════════════════════════════════════════════════════════════
                        DESCRIPTION - AUGMENTÉE POUR LISIBILITÉ
                        ═════════════════════════════════════════════════════════════════ */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        className="text-[clamp(0.9375rem,2vw,1.125rem)] text-gray-300 mb-10 leading-relaxed font-light max-w-3xl border-l-4 border-[var(--color-accent)] pl-5 py-2 sm:text-base lg:text-lg"
                    >
                        Bienvenue au TEDSAI Complex à Yaoundé : le premier écosystème africain synchronisant l'excellence biologique et l'intelligence prédictive.
                    </motion.div>

                    {/* Boutons - taille augmentée */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto"
                    >
                        <Link href="/vitedia" className="w-full sm:w-auto">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="primary"
                                    rightIcon={<ArrowRight size={20} />}
                                    className="text-lg w-full sm:w-auto px-8 py-5 rounded-full shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] border-2 border-transparent hover:border-white/20 justify-center"
                                >
                                    🍽️ Réserver une Table
                                </Button>
                            </motion.div>
                        </Link>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link href="/boutique" className="flex-1 sm:flex-none">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-base w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-5 rounded-full justify-center"
                                    >
                                        🛒 Boutique
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/solutions-ia" className="flex-1 sm:flex-none">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-base w-full sm:w-auto bg-[var(--color-accent)]/80 border-none text-white hover:bg-[var(--color-accent)] px-6 py-5 rounded-full shadow-lg shadow-[var(--color-accent)]/30 justify-center"
                                    >
                                        🤖 IA PME
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Scroll indicator - légèrement augmenté */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 1.5, duration: 1 },
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs sm:text-sm uppercase tracking-widest font-medium">Découvrir</span>
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2 p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-current rounded-full"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
