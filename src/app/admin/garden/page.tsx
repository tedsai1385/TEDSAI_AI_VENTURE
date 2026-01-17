'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Sprout,
    AlertTriangle,
    RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GardenAdmin() {
    const [products] = useState([
        { id: 1, name: 'Tomates Grappe', stock: '245 kg', status: 'in_stock', harvest: 'Demain', category: 'Légumes' },
        { id: 2, name: 'Piment Jaune', stock: '12 kg', status: 'low_stock', harvest: 'Aujourd\'hui', category: 'Épices' },
        { id: 3, name: 'Menthe Fraîche', stock: '50 bouquets', status: 'in_stock', harvest: 'Permanent', category: 'Herbes' },
        { id: 4, name: 'Aubergines', stock: '0 kg', status: 'out_of_stock', harvest: 'Dans 3 jours', category: 'Légumes' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jardin & Élevage</h1>
                    <p className="text-gray-500 text-sm">Suivi des récoltes, stock et production.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Historique Récoltes
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle Production
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 mx-0"
                        />
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-normal">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Produit</th>
                                <th className="px-6 py-4 font-semibold">Catégorie</th>
                                <th className="px-6 py-4 font-semibold">Stock Actuel</th>
                                <th className="px-6 py-4 font-semibold">Prochaine Récolte</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product, i) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                                <Sprout className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-gray-600 bg-gray-50">{product.category}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{product.stock}</span>
                                            {product.status === 'low_stock' && (
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            )}
                                            {product.status === 'out_of_stock' && (
                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Rupture</Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.harvest}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
