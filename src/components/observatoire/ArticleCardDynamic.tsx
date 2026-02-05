'use client';

import { Article, getCategoryLabel } from '@/types/article';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ArticleCardDynamicProps {
    article: Article;
    index?: number;
}

export function ArticleCardDynamic({ article, index = 0 }: ArticleCardDynamicProps) {
    const readTime = Math.ceil(article.stats.avgReadTime / 60) || 5;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full"
        >
            <Link href={`/observatoire/article/${article.slug}`}>
                <Card
                    padded={false}
                    hover
                    className="group overflow-hidden flex flex-col h-full bg-white"
                >
                    {/* Hero Image */}
                    {article.heroImage?.url && (
                        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                            <Image
                                src={article.heroImage.url}
                                alt={article.heroImage.alt || article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <Badge variant="primary" className="shadow-sm border-none backdrop-blur-md bg-white/90 text-[var(--color-primary)]">
                                    {getCategoryLabel(article.category)}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col p-6 flex-1">
                        {/* Date & Read Time */}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatDistanceToNow(article.publishedAt?.toDate() || article.createdAt.toDate(), {
                                    addSuffix: true,
                                    locale: fr
                                })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{readTime} min</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                            {article.excerpt}
                        </p>

                        {/* Footer: Tags & Views */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Eye size={12} />
                                <span>{article.stats.views.toLocaleString()} vues</span>
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {article.tags.slice(0, 2).map(tag => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}
