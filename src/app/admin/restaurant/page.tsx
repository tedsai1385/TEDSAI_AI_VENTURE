'use client';

import { UtensilsCrossed, LayoutGrid } from 'lucide-react';
import { GalleryManager } from '@/components/admin/restaurant/GalleryManager';

export default function RestaurantPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <UtensilsCrossed />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Gestion Restaurant</h1>
                        <p className="text-zinc-500">Contrôlez l'image et l'ambiance de viTEDia</p>
                    </div>
                </div>
            </div>

            <section className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6 text-neutral-300">
                    <LayoutGrid size={20} className="text-[var(--color-primary)]" />
                    <h2 className="text-xl font-bold">Galerie & Visuels</h2>
                </div>
                <GalleryManager />
            </section>
        </div>
    );
}
