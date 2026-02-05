import { adminDb } from './admin';
import { Article } from '@/types/article';

const ARTICLES_COLLECTION = 'articles';

// ─── SERVER-SIDE READ (pour SSR/ISR) ───
export async function getPublishedArticles(limitCount: number = 20): Promise<Article[]> {
    try {
        const snapshot = await adminDb
            .collection(ARTICLES_COLLECTION)
            .where('status', '==', 'published')
            .orderBy('publishedAt', 'desc')
            .limit(limitCount)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Article[];
    } catch (error) {
        console.error('Error fetching published articles:', error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const snapshot = await adminDb
            .collection(ARTICLES_COLLECTION)
            .where('slug', '==', slug)
            .where('status', '==', 'published')
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        } as Article;
    } catch (error) {
        console.error('Error fetching article by slug:', error);
        return null;
    }
}

export async function getArticleById(id: string): Promise<Article | null> {
    try {
        const doc = await adminDb.collection(ARTICLES_COLLECTION).doc(id).get();

        if (!doc.exists) return null;

        return {
            id: doc.id,
            ...doc.data(),
        } as Article;
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        return null;
    }
}

export async function getAllArticleSlugs(): Promise<string[]> {
    try {
        const snapshot = await adminDb
            .collection(ARTICLES_COLLECTION)
            .where('status', '==', 'published')
            .select('slug')
            .get();

        return snapshot.docs
            .map(doc => doc.data().slug)
            .filter(Boolean) as string[];
    } catch (error) {
        console.error('Error fetching article slugs:', error);
        return [];
    }
}

// ─── STATS ───
export async function getArticlesStats(): Promise<{
    total: number;
    published: number;
    drafts: number;
    archived: number;
    totalViews: number;
}> {
    try {
        const snapshot = await adminDb.collection(ARTICLES_COLLECTION).get();

        let published = 0;
        let drafts = 0;
        let archived = 0;
        let totalViews = 0;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') published++;
            if (data.status === 'draft') drafts++;
            if (data.status === 'archived') archived++;
            totalViews += data.stats?.views || 0;
        });

        return {
            total: snapshot.size,
            published,
            drafts,
            archived,
            totalViews,
        };
    } catch (error) {
        console.error('Error fetching articles stats:', error);
        return { total: 0, published: 0, drafts: 0, archived: 0, totalViews: 0 };
    }
}
