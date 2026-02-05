import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ParcoursCards } from '@/components/home/ParcoursCards';
import { ChaineValeur } from '@/components/home/ChaineValeur';
import { PiliersGrid } from '@/components/home/PiliersGrid';
import { TracabiliteLive } from '@/components/home/TracabiliteLive';
import { SocialProof } from '@/components/home/SocialProof';
import { ObservatoireTeaser } from '@/components/home/ObservatoireTeaser';
import { CTAFinal } from '@/components/home/CTAFinal';

export default function Home() {
    return (
        <main className="min-h-screen bg-[var(--color-background)] overflow-x-hidden">
            <HeroSection />

            {/* Parcours - Overlaps Hero */}
            <ParcoursCards />

            <ChaineValeur />

            <PiliersGrid />

            <TracabiliteLive />

            <SocialProof />

            <ObservatoireTeaser />

            <CTAFinal />
        </main>
    );
}
