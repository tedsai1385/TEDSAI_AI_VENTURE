import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleProps {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
}

export const ArticleCard = ({ title, excerpt, category, date, readTime, image, featured = false }: ArticleProps) => {
    return (
        <Card padded={false} hover className={`group overflow-hidden flex flex-col h-full bg-white ${featured ? 'md:flex-row md:col-span-2 md:items-stretch' : ''}`}>
            {/* Image Container */}
            <div className={`relative overflow-hidden bg-gray-200 ${featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-48'}`}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10">
                    <Badge variant="primary" className="shadow-sm border-none backdrop-blur-md bg-white/90 text-[var(--color-primary)]">
                        {category}
                    </Badge>
                </div>
            </div>

            {/* Content Container */}
            <div className={`flex flex-col p-6 ${featured ? 'md:w-1/2 justify-center' : 'flex-1'}`}>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1"><Clock size={12} /> {readTime} min</span>
                </div>

                <h3 className={`font-heading font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    <Link href="/observatoire/article-demo" className="before:absolute before:inset-0">
                        {title}
                    </Link>
                </h3>

                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                    {excerpt}
                </p>

                <div className="flex items-center text-sm font-bold text-[var(--color-secondary)] group-hover:gap-2 transition-all mt-auto">
                    Lire l'article <ArrowRight size={16} className="ml-1" />
                </div>
            </div>
        </Card>
    );
};
