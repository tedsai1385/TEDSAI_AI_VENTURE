'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { Users } from 'lucide-react';

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-bold text-white">Utilisateurs</h1>
            <ComingSoon
                title="Gestion des Équipes & Clients"
                description="Le CRM intégré et la gestion des rôles (RBAC) arrivent dans la prochaine mise à jour."
            />
        </div>
    );
}
