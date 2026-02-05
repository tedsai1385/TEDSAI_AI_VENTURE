'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShoppingBasket, Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useGardenStore } from '@/lib/store/garden-store';
import { useCart } from '@/context/CartContext';

export const NosProduits = () => {
    const { products, isLoading, startFirestoreSync, _lastSyncSource } = useGardenStore();
    const { addItem } = useCart();
    const [hasHydrated, setHasHydrated] = React.useState(false);

    useEffect(() => {
        setHasHydrated(true);
        console.log('🌱 [NosProduits] Montage du composant, démarrage du sync...');
        const unsubscribe = startFirestoreSync();
        return () => unsubscribe();
    }, [startFirestoreSync]);

    // On s'assure de ne prendre QUE les produits en stock
    const activeProducts = products
        .filter(p => p.inStock === true)
        .sort((a, b) => {
            const dateA = (a as any).createdAt?.seconds || 0;
            const dateB = (b as any).createdAt?.seconds || 0;
            return dateB - dateA;
        });

    const handleAddToCart = (prod: any) => {
        const numericPrice = typeof prod.price === 'string'
            ? parseInt(prod.price.replace(/[^\d]/g, ''))
            : prod.price;

        addItem({
            id: prod.id + '-garden',
            productId: prod.id,
            name: prod.name,
            price: numericPrice || 0,
            quantity: 1,
            image: prod.image || '',
            category: 'garden'
        });
    };

    if (!hasHydrated || (isLoading && products.length === 0)) {
        return (
            <Section spacing="base" className="bg-[#FAF9F6]">
                <Container>
                    <div className="flex flex-col justify-center items-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                        <p className="text-zinc-500 font-medium animate-pulse">Récupération des récoltes du matin...</p>
                    </div>
                </Container>
            </Section>
        );
    }

    return (
        <Section spacing="base" id="notre-catalogue" className="bg-[#FAF9F6]">
            <Container>
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <Badge variant="outline" className="mb-4 border-green-200 text-green-700 bg-green-50 px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
                        Distribution Directe
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 text-zinc-900 tracking-tight">
                        Récolté ce matin, <span className="text-green-700">chez vous</span> ce soir
                    </h2>
                    <p className="text-zinc-600 text-lg leading-relaxed">
                        Nos produits ne voyagent pas en conteneur. Ils poussent à SelecTED Garden et arrivent frais dans votre assiette.
                    </p>
                </div>

                {activeProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                        <ShoppingBasket className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">Le catalogue est en cours de mise à jour...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {activeProducts.map((prod) => (
                            <Card key={prod.id} padded={false} hover className="overflow-hidden bg-white h-full flex flex-col group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl">
                                <div className="h-64 relative overflow-hidden bg-zinc-100">
                                    {prod.image ? (
                                        <picture>
                                            <img
                                                src={prod.image}
                                                alt={prod.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </picture>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                            <ImageIcon size={48} className="opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge variant="success" size="sm" className="bg-white/90 backdrop-blur-md text-green-800 border-none shadow-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                                            {prod.tag}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-xl text-zinc-900 group-hover:text-green-700 transition-colors uppercase tracking-tight">{prod.name}</h3>
                                    </div>
                                    <div className="text-2xl font-black text-green-700 mb-4">{prod.price}</div>
                                    <p className="text-sm text-zinc-500 mb-6 flex-1 leading-relaxed line-clamp-3">
                                        {prod.description}
                                    </p>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full rounded-2xl border-2 border-zinc-100 text-zinc-900 font-bold hover:bg-green-700 hover:text-white hover:border-green-700 transition-all group-hover:shadow-lg group-hover:shadow-green-700/20"
                                        onClick={() => handleAddToCart(prod)}
                                    >
                                        Ajouter au Panier
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-20 flex flex-col items-center gap-6">
                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Plus de choix disponibles</p>
                    <Button
                        size="lg"
                        className="bg-green-700 hover:bg-green-800 text-white px-10 py-8 rounded-2xl text-lg font-bold shadow-xl shadow-green-700/30 transition-all hover:-translate-y-1 active:scale-95"
                        onClick={() => window.open('https://wa.me/237699999999', '_blank')}
                    >
                        <ShoppingBasket size={24} className="mr-2" />
                        Accéder au Catalogue Complet
                    </Button>
                </div>
            </Container>
        </Section>
    );
};
