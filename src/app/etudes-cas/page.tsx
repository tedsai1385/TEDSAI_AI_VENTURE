'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp,
    Target,
    CheckCircle,
    Quote,
    ArrowRight,
    Lightbulb,
    AlertCircle
} from 'lucide-react';
// @ts-ignore
import data from '../../../assets/data/case-studies.json';

export default function CaseStudiesPage() {
    const caseStudies = data.case_studies;

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-blue-900 to-indigo-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <Target className="w-4 h-4 mr-2" />
                            Success Stories
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            Études de Cas
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Résultats Concrets • Avant/Après • ROI Mesurable
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Case Studies List */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="space-y-12">
                        {caseStudies.map((cs: any, index: number) => (
                            <motion.div
                                key={cs.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow">
                                    <CardContent className="p-8 md:p-12">
                                        {/* Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                            <div>
                                                <h2 className="text-3xl font-bold text-blue-600 mb-2">{cs.client}</h2>
                                                <p className="text-gray-600 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    {cs.sector}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 px-4 py-2">
                                                {cs.date}
                                            </Badge>
                                        </div>

                                        {/* Challenge */}
                                        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
                                            <h4 className="flex items-center gap-2 text-red-700 font-bold mb-3">
                                                <AlertCircle className="w-5 h-5" />
                                                Défi
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">{cs.challenge}</p>
                                        </div>

                                        {/* Solution */}
                                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-6">
                                            <h4 className="flex items-center gap-2 text-green-700 font-bold mb-3">
                                                <Lightbulb className="w-5 h-5" />
                                                Solution
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">{cs.solution}</p>
                                        </div>

                                        {/* Results Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {Object.entries(cs.results).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="text-center bg-white p-6 rounded-xl border-2 border-blue-600 hover:border-blue-700 transition-colors"
                                                >
                                                    <div className="text-4xl font-black text-blue-600 mb-2">
                                                        {value as string}
                                                    </div>
                                                    <div className="text-sm text-gray-600 capitalize font-medium">
                                                        {key.replace(/_/g, ' ')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Testimonial */}
                                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-6 relative">
                                            <Quote className="absolute top-4 right-4 w-12 h-12 text-amber-200" />
                                            <p className="text-gray-800 italic leading-relaxed relative z-10">
                                                "{cs.testimonial}"
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Votre Projet, Notre Expertise
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Discutons de vos défis et objectifs. Audit gratuit.
                        </p>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl"
                            >
                                Demander un Audit
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
