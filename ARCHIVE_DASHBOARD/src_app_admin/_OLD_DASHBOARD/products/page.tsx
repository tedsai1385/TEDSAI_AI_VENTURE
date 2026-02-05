'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                    <p className="text-gray-500">Gérez le catalogue des produits</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Produit
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Inventaire Global</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                className="pl-9 h-9 w-[200px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors"
                                placeholder="Rechercher..."
                            />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucun produit pour le moment. Commencez par en ajouter un.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
