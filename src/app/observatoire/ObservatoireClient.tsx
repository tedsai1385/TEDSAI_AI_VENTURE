'use client';

import { useEffect, useState, useCallback } from 'react';
import { subscribeToArticles } from '@/lib/firebase/articles-service';
import { Article } from '@/types/article';
import { ArticleCard } from '@/components/observatoire/ArticleCard';
import { ArticleFilters } from '@/components/observatoire/ArticleFilters';
import { MetricsTicker } from '@/components/observatoire/MetricsTicker';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ObservatoireClientProps {
    initialArticles: Article[];
    totalCount: number;
}

export function ObservatoireClient({ initialArticles }: ObservatoireClientProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [filteredCategory, setFilteredCategory] = useState<string>('all');
    const [isLiveUpdating, setIsLiveUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // ═══════════════════════════════════════════════════════════════
    // SUBSCRIPTION TEMPS RÉEL - CŒUR DE LA SYNCHRONISATION
    // ═══════════════════════════════════════════════════════════════

    useEffect(() => {
        console.log('[Observatoire] Starting real-time subscription...');

        const unsubscribe = subscribeToArticles(
            (freshArticles) => {
                // Détection changement pour notification subtile
                const currentIds = new Set(articles.map(a => a.id));
                const newIds = new Set(freshArticles.map(a => a.id));

                const hasNew = freshArticles.some(a => !currentIds.has(a.id));
                const hasDeleted = articles.some(a => !newIds.has(a.id) && a.status === 'published');

                if (hasNew || hasDeleted) {
                    setIsLiveUpdating(true);
                    setTimeout(() => setIsLiveUpdating(false), 1000);

                    if (hasNew && articles.length > 0) {
                        toast.success('Nouvel article disponible !', {
                            action: {
                                label: 'Voir',
                                onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                            },
                        });
                    }
                }

                setArticles(freshArticles);
                setLastUpdate(new Date());
            },
            { status: 'published' }
        );

        return () => {
            console.log('[Observatoire] Unsubscribing...');
            unsubscribe();
        };
    }, []); // Une seule subscription au mount

    // Filtrage côté client
    const filteredArticles = filteredCategory === 'all'
        ? articles
        : articles.filter(a => a.category === filteredCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">

            {/* Indicateur temps réel */}
            {isLiveUpdating && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Mise à jour...
                </motion.div>
            )}

            {/* Hero */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-6"
                    >
                        L'Observatoire
                    </motion.h1>

                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        Intelligence agricole, analyses data-driven et perspectives AgriTech en Afrique
                    </p>

                    {/* Métriques temps réel */}
                    {/* <MetricsTicker /> */}
                    <div className="text-white">Metrics Ticker Disabled</div>
                </div>
            </section>

            {/* Filtres */}
            <ArticleFilters
                selected={filteredCategory}
                onChange={setFilteredCategory}
                counts={articles.reduce((acc, a) => {
                    acc[a.category] = (acc[a.category] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>)}
            />

            {/* Grille articles */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400">
                        {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
                        {filteredCategory !== 'all' && ` dans ${filteredCategory.replace(/-/g, ' ')}`}
                    </p>
                    <p className="text-xs text-gray-600">
                        Dernière sync: {lastUpdate.toLocaleTimeString()}
                    </p>
                </div>

                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* <ArticleCard article={article} priority={index < 3} /> */}
                                <div className="text-white p-4 border rounded">Article Card Disabled: {article.title}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Aucun article dans cette catégorie</p>
                        <button
                            onClick={() => setFilteredCategory('all')}
                            className="mt-4 text-purple-400 hover:text-purple-300"
                        >
                            Voir tous les articles
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
