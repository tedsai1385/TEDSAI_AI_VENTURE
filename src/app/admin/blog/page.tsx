'use client';

import { ComingSoon } from '@/components/admin/ComingSoon';
import { FileText } from 'lucide-react';

export default function BlogPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-bold text-white">Blog & Publications</h1>
            <ComingSoon
                title="Blog & Publications"
                description="L'éditeur d'articles optimisé SEO et le planificateur de contenu seront bientôt disponibles."
            />
        </div>
    );
}
