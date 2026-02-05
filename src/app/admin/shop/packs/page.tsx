'use client';

import { PacksManager } from '@/components/admin/shop/PacksManager';

export default function PacksAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">Packs Boutique</h1>
                    <p className="text-neutral-500">Gérez vos offres combinées et paniers.</p>
                </div>
            </div>

            <PacksManager />
        </div>
    );
}
