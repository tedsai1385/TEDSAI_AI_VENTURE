'use client';

import { ArticleStatus, getStatusConfig } from '@/types/article';
import { Clock, CheckCircle, Archive } from 'lucide-react';

interface ArticleStatusBadgeProps {
    status: ArticleStatus;
    className?: string;
}

export function ArticleStatusBadge({ status, className = '' }: ArticleStatusBadgeProps) {
    const config = getStatusConfig(status);

    const icons = {
        Clock,
        CheckCircle,
        Archive,
    };

    const Icon = icons[config.icon as keyof typeof icons];

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </div>
    );
}
