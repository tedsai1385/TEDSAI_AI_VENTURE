'use client';

import { HarvestManager } from '@/components/admin/garden/HarvestManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sprout } from 'lucide-react';
import Link from 'next/link';

export default function HarvestsAdminPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/garden">
                            <Button variant="ghost" size="sm" className="p-0 h-auto text-zinc-500 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Retour Dashboard
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                        <Sprout className="w-8 h-8 text-cortex-primary" />
                        Gestion du Catalogue
                    </h1>
                    <p className="text-zinc-400">Ajoutez, modifiez ou supprimez les produits du SelecTED Garden.</p>
                </div>
            </div>

            {/* Main Manager */}
            <HarvestManager />
        </div>
    );
}
