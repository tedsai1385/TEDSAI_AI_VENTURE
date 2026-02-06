'use client';

import React from 'react';
import Image from 'next/image';
import { Article } from '@/types/article';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArticleDetailProps {
    article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié !');
        }
    };

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Hero Header */}
            <div className="relative w-full h-[60vh] min-h-[400px]">
                {article.heroImage?.url ? (
                    <Image
                        src={article.heroImage.url}
                        alt={article.heroImage.alt || article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-white border-none">
                            {article.category}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl md:text-6xl font-black font-heading leading-tight mb-4 text-white drop-shadow-lg">
                            {article.title}
                        </h1>
                        {article.subtitle && (
                            <p className="text-xl md:text-2xl text-gray-200 font-light mb-6">
                                {article.subtitle}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span className="font-medium">{article.authorName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>
                                    {article.publishedAt
                                        ? new Date(article.publishedAt.seconds * 1000).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })
                                        : 'Non publié'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>{Math.ceil((article.stats?.avgReadTime || 300) / 60)} min de lecture</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Share Action */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-8">
                    <div className="flex gap-2">
                        {article.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-500 hover:text-[var(--color-primary)]">
                        <Share2 size={18} className="mr-2" />
                        Partager
                    </Button>
                </div>

                {/* Main Content (HTML rendered) */}
                <div
                    className="prose prose-lg prose-indigo max-w-none 
                        prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:not-italic"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </article>
    );
}
