import React from 'react';
import { GardenHero } from '@/components/selected-garden/GardenHero';
import { NosProduits } from '@/components/selected-garden/NosProduits';
import { TechnologieAquaponie } from '@/components/selected-garden/TechnologieAquaponie';
import { ImpactEcologique } from '@/components/selected-garden/ImpactEcologique';
import { AbonnementPanier } from '@/components/selected-garden/AbonnementPanier';
import { TracabiliteAction } from '@/components/vitedia/TracabiliteAction';

export default function GardenPage() {
    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <GardenHero />

            <NosProduits />

            <TechnologieAquaponie />

            <ImpactEcologique />

            <AbonnementPanier />

            {/* Réutilisation intelligente du composant de traçabilité qui est transversal */}
            <TracabiliteAction />
        </main>
    );
}
