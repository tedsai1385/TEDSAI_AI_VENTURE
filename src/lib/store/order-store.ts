import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';

export type OrderStatus = 'new' | 'paid' | 'preparing' | 'ready' | 'delivered';

export interface Order {
    id: string;
    customerName: string;
    items: string[];
    total: number;
    status: OrderStatus;
    time: string;
    description?: string;
    createdAt?: any;
}

interface OrderStore {
    orders: Order[];
    isLoading: boolean;
    listenToOrders: () => (() => void);
    updateStatus: (id: string, status: OrderStatus) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    isLoading: true,
    listenToOrders: () => {
        if (!db) {
            console.warn('⚠️ Firestore not initialized. Orders will not sync.');
            return () => { };
        }

        const q = query(collection(db, 'restaurant_orders'), orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => {
                const data = doc.data();

                // Handle time field - use existing time or format from createdAt
                let timeDisplay = data.time || '---';
                if (!data.time && data.createdAt) {
                    try {
                        // Handle Firestore Timestamp
                        const timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                        timeDisplay = timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    } catch (e) {
                        console.error('Error formatting time:', e);
                    }
                }

                return {
                    ...data,
                    id: doc.id,
                    time: timeDisplay
                } as Order;
            });

            console.log(`📦 Loaded ${orders.length} orders from Firestore`);
            set({ orders, isLoading: false });
        }, (error) => {
            console.error('❌ Error listening to orders:', error);
            set({ isLoading: false });
        });
    },
    updateStatus: async (id, status) => {
        if (!db) return;
        const orderRef = doc(db, 'restaurant_orders', id);
        await updateDoc(orderRef, { status });
    },
    deleteOrder: async (id) => {
        if (!db) return;
        const orderRef = doc(db, 'restaurant_orders', id);
        await deleteDoc(orderRef);
    }
}));
