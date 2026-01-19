'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import DishCustomizationModal from './DishCustomizationModal';

export interface TraceabilityItem {
    ingredient: string;
    source: string;
    verified: boolean;
    qrCode?: string;
}

export interface DishProps {
    id: string; // Made id required
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    allergens?: string[];
    spicyLevel?: 0 | 1 | 2 | 3; // 0=None, 3=Hot
    traceability: TraceabilityItem[];
    isNew?: boolean;
    isPopular?: boolean;
}

export default function DishCard({ dish }: { dish: DishProps }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = (quantity: number, options: any) => {
        addItem({
            id: dish.id,
            productId: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: quantity,
            image: dish.image,
            category: 'menu',
            options: options
        });
        // toast.success(`${quantity}x ${dish.name} ajouté au panier`);
        console.log(`${quantity}x ${dish.name} ajouté au panier`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full font-serif font-bold text-amber-800 shadow-lg">
                        {formatCurrency(dish.price)}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                            {dish.category}
                        </Badge>
                        {dish.isNew && (
                            <Badge className="bg-green-500 text-white shadow-sm shimmer">
                                NOUVEAU
                            </Badge>
                        )}
                        {dish.isPopular && (
                            <Badge className="bg-amber-500 text-white shadow-sm">
                                POPULAIRE
                            </Badge>
                        )}
                    </div>

                    {/* Spicy Level Indicator */}
                    {dish.spicyLevel && dish.spicyLevel > 0 && (
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-xs shadow-sm" title={`Niveau épicé : ${dish.spicyLevel}/3`}>
                            {Array(dish.spicyLevel).fill('🌶️').join('')}
                        </div>
                    )}
                </div>

                <CardContent className="p-6 relative bg-white">
                    {/* Title & Desc */}
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                        {dish.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {dish.description}
                    </p>

                    {/* Traceability Block */}
                    <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
                        <div className="text-xs font-bold text-green-800 flex items-center gap-2 mb-2 uppercase tracking-wider">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Traçabilité Certifiée
                        </div>
                        <div className="space-y-1.5">
                            {dish.traceability.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-green-900/80">
                                    <span className="font-medium">• {item.ingredient}</span>
                                    <span className="opacity-75 italic text-[10px]">{item.source}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            Commander
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full border-gray-200 hover:bg-gray-50 text-gray-500">
                            <Info className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <DishCustomizationModal
                dish={dish}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAddToCart}
            />
        </motion.div>
    );
}
