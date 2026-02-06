'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    GraduationCap,
    Code,
    Sprout,
    Users,
    Calendar,
    CheckCircle,
    ArrowRight,
    BookOpen
} from 'lucide-react';

export default function FormationsPage() {
    const courses = [
        {
            title: 'IA & Data Science pour PME',
            description: 'Maîtrisez les outils d\'IA pour optimiser votre business. Formation pratique axée sur des cas réels.',
            duration: '4 semaines',
            level: 'Intermédiaire',
            logo: Code,
            color: 'bg-blue-100 text-blue-600',
            modules: [
                'Introduction à l\'IA générative',
                'Automatisation des tâches',
                'Analyse de données business',
                'Projet final intégré'
            ]
        },
        {
            title: 'Agriculture Urbaine & Hydroponie',
            description: 'Apprenez à cultiver en ville avec des techniques modernes et durables. De la graine à la récolte.',
            duration: '2 mois',
            level: 'Débutant',
            logo: Sprout,
            color: 'bg-green-100 text-green-600',
            modules: [
                'Principes de l\'hydroponie',
                'Gestion des nutriments',
                'Lutte biologique',
                'Business plan agricole'
            ]
        },
        {
            title: 'Cuisine Fusion & Traçabilité',
            description: 'Pour les chefs et passionnés : créer une carte moderne, locale et traçable.',
            duration: '3 semaines',
            level: 'Avancé',
            logo: Users,
            color: 'bg-orange-100 text-orange-600',
            modules: [
                'Sourcing local & éthique',
                'Techniques de fusion',
                'Zéro déchet en cuisine',
                'Expérience client'
            ]
        }
    ];

    return (
        <main className="min-h-screen">
            <section className="relative py-24 bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            TEDSAI Academy
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                            Formez-vous aux <span className="text-indigo-400">Métiers du Futur</span>
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                            Développez vos compétences en technologie, agriculture et entrepreneuriat
                            avec nos programmes certifiants et pratiques.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {courses.map((course, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full flex flex-col border-none shadow-lg">
                                    <CardHeader>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${course.color}`}>
                                            <course.logo className="w-7 h-7" />
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <Badge variant="outline">{course.duration}</Badge>
                                            <Badge variant="outline">{course.level}</Badge>
                                        </div>
                                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                                        <CardDescription>{course.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                Programme
                                            </h4>
                                            <ul className="space-y-2 mb-6">
                                                {course.modules.map((mod, j) => (
                                                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                        {mod}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Button className="w-full mt-4">
                                            S'inscrire
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Besoin d'une formation sur mesure ?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Nous concevons des programmes adaptés aux besoins spécifiques de votre entreprise ou de votre communauté.
                    </p>
                    <Button variant="outline" size="lg" className="rounded-full">
                        Contactez notre équipe pédagogique
                    </Button>
                </div>
            </section>
        </main>
    );
}
