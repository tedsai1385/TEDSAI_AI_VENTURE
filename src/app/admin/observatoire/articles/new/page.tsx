'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, ArticleError } from '@/lib/firebase/articles-service';
import { Article, createArticleDTO } from '@/types/article';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { ArticleForm } from '@/components/admin/observatoire/ArticleForm';
import { Timestamp } from 'firebase/firestore';

// ═════════════════════════════════════════════════════════════════
// TYPES ÉTAT
// ═════════════════════════════════════════════════════════════════

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

// ═════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═════════════════════════════════════════════════════════════════

export default function NewArticlePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    // États
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSavedId, setLastSavedId] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Données formulaire
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        excerpt: '',
        content: '',
        category: 'agriculture-urbaine' as Article['category'],
        tags: [] as string[],
        heroImage: { url: '', alt: '' },
    });

    // ═══════════════════════════════════════════════════════════════
    // EFFETS
    // ═══════════════════════════════════════════════════════════════

    // Vérification authentification
    useEffect(() => {
        if (!authLoading && !user) {
            toast.error('Veuillez vous connecter');
            router.push('/login?redirect=/admin/observatoire/articles/new');
        }
    }, [user, authLoading, router]);

    // Warning fermeture onglet
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && saveStatus !== 'success') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, saveStatus]);

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const handleFormChange = useCallback((data: typeof formData) => {
        setFormData(data);
        setHasUnsavedChanges(true);
        if (saveStatus === 'success') setSaveStatus('idle');
    }, [saveStatus]);

    // Validation complète du formulaire
    const validateForm = (requireContent: boolean = true): string | null => {
        if (!formData.title?.trim()) return 'Le titre est requis';
        if (formData.title.length < 5) return 'Le titre doit faire au moins 5 caractères';
        if (!formData.excerpt?.trim()) return 'Le résumé est requis';
        if (formData.excerpt.length < 20) return 'Le résumé doit faire au moins 20 caractères';
        if (requireContent && (!formData.content?.trim() || formData.content === '<p></p>')) {
            return 'Le contenu est requis';
        }
        if (!formData.heroImage.url && requireContent) {
            return 'Une image principale est requise pour la publication';
        }
        return null;
    };

    // Sauvegarde principale (Brouillon ou Publier)
    const handleSave = async (publish: boolean = false) => {
        // 1. Vérifications préliminaires
        if (!user) {
            toast.error('Session expirée, veuillez vous reconnecter');
            return;
        }

        const validationError = validateForm(publish); // Content requis seulement pour publish
        if (validationError) {
            toast.error(validationError);
            return;
        }

        // 2. Préparation état
        if (publish) setIsPublishing(true);
        setSaveStatus('saving');

        try {
            const status = publish ? 'published' : 'draft';

            const articleData = createArticleDTO({
                ...formData,
                status,
                authorId: user.uid,
                authorName: user.displayName || user.email?.split('@')[0] || 'Anonyme',
                authorAvatar: user.photoURL || undefined,
                publishedAt: publish ? Timestamp.now() : null,
                metaTitle: formData.title.slice(0, 60),
                metaDescription: formData.excerpt.slice(0, 160),
            });

            console.log('[NewArticle] Creating with data:', { status, title: articleData.title });

            // 3. Appel service
            const { id, slug } = await createArticle(articleData);

            // 4. Succès
            setLastSavedId(id);
            setHasUnsavedChanges(false);
            setSaveStatus('success');

            toast.success(
                publish
                    ? `Article publié ! ID: ${id.slice(0, 8)}...`
                    : 'Brouillon sauvegardé',
                { duration: 4000 }
            );

            // 5. Redirection avec délai pour voir le toast
            setTimeout(() => {
                if (publish) {
                    // Aperçu direct si publié
                    router.push(`/observatoire/article/${slug}?preview=admin`);
                } else {
                    router.push('/admin/observatoire/articles');
                }
            }, publish ? 2000 : 1000);

        } catch (error: any) {
            setSaveStatus('error');

            if (error instanceof ArticleError) {
                toast.error(error.message);
            } else {
                toast.error('Erreur technique. Vérifiez votre connexion et réessayez.');
                console.error('[NewArticle] Unexpected error:', error);
            }

        } finally {
            setIsPublishing(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDU
    // ═══════════════════════════════════════════════════════════════

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const isSaving = saveStatus === 'saving';
    const showSuccess = saveStatus === 'success';

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">

            {/* ═══════════════════════════════════════════════════════════ HEADER */}
            <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">

                {/* Gauche: Navigation + Titre */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (hasUnsavedChanges && !confirm('Quitter sans sauvegarder ?')) return;
                            router.back();
                        }}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <div>
                        <h1 className="text-lg font-semibold text-white line-clamp-1 max-w-md">
                            {formData.title || 'Nouvel article'}
                        </h1>
                        <div className="flex items-center gap-2 text-xs">
                            {showSuccess ? (
                                <span className="text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Sauvegardé avec succès
                                </span>
                            ) : hasUnsavedChanges ? (
                                <span className="text-amber-500">Modifications non sauvegardées</span>
                            ) : (
                                <span className="text-gray-500">Prêt à éditer</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Droite: Actions */}
                <div className="flex items-center gap-3">

                    {/* Bouton Brouillon */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={isSaving || showSuccess}
                        className={`
              border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              ${showSuccess ? 'opacity-50' : ''}
            `}
                    >
                        {isSaving && !isPublishing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {showSuccess ? 'Enregistré' : 'Brouillon'}
                    </Button>

                    {/* Bouton Publier */}
                    <Button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={isSaving || isPublishing}
                        className={`
              bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700
              text-white font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-purple-900/20
            `}
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Publication...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Publier
                            </>
                        )}
                    </Button>

                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════ CONTENU */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-6">

                    {/* Alert succès */}
                    {showSuccess && lastSavedId && (
                        <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="text-green-200 font-medium">
                                    Article créé avec succès !
                                </p>
                                <p className="text-green-400/70 text-sm">
                                    ID: {lastSavedId} • Redirection en cours...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Formulaire */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
                        <ArticleForm
                            data={formData}
                            onChange={handleFormChange}
                            disabled={isSaving || showSuccess}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
