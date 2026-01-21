'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Calendar,
    User,
    ArrowRight,
    FlaskConical,
    Leaf,
    Cpu,
    TrendingUp,
    Tag,
    Mail
} from 'lucide-react';



export default function BlogPage() {
    const categories = [
        { name: 'Tous', count: 42, active: true },
        { name: 'Intelligence Artificielle', count: 15, active: false },
        { name: 'Agriculture Durable', count: 12, active: false },
        { name: 'Gastronomie', count: 8, active: false },
        { name: 'Économie Circulaire', count: 7, active: false },
    ];

    const posts = [
        {
            title: 'Comment l\'IA optimise l\'irrigation de nos jardins',
            excerpt: 'Découvrez comment nos algorithmes prédictifs réduisent la consommation d\'eau de 40% tout en augmentant les rendements.',
            category: 'Intelligence Artificielle',
            author: 'Dr. TED',
            date: '15 Jan 2026',
            readTime: '5 min',
            image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80',
            featured: true,
        },
        {
            title: 'La révolution de la traçabilité alimentaire',
            excerpt: 'Du champ à l\'assiette blockchain : comment nous garantissons une transparence totale pour nos clients.',
            category: 'Agriculture Durable',
            author: 'Marie L.',
            date: '12 Jan 2026',
            readTime: '4 min',
            image: 'https://images.unsplash.com/photo-1615811361263-4f932e9f649b?w=800&q=80',
            featured: false,
        },
        {
            title: 'Les secrets du Ndolé revisité par viTEDia',
            excerpt: 'Notre chef révèle comment il modernise ce classique camerounais tout en respectant la tradition.',
            category: 'Gastronomie',
            author: 'Jean K.',
            date: '10 Jan 2026',
            readTime: '6 min',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            featured: false,
        },
        {
            title: 'Smart Farming : Le futur de l\'agriculture urbaine',
            excerpt: 'Analyse des tendances 2026 pour l\'agriculture en milieu urbain dense.',
            category: 'Agriculture Durable',
            author: 'Sarah M.',
            date: '05 Jan 2026',
            readTime: '8 min',
            image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80',
            featured: false,
        },
        {
            title: 'Machine Learning et gestion de stocks',
            excerpt: 'Étude de cas : comment le supermarché X a réduit ses pertes de 30% grâce à notre solution.',
            category: 'Intelligence Artificielle',
            author: 'Dr. TED',
            date: '02 Jan 2026',
            readTime: '10 min',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            featured: false,
        },
        {
            title: 'L\'impact économique des circuits courts',
            excerpt: 'Pourquoi consommer local est un acte économique puissant au Cameroun.',
            category: 'Économie Circulaire',
            author: 'Dr. TED',
            date: '28 Dec 2025',
            readTime: '7 min',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
            featured: false,
        },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center mix-blend-overlay" />
                </div>

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <FlaskConical className="w-4 h-4 mr-2" />
                            Le Lab TEDSAI
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                            Explorer le <span className="text-blue-300">Futur</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Veille technologique, avancées agricoles et réflexions sur l'économie numérique.
                            Plongez dans nos recherches et découvertes.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative group">
                            <input
                                type="text"
                                placeholder="Rechercher un article, un sujet..."
                                className="w-full h-14 pl-14 pr-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 outline-none focus:bg-white/20 transition-all shadow-xl group-hover:shadow-2xl"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 justify-center mb-12">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${cat.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat.name} <span className={`ml-2 text-xs ${cat.active ? 'opacity-80' : 'text-gray-400'}`}>({cat.count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl grid md:grid-cols-2 group hover:shadow-2xl transition-shadow cursor-pointer">
                            <div className="relative h-64 md:h-auto min-h-[400px]">
                                <Image
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">À la Une</Badge>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-4">
                                    <Cpu className="w-4 h-4" />
                                    {posts[0].category}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading group-hover:text-blue-700 transition-colors">
                                    {posts[0].title}
                                </h2>
                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    {posts[0].excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                            <Image
                                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80"
                                                alt={posts[0].author}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{posts[0].author}</div>
                                            <div className="text-xs text-gray-500">{posts[0].date} • {posts[0].readTime}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        Lire l'article
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(1).map((post, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full flex flex-col overflow-hidden group">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm hover:bg-white">{post.category}</Badge>
                                        </div>
                                    </div>

                                    <CardContent className="flex-1 flex flex-col p-6">
                                        <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs font-medium text-gray-600">{post.author}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{post.readTime}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Button variant="outline" size="lg" rounded="full">
                            Charger plus d'articles
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Mail className="w-12 h-12 mx-auto mb-6 text-blue-400" />
                        <h2 className="text-3xl font-bold mb-4">Restez Connecté</h2>
                        <p className="text-gray-400 mb-8">
                            Recevez nos dernières analyses et actualités directement dans votre boîte mail.
                            Pas de spam, c'est promis.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white outline-none focus:bg-white/20 transition-all"
                            />
                            <Button size="lg" rounded="full" className="bg-blue-600 hover:bg-blue-500 whitespace-nowrap px-8">
                                S'abonner
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
