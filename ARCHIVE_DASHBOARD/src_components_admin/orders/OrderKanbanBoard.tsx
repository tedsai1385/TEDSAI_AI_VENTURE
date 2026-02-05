'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Clock, DollarSign, User, Phone, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Order, OrderStatus } from '@/types/admin';

// Mock data - À remplacer par vraies données API
const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'Marie Kamga',
        customerPhone: '+237 6 78 90 12 34',
        items: [
            { id: '1', productId: 'p1', productName: 'Ndolé 2.0', quantity: 2, unitPrice: 3500 },
        ],
        totalAmount: 7000,
        status: 'pending',
        paymentMethod: 'momo_mtn',
        deliveryAddress: 'Bastos, Yaoundé',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'ORD-002',
        customerName: 'Paul Njoya',
        customerPhone: '+237 6 99 88 77 66',
        items: [
            { id: '2', productId: 'p2', productName: 'Panier Bio Hebdo', quantity: 1, unitPrice: 15000 },
        ],
        totalAmount: 15000,
        status: 'confirmed',
        paymentMethod: 'momo_orange',
        deliveryAddress: 'Mvan, Yaoundé',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const COLUMNS: { id: OrderStatus; label: string; color: string }[] = [
    { id: 'pending', label: 'Nouvelles', color: 'bg-gray-500' },
    { id: 'payment_pending', label: 'Paiement', color: 'bg-yellow-500' },
    { id: 'confirmed', label: 'Confirmées', color: 'bg-blue-500' },
    { id: 'preparing', label: 'En préparation', color: 'bg-purple-500' },
    { id: 'ready', label: 'Prêtes', color: 'bg-green-500' },
    { id: 'delivered', label: 'Livrées', color: 'bg-emerald-500' },
];

export function OrderKanbanBoard() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Update order status
        const newStatus = destination.droppableId as OrderStatus;
        const updatedOrders = orders.map((order) =>
            order.id === draggableId
                ? { ...order, status: newStatus, updatedAt: new Date() }
                : order
        );

        setOrders(updatedOrders);

        // TODO Phase 2: Appel API pour persister changement
        // TODO Phase 2: Envoyer notification WhatsApp au client
        console.log(`Order ${draggableId} moved to ${newStatus}`);
    };

    const getOrdersByStatus = (status: OrderStatus): Order[] => {
        return orders.filter((order) => order.status === status);
    };

    return (
        <div className="h-full">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map((column) => {
                        const columnOrders = getOrdersByStatus(column.id);

                        return (
                            <div key={column.id} className="flex-shrink-0 w-80">
                                {/* Column Header */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                            <h3 className="font-bold text-white">{column.label}</h3>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-dark-surface-elevated text-dark-text-secondary">
                                            {columnOrders.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Droppable Column */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`min-h-[400px] rounded-lg p-3 transition-colors ${snapshot.isDraggingOver
                                                    ? 'bg-cortex-primary/10 border-2 border-cortex-primary'
                                                    : 'bg-dark-surface border border-dark-border'
                                                }`}
                                        >
                                            {columnOrders.map((order, index) => (
                                                <Draggable key={order.id} draggableId={order.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 p-4 rounded-lg border cursor-move transition-all ${snapshot.isDragging
                                                                    ? 'bg-dark-bg border-cortex-primary shadow-glow-green rotate-2'
                                                                    : 'bg-dark-bg border-dark-border hover:border-cortex-primary/50'
                                                                }`}
                                                        >
                                                            {/* Order Card */}
                                                            <div className="space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <p className="font-bold text-white text-sm">{order.id}</p>
                                                                        <p className="text-xs text-dark-text-secondary">
                                                                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                    <button className="p-1 hover:bg-dark-surface-elevated rounded">
                                                                        <MoreVertical className="w-4 h-4 text-dark-text-secondary" />
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <User className="w-4 h-4 text-cortex-primary" />
                                                                    <span className="text-white">{order.customerName}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Phone className="w-4 h-4 text-dark-text-secondary" />
                                                                    <span className="text-dark-text-secondary text-xs">{order.customerPhone}</span>
                                                                </div>

                                                                {order.deliveryAddress && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <MapPin className="w-4 h-4 text-dark-text-secondary" />
                                                                        <span className="text-dark-text-secondary text-xs truncate">
                                                                            {order.deliveryAddress}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="pt-2 border-t border-dark-border">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-1">
                                                                            <DollarSign className="w-4 h-4 text-cortex-secondary" />
                                                                            <span className="font-bold text-white text-sm">
                                                                                {order.totalAmount.toLocaleString()} FCFA
                                                                            </span>
                                                                        </div>
                                                                        {order.paymentMethod && (
                                                                            <span className="px-2 py-0.5 text-xs rounded bg-cortex-primary/10 text-cortex-primary">
                                                                                {order.paymentMethod === 'momo_mtn' ? 'MTN' : 'Orange'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="text-xs text-dark-text-secondary">
                                                                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {columnOrders.length === 0 && (
                                                <div className="text-center text-dark-text-secondary text-sm py-8">
                                                    Aucune commande
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
