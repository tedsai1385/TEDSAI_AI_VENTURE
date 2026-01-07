'use client';

import React from 'react';

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gestion Utilisateurs</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    + Ajouter Utilisateur
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4 text-left">Utilisateur</th>
                            <th className="px-6 py-4 text-left">Rôle</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">A</div>
                                    <div>
                                        <div className="font-medium text-gray-900">Admin User</div>
                                        <div className="text-xs text-gray-500">admin@tedsai.com</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Admin</span></td>
                            <td className="px-6 py-4"><span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>Actif</td>
                            <td className="px-6 py-4 text-right text-gray-400">
                                <button className="hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="p-8 text-center text-gray-500">
                    <p>Liste complète des utilisateurs via Firestore à venir.</p>
                </div>
            </div>
        </div>
    );
}
