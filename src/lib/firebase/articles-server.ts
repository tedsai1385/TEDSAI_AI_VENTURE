import { adminDb } from '@/lib/firebase/admin';
import { Article } from '@/types/article';
import { Timestamp } from 'firebase-admin/firestore';

const ARTICLES_COLLECTION = 'articles';

// Convert Firebase Admin Timestamp to client-compatible Timestamp or Date
const convertTimestamp = (ts: Timestamp | null) => {
    if (!ts) return null;
    return {
        seconds: ts.seconds,
        nanoseconds: ts.nanoseconds,
        toDate: () => ts.toDate(),
    };
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    if (!adminDb) return null;

    try {
        const snapshot = await adminDb
            .collection(ARTICLES_COLLECTION)
            .where('slug', '==', slug)
            .where('status', '==', 'published')
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();

        // Ensure data matches Article interface
        return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
            publishedAt: convertTimestamp(data.publishedAt),
            stats: {
                ...data.stats,
                lastViewedAt: convertTimestamp(data.stats?.lastViewedAt)
            }
        } as unknown as Article;
    } catch (error) {
        console.error('Error fetching article by slug:', error);
        return null;
    }
};

export const getAllArticleSlugs = async (): Promise<string[]> => {
    if (!adminDb) return [];

    try {
        const snapshot = await adminDb
            .collection(ARTICLES_COLLECTION)
            .where('status', '==', 'published')
            .select('slug')
            .get();

        return snapshot.docs.map(doc => doc.data().slug);
    } catch (error) {
        console.error('Error fetching article slugs:', error);
        return [];
    }
};
