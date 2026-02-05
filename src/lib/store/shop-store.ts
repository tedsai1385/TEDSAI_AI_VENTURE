import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShopProduct {
    id: string;
    name: string;
    price: number;
    promoPrice?: number;
    stock: number;
    category: string;
    isAntiWaste: boolean;
    expiresAt?: string;
    status: 'published' | 'draft';
}

interface ShopStore {
    products: ShopProduct[];
    generateAntiWastePromo: (ingredientName: string, quantity: number) => void;
}

export const useShopStore = create<ShopStore>()(
    persist(
        (set) => ({
            products: [],
            generateAntiWastePromo: (ingredientName, quantity) => {
                // Logic: Create a promo product if surplus
                const promoProduct: ShopProduct = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: `Panier Anti-Gaspi: ${ingredientName}`,
                    price: 2000,
                    promoPrice: 1400, // 30% off mock
                    stock: quantity,
                    category: 'Légumes',
                    isAntiWaste: true,
                    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
                    status: 'published'
                };

                set((state) => ({ products: [...state.products, promoProduct] }));
            },
        }),
        { name: 'tedsai-shop-store' }
    )
);
