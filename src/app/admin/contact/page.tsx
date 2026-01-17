'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messages & Contact</h1>
                    <p className="text-gray-500">Boîte de réception des messages du formulaire de contact.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Messages récents
                    </h3>
                    <div className="text-sm text-gray-500">3 nouveaux messages</div>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-medium text-gray-900">John Doe</div>
                                <span className="text-xs text-gray-500">Il y a 2h</span>
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Demande de partenariat</div>
                            <p className="text-sm text-gray-500 line-clamp-1">Bonjour, je souhaiterais discuter d'une opportunité de collaboration avec TEDSAI...</p>

                            <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm">
                                    <MessageSquare className="w-3 h-3 mr-2" />
                                    Répondre
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                    <Archive className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
