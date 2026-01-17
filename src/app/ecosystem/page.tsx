'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Network,
    Leaf,
    Utensils,
    Brain,
    ArrowRight,
    Zap,
    TrendingUp,
    Users,
    Recycle,
    CheckCircle
} from 'lucide-react';



export default function EcosystemPage() {
    const pillars = [
        {
            icon: Brain,
            name: 'Intelligence Artificielle',
            color: 'from-blue-500 to-cyan-500',
            description: 'Le cerveau qui optimise et automatise l\'ensemble du complexe',
            features: [
                'Gestion stocks restaurant',
                'Irrigation intelligente jardin',
                'Analyse prédictive',
                'Solutions PME externes',
            ],
            link: '/solutions-ia',
        },
        {
            icon: Utensils,
            name: 'Restaurant viTEDia',
            color: 'from-amber-500 to-orange-500',
            description: 'Gastronomie traçable avec produits du jardin',
            features: [
                'Cuisine fusion camerounaise',
                'Traçabilité 100%',
                'Produits ultra-frais',
                'QR Code menu',
            ],
            link: '/vitedia',
        },
        {
            icon: Leaf,
            name: 'Jardin SelecTED',
            color: 'from-green-500 to-emerald-500',
            description: 'Agriculture urbaine bio et production locale',
            features: [
                'Culture sans pesticides',
                'Système aquaponique',
                'Semences bio certifiées',
                'Supply chain transparente',
            ],
            link: '/garden',
        },
    ];

    // Additional Services - displayed in second grid
    const services = [
        {
            icon: ({ className }: any) => (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
            ),
            name: 'Épicerie Fine SelecTED',
            color: 'from-emerald-500 to-teal-500',
            description: 'Produits transformés artisanaux et épices camerounaises',
            features: [
                'Confitures maison',
                'Poivre de Penja IGP',
                'Miel de forêt',
                'Livraison 24-48h',
            ],
            link: '/epicerie',
        },
        {
            icon: ({ className }: any) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
            ),
            name: 'Élevage Durable',
            color: 'from-yellow-500 to-amber-500',
            description: 'Poulets élevés en plein air et œufs bio',
            features: [
                'Bien-être animal',
                'Alimentation naturelle',
                'Sans antibiotiques',
                'Traçabilité complète',
            ],
            link: '/elevage',
        },
        {
            icon: ({ className }: any) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            name: 'Blog & Actualités',
            color: 'from-indigo-500 to-blue-500',
            description: 'Articles, guides et actualités TEDSAI',
            features: [
                'Guides techniques',
                'Success stories',
                'Tendances IA',
                'Recettes & nutrition',
            ],
            link: '/blog',
        },
        {
            icon: ({ className }: any) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            name: 'Observatoire & Analytics',
            color: 'from-cyan-500 to-blue-500',
            description: 'Données, études et insights sectoriels',
            features: [
                'Dashboard temps réel',
                'Études de marché',
                'Benchmarks secteur',
                'Rapports personnalisés',
            ],
            link: '/observatoire',
        },
        {
            icon: ({ className }: any) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            name: 'Études de Cas',
            color: 'from-rose-500 to-red-500',
            description: 'Success stories et ROI clients',
            features: [
                'Résultats mesurables',
                'Témoignages clients',
                'Avant/Après',
                'Impact quantifié',
            ],
            link: '/etudes-cas',
        },
    ];


    const synergies = [
        {
            from: 'Jardin',
            to: 'Restaurant',
            description: 'Légumes frais récoltés le matin, servis le midi',
            icon: '🌱→🍽️',
        },
        {
            from: 'IA',
            to: 'Jardin',
            description: 'Optimisation irrigation et prédiction récoltes',
            icon: '🤖→🌿',
        },
        {
            from: 'Restaurant',
            to: 'IA',
            description: 'Données consommation pour prévisions stocks',
            icon: '📊→💡',
        },
        {
            from: 'IA',
            to: 'Restaurant',
            description: 'Gestion automatique commandes et inventaire',
            icon: '⚡→📦',
        },
    ];

    const impacts = [
        { value: '100%', label: 'Traçabilité', icon: CheckCircle },
        { value: '0', label: 'Pesticides', icon: Leaf },
        { value: '-40%', label: 'Gaspillage', icon: Recycle },
        { value: '24/7', label: 'Automatisation', icon: Zap },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Badge className="mb-4 bg-amber-100 text-amber-800">
                            <Network className="w-4 h-4" />
                            Écosystème Intégré
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 font-heading">
                            Notre <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Écosystème</span>
                        </h1>

                        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                            Découvrez comment nos trois piliers s'interconnectent pour créer
                            un système intelligent, durable et traçable de bout en bout.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="#pillars">
                                <Button size="lg" rounded="full" className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-xl">
                                    Explorer l'Écosystème
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {impacts.map((impact, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <impact.icon className="w-12 h-12 mx-auto mb-3 text-amber-600" />
                                <div className="text-4xl font-bold text-gray-900 mb-1">{impact.value}</div>
                                <div className="text-gray-600 font-medium">{impact.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Three Pillars */}
            <section id="pillars" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Les Trois Piliers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Chaque pilier joue un rôle essentiel dans notre écosystème intégré
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full group">
                                    <CardHeader>
                                        <div className={`w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <pillar.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl">{pillar.name}</CardTitle>
                                        <CardDescription>{pillar.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <ul className="space-y-2 mb-6">
                                            {pillar.features.map((feature, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link href={pillar.link}>
                                            <Button variant="outline" className="w-full group-hover:bg-gray-50">
                                                En savoir plus
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Services & Pages */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Toutes nos Offres & Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez l'ensemble de l'écosystème TEDSAI et trouvez la solution adaptée à vos besoins
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card hover className="h-full group">
                                    <CardHeader>
                                        <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <service.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{service.name}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link href={service.link}>
                                            <Button variant="outline" className="w-full group-hover:bg-gray-50">
                                                Découvrir
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Synergies Diagram */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Synergies & Flux
                        </h2>
                        <p className="text-xl text-gray-600">
                            Comment nos piliers interagissent pour créer de la valeur
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {synergies.map((synergy, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-4xl">{synergy.icon}</div>
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    {synergy.from} → {synergy.to}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{synergy.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-4xl font-black mb-6 font-heading">
                            Notre Vision
                        </h2>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Créer un modèle d'économie circulaire où technologie, agriculture
                            et gastronomie se renforcent mutuellement pour un avenir durable
                            et traçable au Cameroun.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            {[
                                { icon: TrendingUp, label: 'Croissance Durable' },
                                { icon: Users, label: 'Impact Social' },
                                { icon: Recycle, label: 'Économie Circulaire' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <item.icon className="w-12 h-12 mb-3" />
                                    <span className="font-semibold">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black text-gray-900 mb-6">
                            Rejoignez l'Écosystème TEDSAI
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Que vous soyez une PME cherchant des solutions IA, un amateur de
                            gastronomie ou un consommateur responsable, il y a une place pour vous.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/solutions-ia">
                                <Button size="lg" rounded="full">
                                    Solutions IA
                                    <Brain className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/vitedia">
                                <Button variant="outline" size="lg" rounded="full">
                                    Restaurant viTEDia
                                    <Utensils className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/garden">
                                <Button variant="outline" size="lg" rounded="full">
                                    Jardin SelecTED
                                    <Leaf className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
