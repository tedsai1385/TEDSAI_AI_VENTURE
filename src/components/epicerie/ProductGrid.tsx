import React, { useState, useEffect } from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShoppingBasket, Filter, Loader2, Package } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useProductsStore, ProductCategory } from '@/lib/store/products-store';

const CATEGORY_LABELS: Record<string, string> = {
    'epices': 'Épices',
    'sucres': 'Sucrés',
    'huiles': 'Huiles',
    'super-aliments': 'Super-aliments',
    'frais': 'Frais',
    'autre': 'Autre'
};

const CATEGORIES = ['Tout', 'Épices', 'Sucrés', 'Huiles', 'Super-aliments', 'Frais'];

export const ProductGrid = () => {
    const { addItem } = useCart();
    const { products, isLoading, listenToProducts } = useProductsStore();
    const [filter, setFilter] = useState('Tout');

    useEffect(() => {
        const unsubscribe = listenToProducts();
        return () => unsubscribe();
    }, [listenToProducts]);

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.priceVal || (parseInt(product.price.replace(/\D/g, '')) || 0),
            quantity: 1,
            image: product.mainImage,
            variety: product.badges?.[0] || 'Standard',
            category: product.category
        });
        toast.success(`${product.name} ajouté au panier !`);
    };

    // Filter logic
    const displayedProducts = products
        // On affiche tout le monde, plus de notion de brouillon/publié
        .filter(p => {
            if (filter === 'Tout') return true;
            return CATEGORY_LABELS[p.category] === filter;
        });

    if (isLoading && products.length === 0) {
        return (
            <Section spacing="base" className="bg-white">
                <Container>
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mb-4" />
                        <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">Chargement de nos trésors...</p>
                    </div>
                </Container>
            </Section>
        );
    }

    return (
        <Section spacing="base" className="bg-white">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h2 className="text-3xl font-heading font-bold">Nos Trésors</h2>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                        <Filter size={16} className="text-gray-400 shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filter === cat
                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md translate-y-[-2px]'
                                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {displayedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun produit disponible dans cette catégorie pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedProducts.map((prod) => (
                            <Card key={prod.id} padded={false} hover className="group cursor-pointer relative flex flex-col h-full bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    {prod.mainImage ? (
                                        <Image
                                            src={prod.mainImage}
                                            alt={prod.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                            <Package size={48} />
                                        </div>
                                    )}

                                    {/* Badges Overlay */}
                                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                                        {prod.badges?.slice(0, 2).map(badge => (
                                            <Badge key={badge} size="sm" variant="secondary" className="bg-white/95 backdrop-blur text-gray-800 shadow-sm border-none font-bold text-[10px] uppercase">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Hover Add to Cart Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(prod);
                                            }}
                                            className="font-bold shadow-lg shadow-[var(--color-primary-rgb)/30]"
                                        >
                                            <ShoppingBasket size={16} className="mr-2" />
                                            Ajouter
                                        </Button>
                                    </div>

                                    {/* Out of Stock Ribbon */}
                                    {prod.stock === 0 && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg transform -rotate-12">RUPTURE</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="mb-2">
                                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">
                                            {CATEGORY_LABELS[prod.category] || 'Autre'} • {prod.weightVolume || 'N/A'}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm md:text-md leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors" title={prod.name}>
                                            {prod.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                        <span className="font-bold text-[var(--color-primary)] text-lg">
                                            {prod.priceVal?.toLocaleString() || prod.price.split(' ')[0]} <span className="text-[10px] font-normal text-gray-400">FCFA</span>
                                        </span>
                                        {/* Mobile Add Button */}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="md:hidden h-8 w-8 p-0 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(prod);
                                            }}
                                        >
                                            <ShoppingBasket size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black font-medium"
                        onClick={() => toast.info("Catalogue complet affiché")}
                    >
                        Parcourir tout le catalogue
                    </Button>
                </div>
            </Container>
        </Section >
    );
};
