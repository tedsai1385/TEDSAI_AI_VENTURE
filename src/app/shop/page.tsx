'use client';

import React, { Suspense } from 'react';
import { BoutiqueHero } from '@/components/shop/BoutiqueHero';
import { PacksSection } from '@/components/epicerie/PacksSection';
import { ProductGrid } from '@/components/epicerie/ProductGrid';
import { LivraisonPaiement } from '@/components/epicerie/LivraisonPaiement';

const ShopContent = () => {
    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Hero & Branding Boutique Global */}
            <BoutiqueHero />

            {/* 2. Reassurance */}
            <LivraisonPaiement />

            {/* 3. Packs & Offres Spéciales */}
            <PacksSection />

            {/* 4. Grille Produits (Catalogue Global) */}
            <div id="produits">
                <ProductGrid />
            </div>

            {/* Panier fourni par le LayoutWrapper global */}
        </main>
    );
};

export default function ShopPage() {
    return (
        <Suspense fallback={<div>Chargement de la boutique...</div>}>
            <ShopContent />
        </Suspense>
    );
}
