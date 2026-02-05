import { EmptyState } from '@/components/admin/EmptyState';
import { Package, FileSpreadsheet, Sparkles, BookOpen } from 'lucide-react';

export default function ShopProductsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <EmptyState
                icon={Package}
                title="Votre boutique n'a pas encore de produits"
                description="Ajoutez vos premières récoltes pour commencer à vendre en ligne. Transformez votre garden en source de revenus."
                primaryAction={{
                    label: 'Créer un produit manuellement',
                    onClick: () => {
                        // Navigation vers formulaire création
                        window.location.href = '/admin/shop/products/new';
                    },
                    icon: Package,
                }}
                secondaryActions={[
                    {
                        label: 'Importer un catalogue CSV',
                        onClick: () => {
                            alert('Fonctionnalité d\'import CSV à implémenter');
                        },
                        icon: FileSpreadsheet,
                    },
                    {
                        label: 'Générer 5 produits pilotes avec l\'IA',
                        onClick: () => {
                            alert('Génération IA à implémenter en Phase 2');
                        },
                        icon: Sparkles,
                    },
                ]}
                helpLink={{
                    label: 'Voir le tutoriel (2min)',
                    href: '#',
                }}
            />
        </div>
    );
}
