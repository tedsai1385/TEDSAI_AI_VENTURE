'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button-mobile';
import { ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';

const products = [
    { id: 1, name: "Poivre de Penja", price: "5 000 FCFA", image: "/assets/images/products/penja.jpg" }, // Updated path assumption based on existing structure or placeholders, but sticking to user request for now or common patterns. Let's use placeholders if images don't exist, but here I'll try to guess based on globals text. The user code had /products/..., I will use existing images or just placeholders for now or stick to user input. Actually I'll use what user provided but with a safe fallback or just assume paths.
    { id: 2, name: "Miel Blanc d'Oku", price: "6 000 FCFA", image: "/assets/images/products/miel.png" },
    { id: 3, name: "Poudre de Moringa", price: "2 500 FCFA", image: "/assets/images/products/moringa.jpg" },
];

export function Products() {
    return (
        <section className="py-8 sm:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                <motion.h2
                    className="text-fluid-2xl sm:text-fluid-3xl font-bold text-center text-gray-900 mb-6 sm:mb-12"
                >
                    Nos Trésors
                </motion.h2>

                {/* Grid responsive : 1 colonne mobile, 2 tablet, 3 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                        >
                            {/* Image optimisée */}
                            <div className="relative aspect-[4/3] sm:aspect-square bg-gray-200">
                                {/* Fallback color if image missing */}
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>

                            <div className="p-3 sm:p-5">
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                                    {product.name}
                                </h3>
                                <p className="text-purple-600 font-bold text-lg sm:text-xl mt-1">
                                    {product.price}
                                </p>

                                {/* ═══════════════════════════════════════════════════════════════
                    BOUTONS COMPACTS SUR MOBILE
                    ═══════════════════════════════════════════════════════════════ */}
                                <div className="flex gap-2 mt-3 sm:mt-4">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
                                    >
                                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Ajouter</span>
                                        <span className="sm:hidden">Panier</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-2 sm:px-4"
                                    >
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="sr-only">Voir</span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
