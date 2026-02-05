import { create } from 'zustand';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Article, ArticleCategory, ContentType, ArticleStatus } from '@/types/observatoire';
import { toast } from 'sonner';

interface ArticlesStore {
    articles: Article[];
    isLoading: boolean;
    filters: {
        category?: ArticleCategory;
        contentType?: ContentType;
        search?: string;
        status?: ArticleStatus;
    };

    // Public methods
    fetchArticles: () => Promise<void>;
    fetchPublishedArticles: () => Promise<void>;
    fetchArticleBySlug: (slug: string) => Promise<Article | null>;
    setFilters: (filters: Partial<ArticlesStore['filters']>) => void;

    // Admin methods
    createArticle: (data: Partial<Article>) => Promise<string>;
    updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    submitForReview: (id: string) => Promise<void>;
    publishArticle: (id: string) => Promise<void>;
    archiveArticle: (id: string) => Promise<void>;

    // Stats
    incrementViews: (id: string) => Promise<void>;
    incrementDownloads: (id: string) => Promise<void>;
}

const articlesCollection = collection(db, 'articles');

export const useArticlesStore = create<ArticlesStore>((set, get) => ({
    articles: [],
    isLoading: false,
    filters: {},

    /**
     * Récupère tous les articles (Admin)
     */
    fetchArticles: async () => {
        set({ isLoading: true });

        try {
            const q = query(
                articlesCollection,
                orderBy('workflow.createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const articles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                workflow: {
                    ...doc.data().workflow,
                    createdAt: doc.data().workflow.createdAt?.toDate(),
                    submittedAt: doc.data().workflow.submittedAt?.toDate(),
                    publishedAt: doc.data().workflow.publishedAt?.toDate(),
                    lastModified: doc.data().workflow.lastModified?.toDate(),
                }
            })) as Article[];

            set({ articles, isLoading: false });
        } catch (error) {
            console.error('❌ Error fetching articles:', error);
            toast.error('Erreur lors du chargement des articles');
            set({ isLoading: false });
        }
    },

    /**
     * Récupère uniquement les articles publiés (Public)
     */
    fetchPublishedArticles: async () => {
        set({ isLoading: true });

        try {
            const q = query(
                articlesCollection,
                where('status', '==', 'published'),
                orderBy('workflow.publishedAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const articles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                workflow: {
                    ...doc.data().workflow,
                    createdAt: doc.data().workflow.createdAt?.toDate(),
                    submittedAt: doc.data().workflow.submittedAt?.toDate(),
                    publishedAt: doc.data().workflow.publishedAt?.toDate(),
                    lastModified: doc.data().workflow.lastModified?.toDate(),
                }
            })) as Article[];

            set({ articles, isLoading: false });
        } catch (error) {
            console.error('❌ Error fetching published articles:', error);
            toast.error('Erreur lors du chargement des articles');
            set({ isLoading: false });
        }
    },

    /**
     * Récupère un article par son slug
     */
    fetchArticleBySlug: async (slug: string) => {
        try {
            const q = query(
                articlesCollection,
                where('slug', '==', slug),
                where('status', '==', 'published')
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
                workflow: {
                    ...doc.data().workflow,
                    createdAt: doc.data().workflow.createdAt?.toDate(),
                    submittedAt: doc.data().workflow.submittedAt?.toDate(),
                    publishedAt: doc.data().workflow.publishedAt?.toDate(),
                    lastModified: doc.data().workflow.lastModified?.toDate(),
                }
            } as Article;
        } catch (error) {
            console.error('❌ Error fetching article by slug:', error);
            return null;
        }
    },

    /**
     * Définit les filtres de recherche
     */
    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters }
        }));
    },

    /**
     * Crée un nouvel article (brouillon)
     */
    createArticle: async (data) => {
        try {
            const now = new Date();

            // Génération automatique du slug
            const slug = data.title
                ? data.title.toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-')
                : `article-${Date.now()}`;

            const articleData = {
                title: data.title || '',
                subtitle: data.subtitle || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
                slug,
                category: data.category || 'innovation',
                contentType: data.contentType || 'article',
                heroMedia: data.heroMedia || { url: '', type: 'image', alt: '' },
                authors: data.authors || [],
                status: 'draft' as ArticleStatus,
                workflow: {
                    createdBy: 'admin', // TODO: Get from auth context
                    createdAt: Timestamp.fromDate(now),
                    lastModified: Timestamp.fromDate(now),
                },
                stats: {
                    views: 0,
                    downloads: 0,
                    avgReadTime: 0,
                },
                seo: {
                    metaTitle: data.seo?.metaTitle || data.title || '',
                    metaDescription: data.seo?.metaDescription || data.excerpt || '',
                    keywords: data.seo?.keywords || [],
                }
            };

            const docRef = await addDoc(articlesCollection, articleData);

            toast.success('Article créé avec succès');

            // Rafraîchir la liste
            await get().fetchArticles();

            return docRef.id;
        } catch (error) {
            console.error('❌ Error creating article:', error);
            toast.error('Erreur lors de la création de l\'article');
            throw error;
        }
    },

    /**
     * Met à jour un article existant
     */
    updateArticle: async (id, data) => {
        try {
            const articleRef = doc(db, 'articles', id);

            const updateData: any = {
                ...data,
                'workflow.lastModified': Timestamp.fromDate(new Date()),
            };

            // Mise à jour du slug si le titre change
            if (data.title) {
                updateData.slug = data.title
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-');
            }

            await updateDoc(articleRef, updateData);

            toast.success('Article mis à jour');

            // Rafraîchir la liste
            await get().fetchArticles();
        } catch (error) {
            console.error('❌ Error updating article:', error);
            toast.error('Erreur lors de la mise à jour');
            throw error;
        }
    },

    /**
     * Supprime un article
     */
    deleteArticle: async (id) => {
        try {
            await deleteDoc(doc(db, 'articles', id));

            toast.success('Article supprimé');

            // Rafraîchir la liste
            await get().fetchArticles();
        } catch (error) {
            console.error('❌ Error deleting article:', error);
            toast.error('Erreur lors de la suppression');
            throw error;
        }
    },

    /**
     * Soumet un article pour validation
     */
    submitForReview: async (id) => {
        try {
            const articleRef = doc(db, 'articles', id);

            await updateDoc(articleRef, {
                status: 'pending-review',
                'workflow.submittedAt': Timestamp.fromDate(new Date()),
                'workflow.lastModified': Timestamp.fromDate(new Date()),
            });

            toast.success('Article soumis pour validation');

            await get().fetchArticles();
        } catch (error) {
            console.error('❌ Error submitting article:', error);
            toast.error('Erreur lors de la soumission');
            throw error;
        }
    },

    /**
     * Publie un article
     */
    publishArticle: async (id) => {
        try {
            const articleRef = doc(db, 'articles', id);

            await updateDoc(articleRef, {
                status: 'published',
                'workflow.publishedAt': Timestamp.fromDate(new Date()),
                'workflow.reviewedBy': 'admin', // TODO: Get from auth
                'workflow.lastModified': Timestamp.fromDate(new Date()),
            });

            toast.success('Article publié !');

            await get().fetchArticles();
        } catch (error) {
            console.error('❌ Error publishing article:', error);
            toast.error('Erreur lors de la publication');
            throw error;
        }
    },

    /**
     * Archive un article
     */
    archiveArticle: async (id) => {
        try {
            const articleRef = doc(db, 'articles', id);

            await updateDoc(articleRef, {
                status: 'archived',
                'workflow.lastModified': Timestamp.fromDate(new Date()),
            });

            toast.success('Article archivé');

            await get().fetchArticles();
        } catch (error) {
            console.error('❌ Error archiving article:', error);
            toast.error('Erreur lors de l\'archivage');
            throw error;
        }
    },

    /**
     * Incrémente le nombre de vues
     */
    incrementViews: async (id) => {
        try {
            const articleRef = doc(db, 'articles', id);
            const article = get().articles.find(a => a.id === id);

            if (article) {
                await updateDoc(articleRef, {
                    'stats.views': (article.stats.views || 0) + 1,
                });
            }
        } catch (error) {
            console.error('❌ Error incrementing views:', error);
        }
    },

    /**
     * Incrémente le nombre de téléchargements
     */
    incrementDownloads: async (id) => {
        try {
            const articleRef = doc(db, 'articles', id);
            const article = get().articles.find(a => a.id === id);

            if (article) {
                await updateDoc(articleRef, {
                    'stats.downloads': (article.stats.downloads || 0) + 1,
                });

                toast.success('Téléchargement comptabilisé');
            }
        } catch (error) {
            console.error('❌ Error incrementing downloads:', error);
        }
    },
}));
