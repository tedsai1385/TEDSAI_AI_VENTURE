'use client';

import React from 'react';
import { ProductForm } from '@/components/admin/shop/ProductForm';
import { useParams } from 'next/navigation';

export default function ProductEditPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="p-6">
            <ProductForm productId={id} />
        </div>
    );
}
