'use client';

import { Sprout, ShoppingBag, UtensilsCrossed, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useInventoryStore } from '@/lib/store/inventory-store';
import { useOrderStore } from '@/lib/store/order-store';

export default function AdminDashboard() {
    const { items: inventoryItems } = useInventoryStore();
    const { orders } = useOrderStore();

    const lowStockItems = inventoryItems.filter(item => item.quantity < 5);
    const activeOrders = orders.filter(o => o.status !== 'delivered');
    const totalHarvest = inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">TEDSAI Cortex</h1>
                    <p className="text-zinc-400">Vue d'ensemble opérationnelle.</p>
                </div>
                <div className="text-sm text-cortex-primary bg-cortex-primary/10 px-3 py-1 rounded-full border border-cortex-primary/20">
                    Système Opérationnel • v2.0
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* GARDEN - Emerald/Jungle Green */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#006400]/30 via-neutral-900 to-neutral-900 border-[#006400]/50 hover:border-[#006400] transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sprout className="w-24 h-24 text-[#006400]" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-[#006400] uppercase tracking-wider">Garden</CardTitle>
                        <div className="p-2 bg-[#006400]/20 rounded-lg">
                            <Sprout className="h-5 w-5 text-[#006400]" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-white mb-1">{inventoryItems.length} Lots</div>
                        <p className="text-xs text-neutral-400">{totalHarvest} kg total en stock</p>
                        <Link href="/admin/garden">
                            <Button variant="ghost" size="sm" className="px-0 text-[#006400] hover:text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                Voir le jardin <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* CUISINE (viTEDia) - Gold/Bordeaux */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#D4A017]/30 via-neutral-900 to-neutral-900 border-[#D4A017]/50 hover:border-[#D4A017] transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UtensilsCrossed className="w-24 h-24 text-[#D4A017]" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-[#D4A017] uppercase tracking-wider">viTEDia</CardTitle>
                        <div className="p-2 bg-[#D4A017]/20 rounded-lg">
                            <UtensilsCrossed className="h-5 w-5 text-[#D4A017]" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-white mb-1">{activeOrders.length} Actives</div>
                        <p className="text-xs text-neutral-400">{orders.filter(o => o.status === 'preparing').length} en préparation</p>
                        <div className="flex gap-4 mt-4">
                            <Link href="/admin/orders/board">
                                <Button variant="ghost" size="sm" className="px-0 text-[#D4A017] hover:text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                    Commandes <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                            <Link href="/admin/restaurant">
                                <Button variant="ghost" size="sm" className="px-0 text-[#D4A017]/80 hover:text-white flex items-center gap-2">
                                    Galerie <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* SHOP/TEDSAI - Night Blue */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-[#0A2540]/50 via-neutral-900 to-neutral-900 border-[#0A2540]/60 hover:border-[#3498DB] transition-all group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag className="w-24 h-24 text-[#3498DB]" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-[#3498DB] uppercase tracking-wider">Boutique</CardTitle>
                        <div className="p-2 bg-[#3498DB]/20 rounded-lg">
                            <ShoppingBag className="h-5 w-5 text-[#3498DB]" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-white mb-1">1 Promo</div>
                        <p className="text-xs text-neutral-400">Générée par IA (Tomates)</p>
                        <Link href="/admin/shop">
                            <Button variant="ghost" size="sm" className="px-0 text-[#3498DB] hover:text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                Voir la boutique <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cortex-secondary" />
                        Performance du Jour
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-neutral-300 text-sm">Chiffre d'affaires</span>
                            <span className="text-white font-mono font-bold">45,200 CFA</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-neutral-300 text-sm">Taux de perte</span>
                            <span className="text-cortex-success font-mono font-bold">0.5%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Alertes Système
                    </h3>
                    <div className="space-y-3">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.map(item => (
                                <div key={item.id} className="flex gap-3 items-start text-sm p-3 border border-red-500/20 bg-red-500/5 rounded-lg">
                                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                                    <div>
                                        <strong className="text-red-400 block">Stock Faible : {item.name}</strong>
                                        <span className="text-neutral-400">Il reste seulement {item.quantity}kg de {item.variety}.</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex gap-3 items-center text-sm p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-neutral-400">Tous les stocks sont optimaux.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
