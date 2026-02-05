'use client';

import React, { useEffect, useState } from 'react';
import { useProductsStore, ProductCategory } from '@/lib/store/products-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Package,
    ShoppingBag,
    Leaf,
    Mountain,
    Home,
    Zap,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types de badges pour l'UI
const BADGE_COLORS: Record<string, string> = {
    'IGP': 'bg-blue-600 text-white',
    'Bio': 'bg-green-600 text-white',
    'Rare': 'bg-amber-600 text-white',
    'Artisanal': 'bg-orange-700 text-white',
    'Montagne': 'bg-slate-600 text-white',
    'Village': 'bg-emerald-700 text-white',
    'Fort': 'bg-red-700 text-white',
    'Nouveau': 'bg-purple-600 text-white'
};

const CATEGORIES: { id: ProductCategory | 'all'; label: string; color: string }[] = [
    { id: 'all', label: 'Tout', color: 'bg-neutral-800' },
    { id: 'epices', label: 'Épices', color: 'bg-orange-900/40 text-orange-300 border-orange-800' },
    { id: 'sucres', label: 'Sucrés', color: 'bg-pink-900/40 text-pink-300 border-pink-800' },
    { id: 'huiles', label: 'Huiles', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-800' },
    { id: 'super-aliments', label: 'Super-aliments', color: 'bg-purple-900/40 text-purple-300 border-purple-800' },
    { id: 'frais', label: 'Frais', color: 'bg-green-900/40 text-green-300 border-green-800' },
];

export default function ProductsPage() {
    const router = useRouter();
    const { products, isLoading, filters, setFilter, listenToProducts, deleteProduct } = useProductsStore();

    // Local processing for display
    const filteredProducts = products.filter(p => {
        const matchesCategory = filters.category === 'all' || p.category === filters.category;
        const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        const unsubscribe = listenToProducts();
        return () => unsubscribe();
    }, [listenToProducts]);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
                <span className="ml-4 text-neutral-400">Chargement des trésors...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="text-[var(--color-primary)]" />
                        Nos Trésors
                    </h1>
                    <p className="text-neutral-400">Gérez le catalogue officiel : Épices, Miels, Huiles et Raretés.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => router.push('/admin/shop/products/new')}
                        className="bg-[var(--color-primary)] text-black font-bold hover:bg-[var(--color-primary-light)] w-full md:w-auto shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] transition-all"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Ajouter un Trésor
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-4 rounded-xl flex flex-col items-center justify-between gap-4 md:flex-row sticky top-[80px] z-30 shadow-xl">
                {/* Categories Chips */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter('category', cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                filters.category === cat.id
                                    ? "bg-white text-black border-white shadow-lg scale-105"
                                    : cn("bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500", cat.color !== 'bg-neutral-800' && filters.category === cat.id ? cat.color : "")
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Search & Status */}
                <div className="flex gap-3 w-full md:w-auto items-center">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            placeholder="Rechercher..."
                            className="bg-neutral-800 border-neutral-700 pl-10 text-white focus:ring-[var(--color-primary)]"
                        />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
                    <Package className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Aucun trésor trouvé</h3>
                    <p className="text-neutral-500">Essayez de modifier vos filtres ou ajoutez un nouveau produit.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onDelete={deleteProduct} onEdit={(id: string) => router.push(`/admin/shop/products/${id}`)} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Sub-component for individual cards
function ProductCard({ product, onDelete, onEdit }: { product: any, onDelete: any, onEdit: any }) {
    return (
        <Card className="bg-neutral-900 border-neutral-800 overflow-hidden group hover:border-[var(--color-primary)] transition-all duration-300 relative flex flex-col h-full shadow-lg">
            {/* Image Area */}
            <div className="relative aspect-square bg-neutral-800 overflow-hidden">
                {product.mainImage ? (
                    <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600">
                        <Package className="opacity-20" size={48} />
                    </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {product.badges?.map((badge: string) => (
                        <Badge key={badge} className={cn("text-[10px] uppercase font-bold shadow-md backdrop-blur-md px-2 py-0.5 border-none", BADGE_COLORS[badge] || "bg-neutral-700")}>
                            {badge}
                        </Badge>
                    ))}
                </div>



                {/* Stock Alert */}
                {product.stock < 5 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 text-white text-[10px] font-bold text-center py-1">
                        ⚠️ Stock Faible ({product.stock})
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {product.name}
                    </h3>
                </div>

                <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider font-medium">
                    {product.category} • {product.weightVolume || 'N/A'}
                </p>

                <div className="mt-auto pt-3 border-t border-neutral-800 flex justify-between items-center">
                    <span className="font-bold text-xl text-[var(--color-primary)]">
                        {product.price}
                    </span>

                    {/* Actions Menu */}
                    <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800" onClick={() => onEdit(product.id)}>
                            <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-red-500 hover:bg-red-500/10" onClick={() => { if (confirm('Supprimer ?')) onDelete(product.id); }}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
