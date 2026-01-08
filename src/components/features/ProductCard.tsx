'use client';

import { GardenProduct } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
    product: GardenProduct;
    onAddToCart: (product: GardenProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800');

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
            {/* Image Container - FIXED HEIGHT AND RELATIVE */}
            <div className="relative h-[250px] w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                {/* Badge Top Left */}
                {product.inStock ? (
                    <span className="absolute top-3 left-3 bg-[#00B207] text-white text-xs font-medium px-3 py-1 rounded-[4px] z-10 shadow-sm">
                        Bio
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-[4px] z-10 shadow-sm">
                        Rupture
                    </span>
                )}

                {/* Wishlist Heart Top Right - CLICKABLE */}
                <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-[#00B207] hover:text-white z-20 cursor-pointer text-gray-400"
                    title="Ajouter aux favoris"
                >
                    <i className="fa-regular fa-heart"></i>
                </button>

                {/* Product Image - CONTAIN */}
                <div className="relative w-full h-full p-2">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={() => setImgSrc('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800')} // Fallback image
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-1">
                {/* Header: Name */}
                <div className="flex justify-between items-start mb-1 h-[42px]">
                    <h3 className="text-gray-800 font-medium text-[15px] leading-tight group-hover:text-[#2C742F] transition-colors line-clamp-2 w-full">
                        {product.name}
                    </h3>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-900 font-bold text-lg">
                        {product.price ? `${product.price.toLocaleString()} XAF` : '--'}
                    </span>
                    {product.price && (
                        <span className="text-gray-400 text-sm line-through">
                            {(product.price * 1.2).toLocaleString()} XAF
                        </span>
                    )}
                </div>

                {/* Footer: Add Button - CENTERED AND VISIBLE */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        disabled={!product.inStock}
                        className="w-full h-[45px] rounded-full flex items-center justify-center gap-2 bg-[#F2F7F2] text-[#00B207] font-bold text-sm hover:bg-[#00B207] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20 relative active:scale-95"
                    >
                        <i className="fa-solid fa-basket-shopping"></i>
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    );
}
