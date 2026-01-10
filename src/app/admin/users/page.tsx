'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!userId) return;
        try {
            await updateDoc(doc(db, 'users', userId), {
                role: newRole,
                updatedAt: new Date().toISOString()
            });
            alert('Rôle mis à jour avec succès !');
        } catch (error) {
            console.error("Erreur lors de la mise à jour du rôle:", error);
            alert("Erreur lors de la mise à jour.");
        }
    };

    return (
        <AdminGuard>
            <div className="space-y-6 fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
                        <p className="text-gray-500">Gérez les rôles et permissions des utilisateurs.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded shadow text-sm font-medium">
                        <i className="fa-solid fa-users text-blue-500 mr-2"></i>
                        Total: {users.length}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 border-b">Utilisateur</th>
                                    <th className="p-4 border-b">Email</th>
                                    <th className="p-4 border-b">Rôle Actuel</th>
                                    <th className="p-4 border-b">Date d'inscription</th>
                                    <th className="p-4 border-b text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">Chargement...</td>
                                    </tr>
                                ) : users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {u.displayName?.charAt(0) || 'U'}
                                                </div>
                                                {u.displayName || 'Sans Nom'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                                                    u.role?.includes('admin') ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {u.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <select
                                                className="border rounded px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={u.role || 'user'}
                                                onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                disabled={u.id === currentUser?.uid} // Prevent changing own role to lock out
                                            >
                                                <option value="user">Utilisateur</option>
                                                <option value="admin_resto">Admin Restaurant</option>
                                                <option value="admin_garden">Admin Garden</option>
                                                <option value="admin_ia">Admin IA</option>
                                                <option value="super_admin">Super Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
