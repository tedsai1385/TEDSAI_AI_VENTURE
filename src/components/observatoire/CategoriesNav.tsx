'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../ui/Container';
import { Cpu, Leaf, TrendingUp, Zap, BookOpen, Hexagon } from 'lucide-react';
import { subscribeToCategories } from '@/lib/firebase/categories-service';
import { subscribeToArticles } from '@/lib/firebase/articles-service';
import { Category } from '@/types/category';
import { Article } from '@/types/article';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const CategoriesNav = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    // 1. Subscribe to Categories
    useEffect(() => {
        const unsubscribe = subscribeToCategories((data) => {
            setCategories(data);
        });
        return () => unsubscribe();
    }, []);

    // 2. Subscribe to Published Articles to count them in real-time
    useEffect(() => {
        const unsubscribe = subscribeToArticles((articles) => {
            const counts: Record<string, number> = {};

            articles.forEach(article => {
                if (article.status === 'published') {
                    // ID match or slug match (to compatible with old static strings if any)
                    const catId = article.category;
                    counts[catId] = (counts[catId] || 0) + 1;
                }
            });

            setArticleCounts(counts);
            setIsLoading(false);
        }, { status: 'published' }); // We only care about published ones for public counts

        return () => unsubscribe();
    }, []);

    // Helper to render icon dynamically
    const renderIcon = (iconName: string, size = 20) => {
        switch (iconName) {
            case 'Cpu': return <Cpu size={size} />;
            case 'Leaf': return <Leaf size={size} />;
            case 'TrendingUp': return <TrendingUp size={size} />;
            case 'Zap': return <Zap size={size} />;
            case 'BookOpen': return <BookOpen size={size} />;
            default: return <Hexagon size={size} />;
        }
    };

    if (isLoading && categories.length === 0) {
        return (
            <div className="border-b border-gray-200 bg-white sticky top-0 z-40 h-16 animate-pulse" />
        );
    }

    return (
        <div className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
            <Container>
                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-4 scrollbar-hide">
                    {categories.map((cat) => {
                        const count = articleCounts[cat.id] || 0;
                        const isActive = activeCategory === cat.id;

                        return (
                            <motion.button
                                key={cat.id}
                                layout
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium relative",
                                    isActive
                                        ? "bg-purple-50 text-purple-700 ring-2 ring-purple-500 ring-offset-2"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                )}
                            >
                                <span className={cn(isActive ? "text-purple-600" : "text-gray-400")}>
                                    {renderIcon(cat.icon, 18)}
                                </span>

                                <span>{cat.label}</span>

                                <span className={cn(
                                    "ml-1 text-[10px] font-bold py-0.5 px-2 rounded-full min-w-[20px] text-center transition-colors",
                                    isActive
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                )}>
                                    {count}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};
