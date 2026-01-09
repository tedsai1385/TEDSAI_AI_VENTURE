'use client';
import React from 'react';

import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminGardenPage() {
    return (
        <AdminGuard>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">SelecTED Gardens</h1>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        + Nouvelle Récolte
                    </button>
                </div>
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                    <i className="fa-solid fa-leaf text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900">Module Agriculture</h3>
                    <p className="text-gray-500 mt-2">Suivi des cultures, gestion des intrants et stock.</p>
                </div>
            </div>
        </AdminGuard>
    );
}
