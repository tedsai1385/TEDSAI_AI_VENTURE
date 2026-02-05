'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-bold text-white">Paramètres</h1>
            <ComingSoon
                title="Configuration Système"
                description="Les paramètres globaux, API keys et configurations de sécurité."
            />
        </div>
    );
}
