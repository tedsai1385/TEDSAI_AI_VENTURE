'use client';

import { GardenProduct } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
    product: GardenProduct;
    onAddToCart: (product: GardenProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group h-full flex flex-col border border-transparent hover:border-gray-100">
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {!product.inStock && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-6">Rupture de stock</span>
                    </div>
                )}

                <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider">
                    {product.category}
                </span>
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
                <div className="mb-4">
                    <p className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">{product.variety}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-700 transition-colors">{product.name}</h3>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {product.description || "Récolté frais dans nos jardins urbains selon les principes de l'agriculture régénératrice pour une qualité nutritionnelle optimale."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Prix / Unité</span>
                        <span className="text-2xl font-extrabold text-gray-900">
                            {product.price ? `${product.price.toLocaleString()}` : ''} <span className="text-sm font-bold text-gray-500">XAF</span>
                        </span>
                    </div>

                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.inStock}
                        className="h-12 w-12 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:scale-100"
                        title="Ajouter au panier"
                    >
                        <i className="fa-solid fa-plus text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
