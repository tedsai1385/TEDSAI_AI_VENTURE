'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Satellite,
    TrendingUp,
    BarChart3,
    FileText,
    MessageSquare,
    ArrowRight,
    Eye,
    Calendar,
    Users,
    Globe
} from 'lucide-react';



export default function ObservatoirePage() {
    const categories = [
        {
            icon: TrendingUp,
            title: 'Économie & Business',
            count: 24,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Globe,
            title: 'Tech & Innovation',
            count: 18,
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Users,
            title: 'Société & Impact',
            count: 15,
            color: 'from-green-500 to-emerald-500',
        },
    ];

    const recentPosts = [
        {
            title: 'L\'IA au service des PME camerounaises',
            category: 'Tech & Innovation',
            date: '10 Jan 2026',
            views: 1250,
            excerpt: 'Comment l\'intelligence artificielle transforme le paysage entrepreneurial au Cameroun...',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        },
        {
            title: 'Agriculture urbaine : l\'avenir de la sécurité alimentaire',
            category: 'Société & Impact',
            date: '08 Jan 2026',
            views: 980,
            excerpt: 'Les jardins urbains comme solution durable pour nourrir les villes africaines...',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
        },
        {
            title: 'Traçabilité alimentaire : un enjeu majeur',
            category: 'Économie & Business',
            date: '05 Jan 2026',
            views: 1450,
            excerpt: 'Pourquoi la traçabilité devient un avantage compétitif pour les restaurants...',
            image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
        },
    ];

    const stats = [
        { value: '57', label: 'Articles Publiés', icon: FileText },
        { value: '12K', label: 'Lecteurs Mensuels', icon: Eye },
        { value: '340', label: 'Discussions Actives', icon: MessageSquare },
        { value: '8', label: 'Études de Cas', icon: BarChart3 },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Satellite className="w-10 h-10 text-blue-300" />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                            L'Observatoire <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">TEDSAI</span>
                        </h1>

                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Analyses économiques, études de cas et veille technologique.
                            Participez aux discussions et découvrez les tendances qui façonnent l'Afrique de demain.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="#articles">
                                <Button size="lg" rounded="full" className="bg-white text-primary-900 hover:bg-blue-50 shadow-xl">
                                    Explorer les Articles
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Link href="#discussions">
                                <Button variant="outline" size="lg" rounded="full" className="border-white/30 text-white hover:bg-white/10">
                                    Rejoindre les Discussions
                                    <MessageSquare className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="w-12 h-12 mx-auto mb-3 text-primary-600" />
                                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Catégories
                        </h2>
                        <p className="text-xl text-gray-600">
                            Explorez nos analyses par thématique
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full group cursor-pointer">
                                    <CardHeader>
                                        <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <cat.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle>{cat.title}</CardTitle>
                                        <CardDescription>{cat.count} articles</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Posts Section */}
            <section id="articles" className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Articles Récents
                        </h2>
                        <p className="text-xl text-gray-600">
                            Nos dernières analyses et réflexions
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {recentPosts.map((post, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full group overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100" />
                                        <div className="absolute top-4 left-4">
                                            <Badge>{post.category}</Badge>
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                                            {post.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {post.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {post.views}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                        <Button variant="outline" className="w-full group-hover:bg-gray-50">
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/blog">
                            <Button size="lg" rounded="full">
                                Voir Tous les Articles
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="discussions" className="py-20 bg-gradient-to-r from-primary-900 to-purple-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black mb-6 font-heading">
                            Rejoignez la Conversation
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Partagez vos idées, posez vos questions et participez aux discussions
                            qui façonnent l'avenir de l'Afrique.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="xl" rounded="full" className="bg-white text-primary-900 hover:bg-blue-50 shadow-2xl">
                                Créer un Compte
                                <Users className="w-5 h-5" />
                            </Button>

                            <Button variant="outline" size="xl" rounded="full" className="border-white/30 text-white hover:bg-white/10">
                                Explorer les Discussions
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
