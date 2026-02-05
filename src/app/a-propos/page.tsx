'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    Lightbulb,
    Globe,
    Users,
    Target,
    ArrowRight,
    Award,
    Leaf
} from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'Nous repoussons les limites de la technologie pour résoudre des problèmes réels.',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
        {
            icon: Leaf,
            title: 'Durabilité',
            description: 'Un engagement profond pour une croissance respectueuse de environnement.',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            icon: Globe,
            title: 'Impact Local',
            description: 'Développer des solutions par et pour l\'Afrique, avec une portée mondiale.',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: Heart,
            title: 'Passion',
            description: 'L\'amour du travail bien fait, des champs à l\'assiette jusqu\'au code.',
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    const team = [
        {
            name: 'Dr. TED',
            role: 'Fondateur & CEO',
            bio: 'Visionnaire passionné par l\'IA et l\'agriculture durable.',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        },
        {
            name: 'Sarah M.',
            role: 'Directrice Opérations',
            bio: 'Expertise en gestion de projets complexes et logistique.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
        },
        {
            name: 'Jean K.',
            role: 'Chef Exécutif viTEDia',
            bio: '20 ans d\'expérience en gastronomie africaine et fusion.',
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        },
        {
            name: 'Marie L.',
            role: 'Lead Agronome',
            bio: 'Spécialiste en agriculture urbaine et permaculture.',
            image: 'https://images.unsplash.com/photo-1595123550441-d377e017de2d?w=800&q=80',
        },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <Users className="w-4 h-4 mr-2" />
                            Notre Histoire
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-8 font-heading">
                            L'Innovation au Service de <span className="text-primary-400">l'Humain</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Le Complex TEDSAI est né d'une ambition audacieuse :
                            unifier l'intelligence artificielle, l'agriculture durable et la gastronomie
                            pour créer un modèle de développement unique en Afrique.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                                Plus qu'une Entreprise, <br />
                                <span className="text-primary-600">Une Mission</span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Nous croyons que la technologie ne doit pas remplacer l'humain, mais l'élever.
                                Chez TEDSAI, chaque ligne de code, chaque graine plantée et chaque plat servi
                                contribue à un écosystème vertueux.
                            </p>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Notre approche holistique permet de connecter les producteurs aux consommateurs,
                                tout en optimisant les ressources grâce à l'intelligence artificielle.
                            </p>

                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-3xl font-bold text-gray-900">3+</span>
                                    <span className="text-sm text-gray-500">Années d'Expérience</span>
                                </div>
                                <div className="w-px h-12 bg-gray-200" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-3xl font-bold text-gray-900">15+</span>
                                    <span className="text-sm text-gray-500">Experts Passionnés</span>
                                </div>
                                <div className="w-px h-12 bg-gray-200" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-3xl font-bold text-gray-900">100%</span>
                                    <span className="text-sm text-gray-500">Engagement</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                                alt="Vision TEDSAI"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                    <p className="text-white font-medium italic">
                                        "L'avenir appartient à ceux qui construisent des ponts entre la tradition et la modernité."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Nos Valeurs Fondamentales</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Ces principes guident chacune de nos décisions et actions au quotidien.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow border-none shadow-sm">
                                    <CardContent className="pt-8 text-center">
                                        <div className={`w-16 h-16 ${value.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                            <value.icon className={`w-8 h-8 ${value.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Rencontrez l'Équipe</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Des experts passionnés unis par une vision commune.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="relative h-80 mb-4 rounded-2xl overflow-hidden bg-gray-100">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-primary-600 font-medium text-sm mb-2">{member.role}</p>
                                <p className="text-gray-500 text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black mb-6 font-heading">
                            Envie de Rejoindre l'Aventure ?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Nous sommes toujours à la recherche de talents passionnés pour grandir avec nous.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100 rounded-full">
                                    Contactez-nous
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
