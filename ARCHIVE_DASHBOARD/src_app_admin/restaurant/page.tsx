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
    UtensilsCrossed,
    Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function RestaurantAdmin() {
    const [dishes] = useState([
        { id: 1, name: 'Ndolé Revisité', price: '8500 FCFA', category: 'Plat', status: 'available', sales: 145 },
        { id: 2, name: 'Poulet DG Royal', price: '9500 FCFA', category: 'Plat', status: 'available', sales: 98 },
        { id: 3, name: 'Jus de Bissap Spicy', price: '2000 FCFA', category: 'Boisson', status: 'available', sales: 320 },
        { id: 4, name: 'Banane Malaxée', price: '4500 FCFA', category: 'Entrée', status: 'out_of_stock', sales: 45 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Restaurant viTEDia</h1>
                    <p className="text-gray-500 text-sm">Gestion du menu, des prix et de la disponibilité.</p>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un Plat
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un plat..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500 mx-0"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-gray-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Catégorie
                        </Button>
                    </div>
                </div>

                {/* Grid View for Dishes */}
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dishes.map((dish, i) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="aspect-video bg-gray-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 opacity-20" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Badge className={dish.status === 'available' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}>
                                        {dish.status === 'available' ? 'Disponible' : 'Épuisé'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{dish.name}</h3>
                                        <p className="text-xs text-gray-500">{dish.category}</p>
                                    </div>
                                    <p className="font-semibold text-amber-600">{dish.price}</p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <UtensilsCrossed className="w-3 h-3" />
                                    {dish.sales} ventes ce mois
                                </div>

                                <div className="flex gap-2 border-t pt-3">
                                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Modifier
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add New Card Placeholder */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors h-full min-h-[280px]"
                    >
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="font-medium">Créer un nouveau plat</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
