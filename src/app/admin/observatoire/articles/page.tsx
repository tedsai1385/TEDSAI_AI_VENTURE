'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToArticles, deleteArticle, batchUpdateStatus } from '@/lib/firebase/articles-service';
import { Article, ArticleStatus } from '@/types/article';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArticleStatusBadge } from '@/components/admin/observatoire/ArticleStatusBadge';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    CheckCircle,
    Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ArticlesListPage() {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<ArticleStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Subscription temps réel
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = subscribeToArticles((data) => {
            setArticles(data);
            setIsLoading(false);
        }, filterStatus === 'all' ? undefined : { status: filterStatus });

        return () => unsubscribe();
    }, [filterStatus]);

    // Filtrage local recherche
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Archiver cet article ? Il sera retiré du site public.')) return;

        try {
            await deleteArticle(id);
            toast.success('Article archivé');
        } catch (error) {
            toast.error("Erreur lors de l'archivage");
        }
    };

    const stats = {
        all: articles.length,
        draft: articles.filter(a => a.status === 'draft').length,
        published: articles.filter(a => a.status === 'published').length,
        archived: articles.filter(a => a.status === 'archived').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Articles Observatoire</h1>
                    <p className="text-gray-300 mt-1">
                        {stats.all} articles • {stats.published} publiés
                    </p>
                </div>

                <Button
                    onClick={() => router.push('/admin/observatoire/articles/new')}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel article
                </Button>
            </div>

            {/* Filtres & Recherche */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={filterStatus === 'all' ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus('all')}
                        size="sm"
                        className={filterStatus === 'all' ? 'bg-purple-600' : 'text-gray-300'}
                    >
                        Tous ({stats.all})
                    </Button>
                    <Button
                        variant={filterStatus === 'draft' ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus('draft')}
                        size="sm"
                        className={filterStatus === 'draft' ? 'bg-purple-600' : 'text-gray-300'}
                    >
                        Brouillons ({stats.draft})
                    </Button>
                    <Button
                        variant={filterStatus === 'published' ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus('published')}
                        size="sm"
                        className={filterStatus === 'published' ? 'bg-purple-600' : 'text-gray-300'}
                    >
                        Publiés ({stats.published})
                    </Button>
                    <Button
                        variant={filterStatus === 'archived' ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus('archived')}
                        size="sm"
                        className={filterStatus === 'archived' ? 'bg-purple-600' : 'text-gray-300'}
                    >
                        Archivés ({stats.archived})
                    </Button>
                </div>

                <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Articles List */}
            {!isLoading && (
                <div className="space-y-4">
                    {filteredArticles.length === 0 ? (
                        <Card className="bg-gray-800/60 border border-gray-700/50 text-center py-12">
                            <p className="text-gray-300 font-medium mb-4">Aucun article pour le moment</p>
                            <Button
                                onClick={() => router.push('/admin/observatoire/articles/new')}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Créer votre premier article
                            </Button>
                        </Card>
                    ) : (
                        filteredArticles.map((article) => (
                            <Card key={article.id} className="bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80 transition-all p-4">
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-24 h-24 bg-gray-700/50 rounded-lg overflow-hidden shrink-0">
                                        {article.heroImage?.url ? (
                                            <img
                                                src={article.heroImage.url}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <ArticleStatusBadge status={article.status} />
                                                    <Badge variant="outline" className="text-white border-gray-600">
                                                        {article.category.replace(/-/g, ' ')}
                                                    </Badge>
                                                    <span className="text-gray-500 text-xs">
                                                        {article.stats.views} vues
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                                                    {article.title || '(Sans titre)'}
                                                </h3>
                                                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                                                    {article.excerpt || 'Pas de résumé'}
                                                </p>

                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span>
                                                        {formatDistanceToNow(article.updatedAt.toDate(), {
                                                            addSuffix: true,
                                                            locale: fr
                                                        })}
                                                    </span>
                                                    {article.tags.length > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            {article.tags.slice(0, 3).map(tag => (
                                                                <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                {article.status === 'published' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => window.open(`/observatoire/article/${article.slug}`, '_blank')}
                                                        className="text-gray-300 hover:text-white"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/observatoire/articles/${article.id}/edit`)}
                                                    className="text-gray-300 hover:text-white"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-300"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
