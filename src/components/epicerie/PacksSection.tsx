'use client';

import React, { useEffect } from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Package, Utensils, Home, Gift } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { usePacksStore } from '@/lib/store/packs-store';

const ICONS = {
    utensils: <Utensils size={32} className="text-orange-500" />,
    home: <Home size={32} className="text-green-500" />,
    package: <Package size={32} className="text-purple-500" />,
    gift: <Gift size={32} className="text-blue-500" />
};

export const PacksSection = () => {
    const { addItem } = useCart();
    const { packs, listenToPacks, isLoading } = usePacksStore();

    useEffect(() => {
        const unsubscribe = listenToPacks();
        return () => unsubscribe();
    }, [listenToPacks]);

    const handleAddPack = (pack: any) => {
        addItem({
            id: `pack-${pack.title}`,
            productId: `pack-${pack.title}`,
            name: pack.title,
            price: parseInt(pack.price.replace(/\D/g, '')) || 0,
            quantity: 1,
            image: pack.image,
            variety: 'Pack',
            category: 'menu',
            // On peut stocker la composition dans une métadonnée si le panier le supporte plus tard
        });
        toast.success(`${pack.title} ajouté au panier !`);
    };

    if (isLoading) {
        return (
            <Section spacing="base" className="bg-[var(--color-primary-50)] min-h-[400px]">
                <Container>
                    <div className="text-center">Chargement des offres...</div>
                </Container>
            </Section>
        );
    }

    if (packs.length === 0) return null; // Ne rien afficher s'il n'y a pas de packs actifs

    return (
        <Section spacing="base" className="bg-[var(--color-primary-50)]">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold mb-4">Nos Packs Malins</h2>
                    <p className="text-gray-600">Plus simple, plus économique. Tout est déjà pensé pour vous.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packs.map((pack) => (
                        <Card key={pack.id} padded={false} hover className="overflow-hidden flex flex-col bg-white">
                            <div className="h-48 bg-gray-200 relative">
                                {pack.image ? (
                                    <Image
                                        src={pack.image}
                                        alt={pack.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <Package size={48} />
                                    </div>
                                )}
                                {pack.promo && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                        {pack.promo}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pack.bg || 'bg-gray-50'}`}>
                                    {ICONS[pack.iconType as keyof typeof ICONS] || ICONS.package}
                                </div>

                                <h3 className="text-xl font-bold mb-2">{pack.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {pack.desc}
                                </p>

                                <div className="bg-gray-50 rounded-lg p-3 mb-6 flex-1">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Contenu</h4>
                                    <ul className="space-y-1">
                                        {pack.items && pack.items.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gray-400 rounded-full" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xl font-bold text-[var(--color-primary)]">{pack.price}</span>
                                    <Button size="sm" variant="primary" onClick={() => handleAddPack(pack)}>Commander</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
