'use client';
import React from 'react';

import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminIAPage() {
    return (
        <AdminGuard>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Services IA</h1>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        + Nouveau Service
                    </button>
                </div>
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                    <i className="fa-solid fa-brain text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900">Module IA</h3>
                    <p className="text-gray-500 mt-2">Configuration de Gemini, gestion des prompts et logs.</p>
                </div>
            </div>
        </AdminGuard>
    );
}
