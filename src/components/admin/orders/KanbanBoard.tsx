'use client';

import { Order, OrderStatus, useOrderStore } from '@/lib/store/order-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Truck, Package, ChefHat, ArrowRight, Printer, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const COLUMNS: { id: OrderStatus; label: string; icon: any; color: string; border: string; bg: string }[] = [
    {
        id: 'new',
        label: 'Nouvelles',
        icon: Package,
        color: 'text-white',
        border: 'border-white/50',
        bg: 'from-zinc-800/50 to-transparent'
    },
    {
        id: 'preparing',
        label: 'Cuisine',
        icon: ChefHat,
        color: 'text-[#D4A574]', // Gold
        border: 'border-[#D4A574]',
        bg: 'from-[#D4A574]/20 to-transparent'
    },
    {
        id: 'ready',
        label: 'Prêtes',
        icon: CheckCircle2,
        color: 'text-rose-500', // Bordeaux/Redish
        border: 'border-rose-700',
        bg: 'from-rose-900/30 to-transparent'
    },
    {
        id: 'delivered',
        label: 'Livrées',
        icon: Truck,
        color: 'text-emerald-500', // Green for success
        border: 'border-emerald-600',
        bg: 'from-emerald-900/20 to-transparent'
    },
];

export function KanbanBoard() {
    const { orders, updateStatus, deleteOrder, listenToOrders, isLoading } = useOrderStore();

    useEffect(() => {
        const unsubscribe = listenToOrders();
        return () => unsubscribe();
    }, [listenToOrders]);

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-neutral-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-cortex-primary" />
                <p className="animate-pulse">Synchronisation avec la cuisine...</p>
            </div>
        );
    }

    const getNextStatus = (current: OrderStatus): OrderStatus | null => {
        const order = ['new', 'preparing', 'ready', 'delivered'];
        const idx = order.indexOf(current);
        return idx < order.length - 1 ? (order[idx + 1] as OrderStatus) : null;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-6 h-[calc(100vh-12rem)]">
            {COLUMNS.map((col) => {
                const colOrders = orders.filter(o => o.status === col.id);

                return (
                    <div key={col.id} className={cn(
                        "flex-1 min-w-[300px] flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden",
                        "border-t-4", col.border
                    )}>
                        {/* Column Header */}
                        <div className={cn("p-4 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-b", col.bg)}>
                            <div className={cn("flex items-center gap-2 font-bold", col.color)}>
                                <col.icon className="w-5 h-5" />
                                {col.label}
                            </div>
                            <Badge variant="secondary" className="bg-black/40 text-white font-mono border border-white/10">
                                {colOrders.length}
                            </Badge>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-neutral-950/50">
                            {colOrders.length === 0 ? (
                                <div className="text-center py-10 text-neutral-600 text-sm italic">
                                    Aucune commande
                                </div>
                            ) : (
                                colOrders.map(order => (
                                    <div key={order.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg shadow-sm hover:border-white/20 transition-all group relative overflow-hidden">
                                        {/* Decorator strip */}
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", col.bg.split(' ')[0].replace('from-', 'bg-'))} />

                                        <div className="flex justify-between items-start mb-2 pl-3">
                                            <span className="font-mono text-[10px] text-neutral-600 truncate max-w-[80px]">{order.id}</span>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-neutral-500 hover:text-white" onClick={() => window.print()}>
                                                    <Printer className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-neutral-500 hover:text-red-500" onClick={() => deleteOrder(order.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                                <div className="flex items-center text-xs text-neutral-400">
                                                    <Clock className="w-3 h-3 mr-1" /> {order.time}
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-white mb-1 pl-3">{order.customerName}</h4>
                                        <p className="text-sm text-neutral-400 mb-3 line-clamp-2 pl-3">
                                            {order.items.join(', ')}
                                        </p>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 pl-3">
                                            <span className={cn("font-bold", col.color)}>{order.total?.toLocaleString()} CFA</span>

                                            {getNextStatus(order.status) && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-8 w-8 p-0 bg-white/5 hover:bg-white/20 text-white border border-white/10 transition-colors flex items-center justify-center"
                                                    onClick={() => updateStatus(order.id, getNextStatus(order.status)!)}
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
