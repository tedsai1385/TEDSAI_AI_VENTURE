import { Timestamp } from 'firebase/firestore';

export type ArticleCategory = string;

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
    id: string;

    // Contenu éditorial
    title: string;
    subtitle: string;
    excerpt: string;           // Résumé 160 chars pour SEO/cards
    content: string;           // HTML TipTap
    contentJSON?: object;      // JSON TipTap natif (backup/restauration)

    // Médias
    heroImage: {
        url: string;
        alt: string;
        caption?: string;
    };
    gallery?: {
        id: string;
        url: string;
        type: 'image' | 'video';
        caption?: string;
    }[];

    // Taxonomie
    category: ArticleCategory;
    tags: string[];            // Array de strings, indexé pour recherche

    // Workflow
    status: ArticleStatus;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    reviewerId?: string;       // Pour workflow validation

    // Métadonnées temporelles
    createdAt: Timestamp;
    updatedAt: Timestamp;
    publishedAt: Timestamp | null;

    // Engagement (mise à jour temps réel)
    stats: {
        views: number;
        uniqueViews: number;     // Basé sur fingerprint/session
        downloads: number;       // Pour PDF/études
        avgReadTime: number;     // En secondes
        lastViewedAt?: Timestamp;
    };

    // SEO
    slug: string;              // URL-friendly: "ia-serres-urbaines-2024"
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;

    // Versioning (optionnel pour audit)
    version: number;
    editedBy: string[];        // Historique des éditeurs
}

// Helper pour création
export const createArticleDTO = (data: Partial<Article>): Omit<Article, 'id'> => ({
    title: '',
    subtitle: '',
    excerpt: '',
    content: '<p>Commencez à rédiger...</p>',
    contentJSON: {},
    heroImage: { url: '', alt: '' },
    gallery: [],
    category: 'agriculture-urbaine',
    tags: [],
    status: 'draft',
    authorId: '',
    authorName: '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    publishedAt: null,
    stats: {
        views: 0,
        uniqueViews: 0,
        downloads: 0,
        avgReadTime: 0
    },
    slug: '',
    metaTitle: '',
    metaDescription: '',
    version: 1,
    editedBy: [],
    ...data,
});

// Helper catégorie → Label français
export const getCategoryLabel = (category: ArticleCategory): string => {
    const labels: Record<ArticleCategory, string> = {
        'agriculture-urbaine': 'Agriculture Urbaine',
        'intelligence-artificielle': 'Intelligence Artificielle',
        'economie-durable': 'Économie Durable',
        'innovation': 'Innovation',
        'etudes-de-cas': 'Études de Cas',
    };
    return labels[category];
};

// Helper statut → Config UI
export const getStatusConfig = (status: ArticleStatus) => {
    const configs = {
        draft: {
            color: 'bg-yellow-500 text-white border-yellow-600',
            label: 'Brouillon',
            icon: 'Clock'
        },
        published: {
            color: 'bg-green-600 text-white border-green-700',
            label: 'Publié',
            icon: 'CheckCircle'
        },
        archived: {
            color: 'bg-gray-600 text-white border-gray-700',
            label: 'Archivé',
            icon: 'Archive'
        },
    };
    return configs[status];
};
