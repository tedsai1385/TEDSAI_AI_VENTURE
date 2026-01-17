'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingBag,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const stats = [
        {
            title: 'Revenu Total',
            value: '2.4M FCFA',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Visiteurs Uniques',
            value: '14.2k',
            change: '+8.1%',
            trend: 'up',
            icon: Users,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Commandes',
            value: '342',
            change: '-2.3%',
            trend: 'down',
            icon: ShoppingBag,
            color: 'bg-orange-100 text-orange-600'
        },
        {
            title: 'Réservations',
            value: '18',
            change: '+4.5%',
            trend: 'up',
            icon: Calendar,
            color: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </CardTitle>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <p className={`text-xs flex items-center mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3 mr-1" />
                                    )}
                                    {stat.change}
                                    <span className="text-gray-400 ml-1">vs mois dernier</span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart Area */}
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Aperçu des performances</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm">Graphique d'activité (Placeholder)</p>
                            {/* Note: Integrate Recharts here later */}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { user: 'Jean M.', action: 'a réservé une table pour 4', time: 'Il y a 2 min', type: 'reservation' },
                                { user: 'Sarah K.', action: 'a commandé Panier Bio #1', time: 'Il y a 15 min', type: 'order' },
                                { user: 'Admin', action: 'a mis à jour le Menu', time: 'Il y a 1h', type: 'system' },
                                { user: 'Paul E.', action: 'nouveau message contact', time: 'Il y a 2h', type: 'message' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${item.type === 'reservation' ? 'bg-purple-500' :
                                            item.type === 'order' ? 'bg-green-500' :
                                                item.type === 'system' ? 'bg-blue-500' : 'bg-gray-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            <span className="font-bold">{item.user}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6">Voir tout l'historique</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
