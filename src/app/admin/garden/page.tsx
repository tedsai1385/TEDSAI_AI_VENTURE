'use client';

import { ParcelGrid } from '@/components/admin/garden/ParcelGrid';
import { HarvestModal } from '@/components/admin/garden/HarvestModal';
import { useInventoryStore } from '@/lib/store/inventory-store';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Sprout } from 'lucide-react';
import { useState, useEffect } from 'react';
import { seedProducts } from '@/lib/firebase/seed';

export default function GardenPage() {
    const items = useInventoryStore((state) => state.items);
    const totalHarvest = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <HarvestModal
                isOpen={isHarvestModalOpen}
                onClose={() => setIsHarvestModalOpen(false)}
                parcelId="P-01"
                parcelName="Serre Alpha"
            />

            {/* Header / KPI */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Garden Live</h1>
                    <p className="text-zinc-400">Monitoring temps réel des serres & récoltes.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-dark-surface border border-dark-border px-4 py-2 rounded-lg text-right">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Récolte du jour</div>
                        <div className="text-xl font-bold text-cortex-success">{totalHarvest} kg</div>
                    </div>
                    <Button
                        onClick={() => setIsHarvestModalOpen(true)}
                        className="bg-cortex-primary hover:bg-cortex-primary-light h-full"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nouvelle Récolte
                    </Button>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-cortex-primary" />
                        Parcelles Actives
                    </h2>
                    <Button variant="ghost" className="text-cortex-secondary text-sm">
                        Voir journal complet <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
                <ParcelGrid />
            </div>

            {/* Quick Actions / Recent Logs */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Dernières Récoltes</h3>
                    <div className="space-y-3">
                        {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                <div>
                                    <div className="font-medium text-white">{item.name} <span className="text-zinc-500 text-xs">({item.variety})</span></div>
                                    <div className="text-xs text-zinc-500">Parcelle {item.parcelId} • Qualité {item.quality}</div>
                                </div>
                                <div className="text-cortex-success font-mono font-bold">+{item.quantity}kg</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-dark-surface border border-dark-border rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sprout className="w-32 h-32 text-cortex-primary" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Copilot Insights</h3>
                    <p className="text-zinc-400 text-sm mb-4">Analyse basée sur les 7 derniers jours.</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-lg">💡</span>
                            <p className="text-sm text-zinc-300">
                                Le <strong className="text-white">Basilic</strong> est en surproduction (+15%). Pensez à lancer une promo "Pesto" au restaurant.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-cortex-primary/30 text-cortex-primary hover:bg-cortex-primary/10">
                        Générer Prédictions
                    </Button>
                </div>
            </div>
        </div>
    );
}
