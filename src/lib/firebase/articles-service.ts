import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    increment,
    limit,
    getDoc,
    arrayUnion,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Article } from '@/types/article';

const ARTICLES_COLLECTION = 'articles';

// Error class
export class ArticleError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'ArticleError';
    }
}

// Subscribe to articles (Admin / Dashboard)
export function subscribeToArticles(
    callback: (articles: Article[]) => void,
    options?: { status?: string, limit?: number }
): () => void {
    let q = query(collection(db, ARTICLES_COLLECTION), orderBy('updatedAt', 'desc'));

    if (options?.status) {
        q = query(q, where('status', '==', options.status));
    }

    if (options?.limit) {
        q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (snapshot) => {
        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Article[];
        callback(articles);
    });
}

// Get single article subscription
export function subscribeToArticle(
    id: string,
    callback: (article: Article | null) => void
): () => void {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as Article);
        } else {
            callback(null);
        }
    });
}

// Get published articles (Public)
export async function getPublishedArticles(limitCount = 10): Promise<Article[]> {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

// Create Article
// Create Article
export async function createArticle(data: Partial<Article>): Promise<{ id: string, slug: string }> {
    try {
        // Ensure slug
        let slug = data.slug;
        if (!slug && data.title) {
            slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Fallback for empty slug if title is missing or empty
        if (!slug) {
            slug = `draft-${Date.now()}`;
        }

        const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
            ...data,
            slug,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            stats: { views: 0, uniqueViews: 0, downloads: 0, avgReadTime: 0 }
        });

        return { id: docRef.id, slug };
    } catch (error) {
        throw new ArticleError('Failed to create article', 'CREATE_FAILED');
    }
}

// Update Article
export async function updateArticle(id: string, data: Partial<Article>, userId?: string): Promise<void> {
    try {
        const docRef = doc(db, ARTICLES_COLLECTION, id);

        const updates: any = {
            ...data,
            updatedAt: serverTimestamp()
        };

        if (userId) {
            updates.editedBy = arrayUnion(userId);
        }

        await updateDoc(docRef, updates);
    } catch (error) {
        throw new ArticleError('Failed to update article', 'UPDATE_FAILED');
    }
}

// Delete Article
export async function deleteArticle(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
    } catch (error) {
        throw new ArticleError('Failed to delete article', 'DELETE_FAILED');
    }
}

// Increment Views
export async function incrementArticleViews(id: string, isUnique: boolean): Promise<void> {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const updates: any = {
        'stats.views': increment(1),
        'stats.lastViewedAt': serverTimestamp()
    };

    if (isUnique) {
        updates['stats.uniqueViews'] = increment(1);
    }

    await updateDoc(docRef, updates);
}

// Batch Update Status
export async function batchUpdateStatus(ids: string[], status: 'published' | 'draft' | 'archived'): Promise<void> {
    try {
        const batch = writeBatch(db);

        ids.forEach(id => {
            const docRef = doc(db, ARTICLES_COLLECTION, id);
            batch.update(docRef, {
                status,
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
    } catch (error) {
        throw new ArticleError('Failed to batch update status', 'BATCH_UPDATE_FAILED');
    }
}
