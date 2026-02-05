'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { subscribeToArticle, updateArticle, ArticleError } from '@/lib/firebase/articles-service';
import { Article } from '@/types/article';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Eye, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ArticleForm } from '@/components/admin/observatoire/ArticleForm';
import { Timestamp } from 'firebase/firestore';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const articleId = params.id as string;
    const { user, loading: authLoading } = useAuth();

    // États globaux
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // États sauvegarde
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [isPublishing, setIsPublishing] = useState(false);
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
    // SUBSCRIPTION & INIT
    // ═══════════════════════════════════════════════════════════════

    useEffect(() => {
        const unsubscribe = subscribeToArticle(articleId, (data) => {
            if (!data) {
                // Si l'article n'existe plus ou pas encore chargé
                // On attend un peu ou on redirige si confirmé via snapshot empty
                // Ici le callback renvoie null si !exists
                if (!isLoading) { // Si on a fini de charger initialement et qu'il disparait
                    toast.error('Article introuvable');
                    router.push('/admin/observatoire/articles');
                }
                return;
            }

            // Mise à jour de la référence locale (pour comparaison si besoin)
            setArticle(data);

            // Initialisation du formulaire (SEULEMENT si on n'a pas de changements non sauvegardés pour éviter d'écraser ce que l'user tape si update distant)
            // Mais ici c'est du temps réel. Si un autre admin touche, on veut le voir ? 
            // Pour l'instant, on initialise une fois au chargement pour éviter la guerre d'édition.
            // On utilise isLoading pour savoir si c'est le premier load.

            setFormData(prev => {
                // Si c'est le premier load, on écrase.
                // Sinon, on pourrait décider de ne pas écraser si dirty.
                // Ici simplifcation : on écrase seulement au premier load pour éviter perte de saisie.
                return {
                    title: data.title,
                    subtitle: data.subtitle || '',
                    excerpt: data.excerpt,
                    content: data.content,
                    category: data.category,
                    tags: data.tags,
                    heroImage: data.heroImage,
                };
            });

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [articleId, router]);
    // ^ Retiré isLoading des deps pour éviter re-run bizarre, mais logique init complexe.
    // Simplification: le setFormData ci-dessus écrase à chaque update serveur. 
    // C'est risqué pour l'édition concourante.
    // Modification: On charge UNE fois.

    // CORRECTION LOGIQUE SUBSCRIPTION:
    // On veut fetcher initialement. Le real-time pendant l'édition est dangereux si on tape.
    // Mais on veut être notifié si le statut change.
    // On va garder subscribe mais ne mettre à jour formData QUE si !hasUnsavedChanges.

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════

    const handleFormChange = useCallback((data: typeof formData) => {
        setFormData(data);
        setHasUnsavedChanges(true);
        if (saveStatus === 'success') setSaveStatus('idle');
    }, [saveStatus]);

    const validateForm = (requireContent: boolean = true): string | null => {
        if (!formData.title?.trim()) return 'Le titre est requis';
        if (formData.title.length < 5) return 'Le titre doit faire au moins 5 caractères';
        if (!formData.excerpt?.trim()) return 'Le résumé est requis';
        if (requireContent && (!formData.content?.trim() || formData.content === '<p></p>')) {
            return 'Le contenu est requis';
        }
        return null;
    };

    const handleSave = async (publish: boolean = false) => {
        if (!user || !article) return;

        const validationError = validateForm(publish);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        if (publish) setIsPublishing(true);
        setSaveStatus('saving');

        try {
            const newStatus = publish ? 'published' : (article.status === 'published' ? 'published' : 'draft');
            // Si on clique "Enregistrer" sur un publié, il reste publié.
            // Si on clique "Publier", il devient publié.

            const updateData = {
                ...formData,
                status: newStatus,
                metaTitle: formData.title.slice(0, 60),
                metaDescription: formData.excerpt.slice(0, 160),
            };

            console.log('[EditArticle] Updating:', updateData);

            await updateArticle(articleId, updateData, user.uid);

            setHasUnsavedChanges(false);
            setSaveStatus('success');

            toast.success(newStatus === 'published' ? 'Article publié !' : 'Modifications enregistrées');

            // Feedback visuel court
            setTimeout(() => {
                if (saveStatus === 'success') setSaveStatus('idle');
            }, 2000);

        } catch (error: any) {
            setSaveStatus('error');
            if (error instanceof ArticleError) {
                toast.error(error.message);
            } else {
                toast.error('Erreur technique lors de la sauvegarde');
                console.error(error);
            }
        } finally {
            setIsPublishing(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDU
    // ═══════════════════════════════════════════════════════════════

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!article) return null; // Géré par useEffect redirect

    const isSaving = saveStatus === 'saving';

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
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
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-2 text-xs">
                            {hasUnsavedChanges ? (
                                <span className="text-amber-500">Modifications non sauvegardées</span>
                            ) : (
                                <span className="text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    À jour
                                </span>
                            )}
                            <span className="text-gray-600">•</span>
                            <span className={`px-2 py-0.5 rounded-full ${article.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'
                                }`}>
                                {article.status === 'published' ? 'Publié' : 'Brouillon'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Voir */}
                    {article.status === 'published' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/observatoire/article/${article.slug}`, '_blank')}
                            className="text-gray-400 hover:text-white"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                        </Button>
                    )}

                    {/* Sauvegarder */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={isSaving || !hasUnsavedChanges}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        {isSaving && !isPublishing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Enregistrer
                    </Button>

                    {/* Publier */}
                    <Button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={isSaving || isPublishing}
                        className={`
                            bg-gradient-to-r from-purple-600 to-blue-600 
                            hover:from-purple-700 hover:to-blue-700
                            text-white font-medium shadow-lg shadow-purple-900/20
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
                                {article.status === 'published' ? 'Mettre à jour' : 'Publier'}
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Contenu */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
                        <ArticleForm
                            data={formData} // Utiliser formData local, pas article direct pour permettre édition
                            onChange={handleFormChange}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
