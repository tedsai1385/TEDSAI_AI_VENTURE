'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const ObservatoireTeaser = () => {
    const articles = [
        {
            category: "Tech & IA",
            title: "IA pour PME camerounaises : 10 usages rentables en 2026",
            excerpt: "Découvrez comment l'IA transforme concrètement le business local.",
            date: "20 Janv 2026",
            readTime: "5 min",
            image: "/images/blog/ia-pme.jpg"
        },
        {
            category: "Agriculture",
            title: "Aquaponie au Cameroun : Guide économique complet",
            excerpt: "Comprendre la rentabilité de l'agriculture urbaine à Yaoundé.",
            date: "18 Janv 2026",
            readTime: "7 min",
            image: "/images/blog/aquaponie.jpg"
        },
        {
            category: "Économie",
            title: "Traçabilité alimentaire : Comment l'implémenter simplement",
            excerpt: "Le guide pour rassurer vos clients avec la blockchain.",
            date: "15 Janv 2026",
            readTime: "4 min",
            image: "/images/blog/tracabilite.jpg"
        }
    ];



    return (
        <Section spacing="lg" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-heading font-bold mb-2">Observatoire TEDSAI — Analyses & Innovations</h2>
                        <p className="text-[var(--color-text-secondary)]">Économie numérique, agriculture urbaine, IA appliquée : des contenus pour comprendre et agir.</p>
                    </div>
                    <Link href="/observatoire" className="hidden md:block">
                        <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                            Explorer tous les articles
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {articles.map((article, index) => (
                        <Link href="/observatoire" key={index} className="block h-full group">
                            <Card padded={false} hover className="h-full flex flex-col">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm text-xs font-bold">
                                            {article.category}
                                        </Badge>
                                    </div>
                                    {/* Valid Image Component */}
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="text-xs text-gray-400 mb-2 flex gap-2">
                                        <span>{article.date}</span> • <span>{article.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-3 block group-hover:text-[var(--color-primary)] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-1">
                                        {article.excerpt}
                                    </p>
                                    <span className="text-[var(--color-primary)] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Lire l'article <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Newsletter Micro-section */}
                <Card variant="elevated" className="bg-[var(--color-secondary)] text-white p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold mb-2">Restez informé de l'innovation</h3>
                            <p className="text-gray-300">Recevez nos meilleures analyses chaque semaine. Pas de spam, promis.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                placeholder="Votre email professionnel"
                                className="px-4 py-3 rounded-lg text-gray-900 bg-white border-0 focus:ring-2 focus:ring-[var(--color-accent)] w-full md:w-64"
                            />
                            <Button
                                variant="accent"
                                rightIcon={<Mail size={16} />}
                                onClick={() => alert("Merci pour votre inscription ! (Démo)")}
                            >
                                S'abonner
                            </Button>
                        </div>
                    </div>
                </Card>
            </Container>
        </Section>
    );
};
