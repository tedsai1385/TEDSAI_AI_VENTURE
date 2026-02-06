'use client';

import { Article, getCategoryLabel } from '@/types/article';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface ArticleDetailProps {
    article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
    const readTime = Math.ceil(article.stats.avgReadTime / 60) || 5;
    const publishDate = article.publishedAt
        ? format(article.publishedAt.toDate(), 'd MMMM yyyy', { locale: fr })
        : format(article.createdAt.toDate(), 'd MMMM yyyy', { locale: fr });

    const handleShare = (network: string) => {
        const url = window.location.href;
        const text = `Découvrez cet article sur l'Observatoire TEDSAI : ${article.title}`;

        let shareUrl = '';
        switch (network) {
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-gray-900">
                {article.heroImage?.url && (
                    <>
                        <Image
                            src={article.heroImage.url}
                            alt={article.heroImage.alt || article.title}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    </>
                )}

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto px-6 pb-16 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href="/observatoire">
                                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 mb-6 pl-0">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour à l'Observatoire
                                </Button>
                            </Link>

                            <Badge variant="primary" className="mb-4 bg-purple-600 border-none text-white hover:bg-purple-700">
                                {getCategoryLabel(article.category)}
                            </Badge>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {article.subtitle && (
                                <p className="text-xl text-gray-200 mb-6 max-w-2xl font-light">
                                    {article.subtitle}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                        {article.authorName.charAt(0)}
                                    </div>
                                    <span>Par {article.authorName}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{publishDate}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{readTime} min de lecture</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar (Share & Desktop Nav) */}
                <aside className="lg:col-span-1 lg:sticky lg:top-32 h-fit flex lg:flex-col gap-4 items-center lg:items-center justify-center lg:justify-start order-2 lg:order-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:block mb-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        Partager
                    </div>

                    <Button variant="outline" size="sm" className="rounded-full hover:text-blue-600 hover:border-blue-600 transition-colors" onClick={() => handleShare('linkedin')}>
                        <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:text-sky-500 hover:border-sky-500 transition-colors" onClick={() => handleShare('twitter')}>
                        <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:text-blue-700 hover:border-blue-700 transition-colors" onClick={() => handleShare('facebook')}>
                        <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:text-gray-900 hover:border-gray-900 transition-colors" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // Toast would be nice here
                    }}>
                        <Share2 className="w-4 h-4" />
                    </Button>
                </aside>

                {/* Content Body */}
                <div className="lg:col-span-11 order-1 lg:order-2">
                    {/* Editor Content Display */}
                    <div
                        className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 
              prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:p-4 prose-blockquote:not-italic"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Tags Footer */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Sujets associés
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer px-3 py-1">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
