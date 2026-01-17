'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Layout, Image as ImageIcon } from 'lucide-react';

export default function AdminHomepage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Page d'Accueil</h1>
                    <p className="text-gray-500">Personnalisez le contenu de la page d'accueil (Hero, Affiches, Textes).</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Publier les changements
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layout className="w-5 h-5 text-gray-500" />
                            Hero Section
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
                            <input
                                type="text"
                                defaultValue="TEDSAI Complex - De la Data à l'Assiette"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre / Slogan</label>
                            <textarea
                                rows={3}
                                defaultValue="Un écosystème intelligent unifiant Intelligence Artificielle, Gastronomie Durable et Agriculture Urbaine."
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image de fond</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-colors">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm">Glisser une image ou cliquer pour modifier</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Annonces & Bannières</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100 flex items-start gap-3">
                            <input type="checkbox" defaultChecked className="mt-1" />
                            <div>
                                <p className="font-medium">Activer le bandeau promotionnel</p>
                                <input
                                    type="text"
                                    defaultValue="🎉 -20% sur les paniers bio jusqu'à vendredi !"
                                    className="mt-2 w-full bg-white px-3 py-1.5 rounded border border-yellow-200 text-sm"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
