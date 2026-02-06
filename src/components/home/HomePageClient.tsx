'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatbot } from '@/context/ChatbotContext';
import {
    Brain,
    Utensils,
    Leaf,
    Network,
    Satellite,
    ArrowRight,
    CheckCircle,
    Sparkles
} from 'lucide-react';

export default function HomePageClient() {
    const { openChat } = useChatbot();
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/images/hero_bg.webp"
                        alt="TEDSAI Complex Ecosystem"
                        fill
                        className="object-cover brightness-[0.5] contrast-[1.1]"
                        priority
                        quality={90}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-blue-950/90" />
                </div>

                {/* Content */}
                <div className="container relative z-10 mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                        >
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-black text-sm font-medium">
                                Écosystème Intelligent Opérationnel
                            </span>
                        </motion.div>

                        {/* Main Title */}
                        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                            <span className="text-white drop-shadow-2xl">
                                TEDSAI Complex
                            </span>
                        </h1>

                        {/* Slogan */}
                        <p className="text-3xl md:text-5xl font-light text-white mb-4 drop-shadow-lg">
                            De la Data à l'Assiette
                        </p>

                        {/* Description */}
                        <p className="text-xl text-white/95 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                            Un écosystème intelligent unifiant <strong className="text-white font-semibold">Intelligence Artificielle</strong>,
                            <strong className="text-white font-semibold"> SelecTED Garden</strong>, <strong className="text-white font-semibold">Élevage Durable</strong> et
                            <strong className="text-white font-semibold"> Gastronomie Traçable</strong> au cœur du Cameroun.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/ecosystem">
                                    <Button size="lg" className="rounded-full shadow-xl hover:shadow-2xl">
                                        Découvrir l'Écosystème
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button
                                    onClick={openChat}
                                    className="px-8 py-3 bg-white/20 backdrop-blur-md border-2 border-white/50 text-black rounded-full hover:bg-white/30 transition-all font-semibold shadow-xl flex items-center gap-2"
                                >
                                    Discuter avec l'IA
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                        <div className="w-1 h-3 bg-white/50 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '100%', label: 'Traçabilité Garantie', icon: CheckCircle },
                            { value: '3', label: 'Piliers Intégrés', icon: Network },
                            { value: '24/7', label: 'Assistant IA', icon: Sparkles },
                            { value: '🇨🇲', label: 'Made in Cameroun', icon: null },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <button
                                    onClick={stat.label === 'Assistant IA' ? openChat : undefined}
                                    className={`w-full text-center ${stat.label === 'Assistant IA' ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                                >
                                    {stat.icon ? (
                                        <stat.icon className="w-12 h-12 mx-auto mb-2 text-primary-600" />
                                    ) : (
                                        <div className="text-5xl mb-2">{stat.value === '🇨🇲' ? '🇨🇲' : ''}</div>
                                    )}
                                    <div className="text-4xl font-bold text-primary-900 mb-1">
                                        {stat.value !== '🇨🇲' && stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">{stat.label}</div>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Services Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-black text-gray-900 mb-4 font-heading">
                            Nos Trois Piliers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez comment nous transformons l'avenir avec innovation, durabilité et traçabilité
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* IA Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link href="/solutions-ia">
                                <Card hover className="h-full group cursor-pointer">
                                    <CardHeader className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                            <Brain className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <CardTitle>Entreprises & IA</CardTitle>
                                        <CardDescription>
                                            Solutions d'intelligence artificielle sur mesure pour automatiser, optimiser et propulser votre entreprise.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-center">
                                        <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                                            Découvrir
                                            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Restaurant Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href="/vitedia">
                                <Card hover className="h-full group cursor-pointer">
                                    <CardHeader className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                            <Utensils className="w-8 h-8 text-vitedia-primary" />
                                        </div>
                                        <CardTitle>Restaurant viTEDia</CardTitle>
                                        <CardDescription>
                                            Gastronomie traçable où chaque ingrédient raconte son histoire, du SelecTED Garden à votre assiette.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center flex flex-col items-center">
                                        <Badge variant="secondary" className="mb-3 bg-vitedia-primary/10 text-vitedia-primary border-vitedia-primary/20">
                                            100% Traçable
                                        </Badge>
                                        <div className="flex items-center text-vitedia-primary font-semibold group-hover:gap-2 transition-all">
                                            Réserver
                                            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Garden Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link href="/garden-selected">
                                <Card hover className="h-full group cursor-pointer">
                                    <CardHeader className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                            <Leaf className="w-8 h-8 text-garden-primary" />
                                        </div>
                                        <CardTitle>SelecTED Garden & Épicerie</CardTitle>
                                        <CardDescription>
                                            Production locale, élevage et épicerie fine avec traçabilité totale de la graine à l'assiette.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center flex flex-col items-center">
                                        <Badge variant="secondary" className="mb-3 bg-garden-primary/10 text-garden-primary border-garden-primary/20">
                                            Bio Certifié
                                        </Badge>
                                        <div className="flex items-center text-garden-primary font-semibold group-hover:gap-2 transition-all">
                                            Explorer
                                            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/ecosystem">
                            <Card hover className="max-w-2xl mx-auto cursor-pointer group">
                                <CardHeader className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Network className="w-10 h-10 text-amber-600" />
                                    </div>
                                    <CardTitle className="text-3xl">Notre Écosystème</CardTitle>
                                    <CardDescription className="text-lg">
                                        Découvrez la synergie entre nos trois pôles et notre vision pour un futur durable
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <Button variant="outline" size="lg" className="rounded-full group-hover:bg-primary-50">
                                        Explorer l'Écosystème
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Observatory Section */}
            <section className="py-20 bg-gradient-to-r from-primary-900 to-slate-950 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Satellite className="w-10 h-10 text-blue-300" />
                        </div>

                        <h2 className="text-5xl font-black mb-6 font-heading">
                            L'Observatoire TEDSAI
                        </h2>

                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Analyses économiques, études de cas et veille technologique.
                            Participez aux discussions et découvrez les tendances qui façonnent l'Afrique de demain.
                        </p>

                        <Link href="/observatoire">
                            <Button
                                size="lg"
                                className="bg-white text-primary-900 hover:bg-blue-50 shadow-2xl rounded-full"
                            >
                                Explorer les Analyses & Discussions
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
