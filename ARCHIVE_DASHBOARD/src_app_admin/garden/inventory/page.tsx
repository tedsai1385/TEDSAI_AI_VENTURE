import { EmptyState } from '@/components/admin/EmptyState';
import { Leaf, Plus, FileSpreadsheet, Sparkles } from 'lucide-react';

export default function GardenInventoryPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <EmptyState
                icon={Leaf}
                title="Inventaire Garden vide"
                description="Commencez à gérer vos stocks de récoltes. Le système vous aidera à optimiser la production et réduire le gaspillage."
                primaryAction={{
                    label: 'Ajouter un produit',
                    onClick: () => {
                        alert('Formulaire ajout produit à implémenter');
                    },
                    icon: Plus,
                }}
                secondaryActions={[
                    {
                        label: 'Importer depuis Excel',
                        onClick: () => {
                            alert('Import Excel à implémenter');
                        },
                        icon: FileSpreadsheet,
                    },
                ]}
                helpLink={{
                    label: 'Guide de gestion des stocks',
                    href: '#',
                }}
            />

            {/* Stats Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <div className="text-dark-text-secondary text-sm mb-1">Taux utilisation</div>
                    <div className="text-2xl font-bold text-white">--</div>
                    <div className="text-xs text-cortex-success mt-1">Objectif : &gt;85%</div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <div className="text-dark-text-secondary text-sm mb-1">Gaspillage</div>
                    <div className="text-2xl font-bold text-white">--</div>
                    <div className="text-xs text-cortex-success mt-1">Objectif : &lt;10%</div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <div className="text-dark-text-secondary text-sm mb-1">Stock total</div>
                    <div className="text-2xl font-bold text-white">-- kg</div>
                    <div className="text-xs text-dark-text-secondary mt-1">Toutes catégories</div>
                </div>
            </div>
        </div>
    );
}
