'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Restaurant</h1>
                    <p className="text-gray-500">Gérez les plats et les cartes</p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Plat
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardHeader>
                        <CardTitle>Ndolé Royal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">Plat signature avec crevettes et viande de boeuf.</p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">4 500 FCFA</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
