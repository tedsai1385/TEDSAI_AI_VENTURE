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
            {/* Background avec overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
                {/* Image principale du Hero */}
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
                    className="max-w-4xl pt-20"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex gap-3 mb-8 flex-wrap"
                    >
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ 100% Traçabilité Blockchain
                        </Badge>
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ 5 Piliers Intégrés
                        </Badge>
                        <Badge variant="accent" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors cursor-default shadow-lg shadow-black/20">
                            ✓ -40% Gaspillage Alimentaire
                        </Badge>
                    </motion.div>

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
                            className="text-6xl md:text-8xl font-bold font-heading leading-[0.9] text-white tracking-tight"
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
                            className="text-6xl md:text-8xl font-bold font-heading leading-[0.9] text-[var(--color-primary-light)] tracking-tight"
                        >
                            ORGANIQUE
                        </motion.h1>
                    </div>

                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-2xl md:text-3xl font-light text-gray-200 mb-8 max-w-2xl leading-tight"
                    >
                        L'écosystème où la technologie sert la terre, la table et votre business.
                    </motion.h2>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        className="text-lg text-gray-300 mb-12 leading-relaxed font-light max-w-2xl border-l-4 border-[var(--color-accent)] pl-6 py-1"
                    >
                        Bienvenue au TEDSAI Complex à Yaoundé : le premier écosystème africain synchronisant l'excellence biologique et l'intelligence prédictive.
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                    >
                        <Link href="/vitedia">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    variant="primary"
                                    rightIcon={<ArrowRight size={20} />}
                                    className="text-lg px-8 py-6 rounded-full shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] border-2 border-transparent hover:border-white/20"
                                >
                                    🍽️ Réserver une Table
                                </Button>
                            </motion.div>
                        </Link>

                        <div className="flex gap-3">
                            <Link href="/boutique">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-6 rounded-full"
                                    >
                                        🛒 Boutique
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/solutions-ia">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-[var(--color-accent)]/80 border-none text-white hover:bg-[var(--color-accent)] px-6 py-6 rounded-full shadow-lg shadow-[var(--color-accent)]/30"
                                    >
                                        🤖 IA PME
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Scroll indicator */}
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
                    <span className="text-[10px] uppercase tracking-widest font-medium">Découvrir</span>
                    <div className="w-6 h-10 border-2 border-currentColor rounded-full flex justify-center pt-2 p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-currentColor rounded-full"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
