'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IAServicesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services IA</h1>
                    <p className="text-gray-500">Configuration des agents et modèles</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nouvel Agent
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Assistant Chatbot</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Actif</div>
                        <p className="text-xs text-gray-500 mt-1">Modèle: Gemini Pro</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
