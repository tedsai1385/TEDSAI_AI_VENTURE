import { EmptyState } from '@/components/admin/EmptyState';
import { FileText, Sparkles, FileDown, BookOpen } from 'lucide-react';

export default function BlogArticlesPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <EmptyState
                icon={FileText}
                title="Votre Observatoire est prêt à accueillir vos premiers articles"
                description="Partagez votre expertise en agriculture intelligente et positionnez TEDSAI comme référence du secteur."
                primaryAction={{
                    label: 'Rédiger un article',
                    onClick: () => {
                        window.location.href = '/admin/blog/articles/new';
                    },
                    icon: FileText,
                }}
                secondaryActions={[
                    {
                        label: 'Générer 3 idées d\'articles avec l\'IA',
                        onClick: () => {
                            alert('Génération IA d\'idées à implémenter en Phase 2');
                        },
                        icon: Sparkles,
                    },
                    {
                        label: 'Importer depuis Google Docs',
                        onClick: () => {
                            alert('Import Google Docs à implémenter');
                        },
                        icon: FileDown,
                    },
                ]}
                helpLink={{
                    label: 'Voir les meilleures pratiques SEO',
                    href: '#',
                }}
            />

            {/* Tip */}
            <div className="mt-8 p-4 bg-cortex-primary/10 border border-cortex-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cortex-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-cortex-primary" />
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">
                            💡 Astuce SEO
                        </p>
                        <p className="text-dark-text-secondary text-sm mt-1">
                            Publiez 1 article/semaine pour booster votre référencement de 40% en 6 mois
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
