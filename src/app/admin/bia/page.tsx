'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Cpu,
    MessageSquare,
    Clock,
    Bot,
    Zap,
    BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function IAServicesAdmin() {
    const [logs] = useState([
        { id: 1, user: 'Client A', service: 'Chatbot', tokens: 1250, cost: '0.04€', status: 'success', time: '1 min' },
        { id: 2, user: 'Interne', service: 'Analayse Garden', tokens: 4500, cost: '0.12€', status: 'success', time: '5 min' },
        { id: 3, user: 'Client B', service: 'Image Gen', tokens: 0, cost: '0.00€', status: 'error', time: '12 min' },
        { id: 4, user: 'Client A', service: 'Chatbot', tokens: 340, cost: '0.01€', status: 'success', time: '15 min' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services IA</h1>
                    <p className="text-gray-500 text-sm">Monitoring des modèles Gemini et consommation API.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Rapport Détaillé
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Zap className="w-4 h-4 mr-2" />
                        Conf. Modèles
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-700 flex items-center gap-2">
                            <Bot className="w-4 h-4" /> Activité Bot
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">1,245</div>
                        <p className="text-xs text-indigo-600">Requêtes ce mois (+12%)</p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Latence Moyenne
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">342ms</div>
                        <p className="text-xs text-blue-600">-50ms vs mois dernier</p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Uptime API
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">99.9%</div>
                        <p className="text-xs text-green-600">Stable</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Logs Récents</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-normal">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Service</th>
                                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                                <th className="px-6 py-4 font-semibold">Tokens</th>
                                <th className="px-6 py-4 font-semibold">Coût</th>
                                <th className="px-6 py-4 font-semibold">Statut</th>
                                <th className="px-6 py-4 font-semibold text-right">Temps</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log, i) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {log.service}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {log.tokens > 0 ? log.tokens : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                        {log.cost}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={log.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                                            {log.status === 'success' ? 'Succès' : 'Erreur'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-400">
                                        <div className="flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" />
                                            {log.time}
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
