import { OrderKanbanBoard } from '@/components/admin/orders/OrderKanbanBoard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';

export default function RestaurantOrdersPage() {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-white">
                        Gestion des Commandes
                    </h1>
                    <p className="text-dark-text-secondary text-sm">
                        Drag & drop pour changer le statut des commandes
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-dark-border hover:bg-dark-surface-elevated">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres
                    </Button>
                    <Button variant="outline" size="sm" className="border-dark-border hover:bg-dark-surface-elevated">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button size="sm" className="bg-cortex-primary hover:bg-cortex-primary-dark">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle commande
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <p className="text-dark-text-secondary text-sm">Total aujourd'hui</p>
                    <p className="text-2xl font-bold text-white">22 000 FCFA</p>
                    <p className="text-xs text-cortex-success mt-1">+15% vs hier</p>
                </div>
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <p className="text-dark-text-secondary text-sm">Commandes en cours</p>
                    <p className="text-2xl font-bold text-white">2</p>
                    <p className="text-xs text-dark-text-secondary mt-1">À traiter</p>
                </div>
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <p className="text-dark-text-secondary text-sm">Temps moyen</p>
                    <p className="text-2xl font-bold text-white">18 min</p>
                    <p className="text-xs text-dark-text-secondary mt-1">Préparation</p>
                </div>
                <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
                    <p className="text-dark-text-secondary text-sm">Livrées aujourd'hui</p>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-xs text-dark-text-secondary mt-1">0 en retard</p>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
                <OrderKanbanBoard />
            </div>

            {/* Legend */}
            <div className="mt-4 p-3 bg-cortex-primary/5 border border-cortex-primary/20 rounded-lg">
                <p className="text-xs text-cortex-primary flex items-center gap-2">
                    <span>💡</span>
                    <span>
                        Glissez-déposez les commandes entre les colonnes pour mettre à jour leur statut.
                        Les notifications WhatsApp seront envoyées automatiquement (Phase 2.3).
                    </span>
                </p>
            </div>
        </div>
    );
}
