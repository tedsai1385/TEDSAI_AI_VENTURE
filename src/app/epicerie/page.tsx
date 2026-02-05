'use client';

import React, { Suspense, useState } from 'react';
import { EpicerieHero } from '@/components/epicerie/EpicerieHero';
import { PacksSection } from '@/components/epicerie/PacksSection';
import { ProductGrid } from '@/components/epicerie/ProductGrid';
import { LivraisonPaiement } from '@/components/epicerie/LivraisonPaiement';
import { useCart } from '@/context/CartContext';

const EpicerieContent = () => {
    const { cart } = useCart();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Hero & Branding Specifique Epicerie */}
            <EpicerieHero />

            {/* 2. Reassurance */}
            <LivraisonPaiement />

            {/* 3. Packs & Offres Spéciales */}
            <PacksSection />

            {/* 4. Grille Produits (Catalogue) */}
            <div id="produits">
                <ProductGrid />
            </div>

            {/* Note: CartSidebar and FloatingButton are handled globally by LayoutWrapper now */}
        </main>
    );
};

export default function EpiceriePage() {
    return (
        <Suspense fallback={<div>Chargement de l'épicerie...</div>}>
            <EpicerieContent />
        </Suspense>
    );
}
