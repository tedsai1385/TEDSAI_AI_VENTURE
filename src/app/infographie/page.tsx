import React from 'react';
import { InfographieHero } from '@/components/infographie/InfographieHero';
import { ServicesDesign } from '@/components/infographie/ServicesDesign';
import { ProcessDesign } from '@/components/infographie/ProcessDesign';
import { PortfolioGallery } from '@/components/infographie/PortfolioGallery';
import { PacksDesign } from '@/components/infographie/PacksDesign';

export default function InfographiePage() {
    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            <InfographieHero />

            <ServicesDesign />

            <ProcessDesign />

            <PortfolioGallery />

            <PacksDesign />
        </main>
    );
}
