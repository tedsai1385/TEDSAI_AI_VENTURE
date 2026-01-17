'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingBasket,
    Leaf,
    Truck,
    Star,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';



export default function EpiceriePage() {
    const categories = ['Tous', 'Légumes', 'Fruits', 'Épices', 'Transformés', 'Viandes'];

    const products = [
        {
            name: 'Piment Jaune',
            category: 'Épices',
            price: 3000,
            unit: 'kg',
            rating: 4.8,
            reviews: 120,
            image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&q=80',
            tag: 'Bio'
        },
        {
            name: 'Tomates Grappe',
            category: 'Légumes',
            price: 2500,
            unit: 'kg',
            rating: 4.9,
            reviews: 85,
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
            tag: 'Local'
        },
        {
            name: 'Confiture de Papaye',
            category: 'Transformés',
            price: 3500,
            unit: 'pot',
            rating: 5.0,
            reviews: 42,
            image: 'https://images.unsplash.com/photo-1599321742911-c917454f4841?w=800&q=80',
            tag: 'Artisanal'
        },
        {
            name: 'Poivre de Penja',
            category: 'Épices',
            price: 15000,
            unit: 'kg',
            rating: 5.0,
            reviews: 200,
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
            tag: 'IGP'
        },
        {
            name: 'Miel de Foret',
            category: 'Transformés',
            price: 6000,
            unit: 'litre',
            rating: 4.9,
            reviews: 65,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
            tag: 'Naturel'
        },
        {
            name: 'Poulet Fumé',
            category: 'Viandes',
            price: 8000,
            unit: 'unité',
            rating: 4.7,
            reviews: 150,
            image: '/assets/images/placeholder_dish.webp',
            tag: 'Fumé traditionnel'
        }
    ];

    return (
        <main className="min-h-screen">
            <section className="relative py-24 bg-gradient-to-br from-green-800 to-emerald-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <ShoppingBasket className="w-4 h-4 mr-2" />
                            Épicerie Fine & Bio
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                            Le Meilleur du <span className="text-green-400">Terroir</span>
                        </h1>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
                            Une sélection rigoureuse de produits locaux, bio et transformés artisanalement.
                            Livraison directe chez vous en 24h.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                            {categories.map((cat, i) => (
                                <button
                                    key={i}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card hover className="h-full border-none shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                                    <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-2xl">
                                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-white/90 text-green-800 backdrop-blur-sm">{product.tag}</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                                <p className="text-xs text-gray-500">{product.category}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                                                <Star className="w-3 h-3 fill-current" />
                                                {product.rating}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div>
                                                <span className="text-lg font-bold text-green-700">{formatCurrency(product.price)}</span>
                                                <span className="text-xs text-gray-500">/{product.unit}</span>
                                            </div>
                                            <Button size="sm" rounded="full" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0">
                                                <ShoppingBasket className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col items-center p-8 bg-green-50 rounded-3xl">
                            <Truck className="w-10 h-10 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Livraison Express</h3>
                            <p className="text-gray-600 max-w-sm mb-6">
                                Commandez avant 12h et recevez votre panier le jour même à Yaoundé.
                            </p>
                            <Link href="/contact">
                                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                                    Zone de livraison
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
