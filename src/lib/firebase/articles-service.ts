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
    getDoc
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
export async function createArticle(data: Partial<Article>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            stats: { views: 0, uniqueViews: 0, downloads: 0, avgReadTime: 0 }
        });
        return docRef.id;
    } catch (error) {
        throw new ArticleError('Failed to create article', 'CREATE_FAILED');
    }
}

// Update Article
export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
    try {
        const docRef = doc(db, ARTICLES_COLLECTION, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
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
