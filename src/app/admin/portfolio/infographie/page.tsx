'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioStore, PortfolioItem } from '@/lib/store/portfolio-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Image as ImageIcon,
    Video,
    Layout,
    MoreVertical,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CATEGORIES = [
    { id: 'All', label: 'Tout' },
    { id: 'Logo', label: 'Logo' },
    { id: 'Web', label: 'Web' },
    { id: 'Packaging', label: 'Packaging' },
    { id: 'Print', label: 'Print' },
    { id: 'Social', label: 'Social' },
];

export default function PortfolioAdminPage() {
    const router = useRouter();
    const { items, isLoading, filters, setFilter, listenToPortfolio, deleteItem, toggleStatus } = usePortfolioStore();

    useEffect(() => {
        const unsub = listenToPortfolio();
        return () => unsub();
    }, [listenToPortfolio]);

    const filteredItems = items.filter(item => {
        const matchesCategory = filters.category === 'All' || item.category === filters.category;
        // Search could be added here
        return matchesCategory;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Infographie</h1>
                    <p className="text-neutral-400 mt-1">Gérez vos réalisations et leur affichage sur le site public.</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/portfolio/infographie/new')}
                    className="bg-[var(--color-primary)] text-black font-bold hover:scale-105 transition-transform"
                >
                    <Plus className="mr-2 h-5 w-5" /> Ajouter un Projet
                </Button>
            </div>

            {/* Top Stats & Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter('category', cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                filters.category === cat.id
                                    ? "bg-white text-black border-white shadow-lg scale-105"
                                    : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                    <Input
                        placeholder="Rechercher un projet..."
                        className="pl-10 bg-neutral-900 border-neutral-800 focus:ring-[var(--color-primary)] transition-all"
                    />
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && filteredItems.length === 0 && (
                <Card className="bg-neutral-900/50 border-dashed border-neutral-800 p-20 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600 mb-4">
                        <ImageIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Aucun projet trouvé</h3>
                    <p className="text-neutral-500 mt-2 max-w-xs mx-auto">Commencez par ajouter votre première réalisation pour dynamiser votre portfolio.</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/portfolio/infographie/new')}
                        className="mt-6 border-neutral-700 hover:bg-neutral-800"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Projet
                    </Button>
                </Card>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="aspect-video rounded-2xl bg-neutral-900 animate-pulse border border-neutral-800" />
                    ))
                ) : (
                    filteredItems.map(item => (
                        <PortfolioCard
                            key={item.id}
                            item={item}
                            onDelete={deleteItem}
                            onToggleStatus={toggleStatus}
                            onEdit={(id) => router.push(`/admin/portfolio/infographie/${id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function PortfolioCard({
    item,
    onDelete,
    onToggleStatus,
    onEdit
}: {
    item: PortfolioItem,
    onDelete: (id: string) => void,
    onToggleStatus: (id: string, status: PortfolioItem['status']) => void,
    onEdit: (id: string) => void
}) {
    return (
        <Card className="group relative bg-neutral-900 border-neutral-800 overflow-hidden hover:border-neutral-600 transition-all">
            {/* Header/Image */}
            <div className="relative aspect-video overflow-hidden">
                {item.thumbnailUrl ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                        {item.mediaType === 'video' ? <Video size={40} /> : <ImageIcon size={40} />}
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge className={cn(
                        "text-[10px] font-bold px-2 py-0.5 border-none",
                        item.mediaType === 'video' ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                    )}>
                        {item.mediaType.toUpperCase()}
                    </Badge>
                    {item.layoutPosition === 'featured_left' && (
                        <Badge className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 border-none">
                            EN AVANT
                        </Badge>
                    )}
                </div>

                {/* Status indicator */}
                <button
                    onClick={() => onToggleStatus(item.id, item.status)}
                    className={cn(
                        "absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all",
                        item.status === 'published' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    )}
                >
                    {item.status === 'published' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                </button>
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-white line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{item.title}</h3>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase flex-shrink-0">{item.category}</span>
                </div>
                {item.clientName && (
                    <p className="text-xs text-neutral-400 mb-4 flex items-center gap-1.5">
                        <Layout size={12} className="text-neutral-600" /> {item.clientName}
                    </p>
                )}

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-neutral-800">
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item.id)}
                            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                        >
                            <Edit3 size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(item.mediaUrl, '_blank')}
                            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                        >
                            <Eye size={16} />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (confirm("Confirmer la suppression ?")) onDelete(item.id);
                        }}
                        className="h-8 w-8 p-0 text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
