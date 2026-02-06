import { Article } from '@/types/article';
import { Timestamp } from 'firebase/firestore';

// Simulation data
const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Agriculture Urbaine : L\'Avenir des Villes Africaines',
        subtitle: 'Comment les métropoles intègrent la production alimentaire',
        excerpt: 'Une analyse approfondie des nouvelles tendances de l\'agriculture urbaine à Douala et Yaoundé.',
        content: '<p>Contenu de l\'article...</p>',
        heroImage: {
            url: '/assets/images/hero_bg.webp',
            alt: 'Serre urbaine'
        },
        category: 'agriculture-urbaine',
        tags: ['urban-farming', 'africa', 'sustainability'],
        status: 'published',
        authorId: 'admin',
        authorName: 'Admin TEDSAI',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        stats: {
            views: 120,
            uniqueViews: 85,
            downloads: 10,
            avgReadTime: 300
        },
        slug: 'agriculture-urbaine-avenir-villes',
        version: 1,
        editedBy: ['admin']
    },
    {
        id: '2',
        title: 'IA et Rendement Agricole',
        subtitle: 'L\'impact du Machine Learning sur les récoltes',
        excerpt: 'Découvrez comment les algorithmes prédictifs optimisent les rendements de nos serres connectées.',
        content: '<p>Contenu de l\'article...</p>',
        heroImage: {
            url: '/assets/images/hero_bg.webp',
            alt: 'IA Agriculture'
        },
        category: 'intelligence-artificielle',
        tags: ['ai', 'yield', 'optimization'],
        status: 'published',
        authorId: 'admin',
        authorName: 'Dr. AI',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        stats: {
            views: 450,
            uniqueViews: 300,
            downloads: 50,
            avgReadTime: 420
        },
        slug: 'ia-rendement-agricole',
        version: 1,
        editedBy: ['admin']
    }
];

export function subscribeToArticles(
    callback: (articles: Article[]) => void,
    options?: { status?: string }
): () => void {
    console.log('Subscribe to articles (MOCK MODE)', options);

    // Simulate async data fetch
    setTimeout(() => {
        let filtered = [...MOCK_ARTICLES];
        if (options?.status) {
            filtered = filtered.filter(a => a.status === options.status);
        }
        callback(filtered);
    }, 500);

    // Return unsubscribe function
    return () => {
        console.log('Unsubscribe from articles (MOCK MODE)');
    };
}
