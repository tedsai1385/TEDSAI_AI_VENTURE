import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
    DocumentSnapshot,
    QuerySnapshot,
    writeBatch,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Article, ArticleStatus, createArticleDTO } from '@/types/article';
import { slugify } from '@/lib/utils';

const ARTICLES_COLLECTION = 'articles';

// ═════════════════════════════════════════════════════════════════
// ERREURS PERSONNALISÉES
// ═════════════════════════════════════════════════════════════════

export class ArticleError extends Error {
    constructor(
        message: string,
        public code: 'VALIDATION' | 'FIREBASE' | 'NETWORK' | 'PERMISSION' | 'NOT_FOUND'
    ) {
        super(message);
        this.name = 'ArticleError';
    }
}

// ═════════════════════════════════════════════════════════════════
// CREATE - Création avec validation complète
// ═════════════════════════════════════════════════════════════════

export async function createArticle(
    articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'slug' | 'version' | 'editedBy'>
): Promise<{ id: string; slug: string }> {
    try {
        // 1. Validation stricte
        if (!articleData.title?.trim()) {
            throw new ArticleError('Le titre est requis', 'VALIDATION');
        }
        if (!articleData.excerpt?.trim()) {
            throw new ArticleError('Le résumé est requis', 'VALIDATION');
        }
        if (!articleData.content?.trim() || articleData.content === '<p>Commencez à rédiger...</p>') {
            throw new ArticleError('Le contenu est requis', 'VALIDATION');
        }
        if (!articleData.authorId) {
            throw new ArticleError('Auteur non identifié', 'VALIDATION');
        }

        // 2. Génération slug unique
        const docRef = doc(collection(db, ARTICLES_COLLECTION));
        const baseSlug = slugify(articleData.title);
        const slug = `${baseSlug}-${docRef.id.slice(0, 8)}`;

        // 3. Vérification unicité slug
        const slugQuery = query(
            collection(db, ARTICLES_COLLECTION),
            where('slug', '==', slug)
        );
        const slugExists = !(await getDocs(slugQuery)).empty;

        if (slugExists) {
            throw new ArticleError('Un article avec ce titre existe déjà', 'VALIDATION');
        }

        // 4. Construction document complet
        const now = Timestamp.now();
        const article: Omit<Article, 'id'> = {
            ...articleData,
            slug,
            createdAt: now,
            updatedAt: now,
            version: 1,
            editedBy: [articleData.authorId],
            // Assurer valeurs par défaut
            gallery: articleData.gallery || [],
            tags: articleData.tags || [],
            stats: {
                views: 0,
                uniqueViews: 0,
                downloads: 0,
                avgReadTime: 0,
                ...articleData.stats,
            },
        };

        // 5. Écriture atomique Firestore
        await setDoc(docRef, article);

        console.log('[ArticleService] Created:', { id: docRef.id, slug, status: article.status });

        // 6. Revalidation immédiate si publié
        if (article.status === 'published') {
            await revalidateObservatoire();
        }

        return { id: docRef.id, slug };

    } catch (error: any) {
        console.error('[ArticleService] Create failed:', error);

        if (error instanceof ArticleError) throw error;
        if (error.code === 'permission-denied') {
            throw new ArticleError('Permissions insuffisantes', 'PERMISSION');
        }
        if (error.code === 'unavailable') {
            throw new ArticleError('Service temporairement indisponible', 'NETWORK');
        }

        throw new ArticleError('Erreur lors de la création', 'FIREBASE');
    }
}

// ═════════════════════════════════════════════════════════════════
// READ - Récupération avec filtres
// ═════════════════════════════════════════════════════════════════

export async function getArticleById(id: string): Promise<Article | null> {
    const docSnap = await getDoc(doc(db, ARTICLES_COLLECTION, id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Article;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('slug', '==', slug),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Article;
}

export async function getPublishedArticles(limitCount: number = 50): Promise<Article[]> {
    const q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

// ═════════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS - Pour dashboard et site public
// ═════════════════════════════════════════════════════════════════

export function subscribeToArticles(
    callback: (articles: Article[]) => void,
    filters?: { status?: ArticleStatus; category?: string; authorId?: string }
) {
    let q = query(
        collection(db, ARTICLES_COLLECTION),
        orderBy('updatedAt', 'desc')
    );

    if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
    }

    return onSnapshot(q, {
        next: (snapshot) => {
            const articles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Article[];
            callback(articles);
        },
        error: (error) => {
            console.error('[ArticleService] Subscription error:', error);
            callback([]); // Fallback vide plutôt que crash
        },
    });
}

export function subscribeToArticle(
    articleId: string,
    callback: (article: Article | null) => void
) {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);

    return onSnapshot(docRef, {
        next: (snapshot) => {
            if (!snapshot.exists()) {
                callback(null);
                return;
            }
            callback({ id: snapshot.id, ...snapshot.data() } as Article);
        },
        error: (error) => {
            console.error('[ArticleService] Single article subscription error:', error);
            callback(null);
        },
    });
}

// ═════════════════════════════════════════════════════════════════
// UPDATE - Modification avec versioning
// ═════════════════════════════════════════════════════════════════

export async function updateArticle(
    articleId: string,
    updates: Partial<Omit<Article, 'id' | 'createdAt' | 'slug'>>,
    editorId: string = 'unknown'
): Promise<void> {
    try {
        const docRef = doc(db, ARTICLES_COLLECTION, articleId);
        const current = await getDoc(docRef);

        if (!current.exists()) {
            throw new ArticleError('Article introuvable', 'NOT_FOUND');
        }

        const currentData = current.data() as Article;

        // Merge editedBy array
        const editedBy = Array.from(new Set([...(currentData.editedBy || []), editorId]));

        const updateData = {
            ...updates,
            updatedAt: Timestamp.now(),
            version: (currentData.version || 1) + 1,
            editedBy,
            // Si passage draft → published, set publishedAt
            publishedAt: updates.status === 'published' && !currentData.publishedAt
                ? Timestamp.now()
                : updates.publishedAt || currentData.publishedAt,
        };

        await updateDoc(docRef, updateData);

        console.log('[ArticleService] Updated:', { id: articleId, version: updateData.version });

        // Revalidation si impacte le public
        if (currentData.status === 'published' || updates.status === 'published') {
            await revalidateObservatoire();
        }

    } catch (error: any) {
        console.error('[ArticleService] Update failed:', error);
        if (error instanceof ArticleError) throw error;
        throw new ArticleError('Erreur lors de la mise à jour', 'FIREBASE');
    }
}

// ═════════════════════════════════════════════════════════════════
// DELETE - Soft et Hard delete
// ═════════════════════════════════════════════════════════════════

export async function archiveArticle(articleId: string): Promise<void> {
    await updateArticle(articleId, { status: 'archived' }, 'system');
    await revalidateObservatoire();
}

export async function deleteArticlePermanently(articleId: string): Promise<void> {
    await deleteDoc(doc(db, ARTICLES_COLLECTION, articleId));
    await revalidateObservatoire();
}

// Alias pour compatibilité
export const deleteArticle = archiveArticle;

export async function batchUpdateStatus(ids: string[], status: ArticleStatus): Promise<void> {
    const batch = writeBatch(db);
    ids.forEach(id => {
        const ref = doc(db, ARTICLES_COLLECTION, id);
        // Note: update requires the doc to exist.
        batch.update(ref, {
            status,
            updatedAt: serverTimestamp()
        });
    });
    await batch.commit();
    await revalidateObservatoire();
}

// ═════════════════════════════════════════════════════════════════
// REVALIDATION - Synchronisation avec site public
// ═════════════════════════════════════════════════════════════════

async function revalidateObservatoire(): Promise<void> {
    try {
        const response = await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paths: ['/observatoire', '/'],
                secret: process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
            }),
        });

        if (!response.ok) {
            console.warn('[ArticleService] Revalidation failed:', await response.text());
        } else {
            console.log('[ArticleService] Revalidated successfully');
        }
    } catch (error) {
        console.warn('[ArticleService] Revalidation error:', error);
        // Non bloquant pour l'UX
    }
}
