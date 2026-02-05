import { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/firebase/articles-service';
import { ObservatoireClient } from './ObservatoireClient';

export const metadata: Metadata = {
    title: 'Observatoire TEDSAI | Analyses AgriTech & IA',
    description: 'Découvrez nos analyses, études et données sur l\'agriculture urbaine et l\'intelligence artificielle en Afrique.',
};

// Revalidation toutes les 60 secondes + on-demand
export const revalidate = 60;

export default async function ObservatoirePage() {
    // Récupération serveur initiale (SEO)
    let initialArticles: any[] = [];
    try {
        initialArticles = await getPublishedArticles(20);
    } catch (error) {
        console.error("[Observatoire] Failed to fetch initial articles. Waiting for Index creation?", error);
        // Fallback à vide le temps que l'index soit créé
    }

    return (
        <ObservatoireClient
            initialArticles={initialArticles}
            totalCount={initialArticles.length}
        />
    );
}
