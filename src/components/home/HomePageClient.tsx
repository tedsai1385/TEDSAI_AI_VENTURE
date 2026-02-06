'use client';

import { Hero } from '@/components/sections/Hero';
import { Principles } from '@/components/sections/Principles';
import { Products } from '@/components/sections/Products';
import { useChatbot } from '@/context/ChatbotContext';
import { motion } from 'framer-motion';
import { CheckCircle, Network, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button-mobile';
import Link from 'next/link';

export default function HomePageClient() {
    const { openChat } = useChatbot();

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            {/* 1. Mobile-Optimized Hero */}
            <Hero />

            {/* 2. Stats Section (Kept from original but cleaned up) */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                        {[
                            { value: '100%', label: 'Traçabilité', icon: CheckCircle },
                            { value: '3', label: 'Piliers Intégrés', icon: Network },
                            { value: '24/7', label: 'Assistant IA', icon: Sparkles },
                            { value: '🇨🇲', label: 'Made in CMR', icon: null },
                        ].map((stat, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={stat.label === 'Assistant IA' ? openChat : undefined}
                                className={`w-full text-center p-2 rounded-xl transition-all ${stat.label === 'Assistant IA' ? 'hover:bg-white/50 active:scale-95' : ''
                                    }`}
                            >
                                {stat.icon ? (
                                    <stat.icon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-purple-600" />
                                ) : (
                                    <div className="text-3xl sm:text-5xl mb-2">{stat.value === '🇨🇲' ? '🇨🇲' : ''}</div>
                                )}
                                <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">
                                    {stat.value !== '🇨🇲' && stat.value}
                                </div>
                                <div className="text-xs sm:text-base text-gray-600 font-medium">{stat.label}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Mobile-Optimized Three Pillars */}
            <Principles />

            {/* 4. Mobile-Optimized Products */}
            <Products />

            {/* 5. Ecosystem Link (Simplified) */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-fluid-2xl font-bold mb-4">Notre Écosystème</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Découvrez la synergie entre nos trois pôles et notre vision pour un futur durable.
                    </p>
                    <Link href="/ecosystem">
                        <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                            Explorer l'Écosystème <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

        </main>
    );
}
