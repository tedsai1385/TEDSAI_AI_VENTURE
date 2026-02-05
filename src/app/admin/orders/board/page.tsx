'use client';

import { KanbanBoard } from '@/components/admin/orders/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';

export default function OrderPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Commandes & Cuisine</h1>
                    <p className="text-zinc-400">Suivi du flux de préparation en temps réel.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-zinc-300 border-dark-border hover:bg-white/5">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filtres
                    </Button>
                    <Button className="bg-cortex-primary hover:bg-cortex-primary-light text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle Commande
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    );
}
