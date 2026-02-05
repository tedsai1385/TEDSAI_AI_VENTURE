'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulation sauvegarde
        setTimeout(() => {
            setLoading(false);
            alert("Produit créé avec succès ! (Simulation)");
            // TODO Phase 3: Intégration API réelle
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/shop">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-heading text-gray-900">Nouveau Produit</h1>
                    <p className="text-gray-500">Ajouter un produit au catalogue boutique</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* Informations de base */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Package className="w-5 h-5 text-gray-500" />
                        Informations Générales
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nom du produit</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Miel d'Oku Premium" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Catégorie</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                                <option>Épicerie Fine</option>
                                <option>Cosmétique Bio</option>
                                <option>Produits Frais</option>
                                <option>Boissons</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="Description détaillée du produit..." required></textarea>
                    </div>
                </div>

                <div className="border-t pt-6 grid grid-cols-2 gap-8">
                    {/* Prix et Stock */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Prix & Stock</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Prix (FCFA)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5000" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Stock initial</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100" />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Média</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Glisser-déposer une image ou cliquer pour parcourir</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                    <Link href="/admin/shop">
                        <Button variant="ghost" type="button">Annuler</Button>
                    </Link>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Créer le Produit
                    </Button>
                </div>
            </form>
        </div>
    );
}
