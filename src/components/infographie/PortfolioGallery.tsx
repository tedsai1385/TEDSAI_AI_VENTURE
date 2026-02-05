'use client';

import React, { useState, useEffect } from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Eye, Play } from 'lucide-react';
import Image from 'next/image';
import { usePortfolioStore, PortfolioItem } from '@/lib/store/portfolio-store';

export const PortfolioGallery = () => {
    const { items, isLoading, listenToPortfolio } = usePortfolioStore();
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Logo', 'Web', 'Packaging', 'Print', 'Social'];

    useEffect(() => {
        const unsub = listenToPortfolio();
        return () => unsub();
    }, [listenToPortfolio]);

    // Format items for the specialized layout
    const filteredItems = items
        .filter(item => item.status === 'published')
        .filter(item => filter === 'All' || item.category === filter);

    // Layout Logic:
    // 1. Find the featured item (prioritize 'featured_left' layout position)
    // 2. Others fill the grid slots
    const featuredItem = filteredItems.find(i => i.layoutPosition === 'featured_left') || filteredItems[0];
    const otherItems = filteredItems.filter(i => i.id !== (featuredItem?.id || ''));

    const getGridSpan = (index: number, item: PortfolioItem) => {
        if (item.id === featuredItem?.id) return "md:col-span-2 md:row-span-2";

        // We can add logic for other items if needed, but for now they are standard slots
        // except for maybe some variety or if the user explicitly set masonry_auto
        if (index === 3) return "md:row-span-2"; // Mirroring the original static layout
        if (index === 4) return "md:col-span-2"; // Mirroring the original static layout if there are enough items
        return "";
    };

    if (isLoading && items.length === 0) {
        return (
            <Section spacing="base" className="bg-[var(--color-background)]">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[800px]">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={cn("rounded-xl bg-neutral-900 animate-pulse border border-neutral-800", i === 1 ? "md:col-span-2 md:row-span-2" : "")} />
                        ))}
                    </div>
                </Container>
            </Section>
        );
    }

    return (
        <Section spacing="base" className="bg-[var(--color-background)]" id="portfolio">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-heading font-bold mb-6 text-black uppercase tracking-tighter">Notre Portfolio</h2>

                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                    ? 'bg-black text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-3 gap-4 h-auto md:min-h-[800px]">
                    {filteredItems.map((item, index) => {
                        const isFeatured = item.id === featuredItem?.id;
                        const spanCss = getGridSpan(index, item);

                        return (
                            <div
                                key={item.id}
                                className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 min-h-[300px] md:min-h-0 ${spanCss}`}
                            >
                                {/* Media Content */}
                                {item.mediaType === 'video' ? (
                                    <div className="relative w-full h-full">
                                        <video
                                            src={item.mediaUrl}
                                            poster={item.thumbnailUrl}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            onMouseOver={e => (e.target as HTMLVideoElement).play()}
                                            onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                                        />
                                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                                            <Play size={10} fill="white" /> VIDÉO
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={item.mediaUrl}
                                        alt={item.altText || item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-sm">
                                    <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {item.category}
                                    </span>
                                    <h3 className="text-2xl font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        {item.title}
                                    </h3>
                                    {item.clientName && (
                                        <p className="text-sm text-neutral-400 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                            Client: {item.clientName}
                                        </p>
                                    )}
                                    <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                        <Button
                                            size="sm"
                                            className="bg-[var(--color-primary)] text-black font-bold border-none"
                                            onClick={() => window.open(item.mediaUrl, '_blank')}
                                        >
                                            <Eye size={16} className="mr-2" /> DÉTAILS
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredItems.length === 0 && !isLoading && (
                    <div className="py-20 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
                        <p className="text-neutral-500 font-bold uppercase tracking-widest">Aucun projet à afficher pour cette catégorie</p>
                    </div>
                )}
            </Container>
        </Section>
    );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

