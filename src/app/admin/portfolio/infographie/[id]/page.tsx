'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PortfolioForm } from '@/components/admin/portfolio/PortfolioForm';

export default function PortfolioEditPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="container mx-auto py-6">
            <PortfolioForm id={id} />
        </div>
    );
}
