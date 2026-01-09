'use client';

import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';

// Stats Card Component
const StatCard = ({ label, value, sub, color = "text-slate-900" }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-400 mt-2">{sub}</div>
    </div>
);

export default function AdminDashboardPage() {
    return (
        <AdminGuard>
            <div className="space-y-8">
                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Utilisateurs Total"
                        value="1,240"
                        sub="+12% ce mois"
                    />
                    <StatCard
                        label="Admins Actifs"
                        value="4"
                        sub="Super Admin: 1"
                    />
                    <StatCard
                        label="Contenus Publiés"
                        value="85"
                        sub="Dernière MAJ: 2h"
                    />
                    <StatCard
                        label="État Système"
                        value="Opérationnel"
                        color="text-green-500"
                        sub="Tout fonctionne"
                    />
                </div>

                {/* ACTIVITY AND ALERTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* RECENT ACTIVITY */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Activité Récente</h3>
                            <button className="text-blue-600 text-sm hover:underline">Tout voir</button>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3 text-left">Utilisateur</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">Admin User</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">Mise à jour du menu</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Il y a 2h</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ALERTS */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">⚠️ Alertes Système</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                                <div>
                                    <div className="font-semibold">Stock faible</div>
                                    <div className="text-yellow-700 text-xs">Poivre de Penja (Reste: 2kg)</div>
                                </div>
                            </div>
                            <div className="text-center text-sm text-gray-400 py-4">
                                Aucune autre alerte
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
