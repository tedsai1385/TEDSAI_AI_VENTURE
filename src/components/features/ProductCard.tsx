'use client';

import { GardenProduct } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
    product: GardenProduct;
    onAddToCart: (product: GardenProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
            {/* Image Container */}
            <div className="relative h-[250px] w-full bg-gray-50 flex items-center justify-center p-4">
                {/* Badge Top Left */}
                {product.inStock ? (
                    <span className="absolute top-3 left-3 bg-[#00B207] text-white text-xs font-medium px-3 py-1 rounded-[4px] z-10">
                        Bio
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-[4px] z-10">
                        Rupture
                    </span>
                )}

                {/* Wishlist Heart Top Right */}
                <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm hover:bg-[#00B207] hover:text-white z-10 text-gray-400">
                    <i className="fa-regular fa-heart"></i>
                </button>

                {/* Product Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'}
                        alt={product.name}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-1">
                {/* Header: Name & Price */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-gray-800 font-medium text-[15px] leading-tight group-hover:text-[#2C742F] transition-colors line-clamp-2 mb-1">
                        {product.name}
                    </h3>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-900 font-bold text-lg">
                        {product.price ? `${product.price.toLocaleString()} XAF` : '--'}
                    </span>
                    {/* Fake Original Price for Demo */}
                    {product.price && (
                        <span className="text-gray-400 text-sm line-through">
                            {(product.price * 1.2).toLocaleString()} XAF
                        </span>
                    )}
                </div>

                {/* Rating (Static for now) */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-[#FF8A00] text-xs">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                    </div>
                </div>

                {/* Footer: Add Button */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full h-[40px] rounded-full flex items-center justify-center gap-2 bg-[#F2F7F2] text-[#00B207] font-semibold text-sm hover:bg-[#00B207] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fa-solid fa-bag-shopping"></i>
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
