import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GardenItem {
    id: string;
    name: string;
    variety?: string;
    quantity: number; // kg
    quality: 'A' | 'B' | 'C';
    harvestDate: string;
    parcelId: string;
    status: 'in_stock' | 'reserved' | 'consumed';
}

interface InventoryStore {
    items: GardenItem[];
    addItem: (item: Omit<GardenItem, 'id' | 'status' | 'harvestDate'>) => void;
    consumeItem: (id: string, amount: number) => void;
    getItemsByStatus: (status: GardenItem['status']) => GardenItem[];
    getTotalStock: (name: string) => number;
}

export const useInventoryStore = create<InventoryStore>()(
    persist(
        (set, get) => ({
            items: [
                { id: '1', name: 'Tomates', variety: 'Cœur de Bœuf', quantity: 25, quality: 'A', harvestDate: new Date().toISOString(), parcelId: 'P-01', status: 'in_stock' },
                { id: '2', name: 'Basilic', variety: 'Grand Vert', quantity: 4, quality: 'A', harvestDate: new Date().toISOString(), parcelId: 'P-04', status: 'in_stock' },
                { id: '3', name: 'Piment', variety: 'Habanero', quantity: 12, quality: 'B', harvestDate: new Date().toISOString(), parcelId: 'P-02', status: 'in_stock' },
            ],
            addItem: (newItem) => set((state) => ({
                items: [
                    ...state.items,
                    {
                        ...newItem,
                        id: Math.random().toString(36).substr(2, 9),
                        status: 'in_stock',
                        harvestDate: new Date().toISOString(),
                    },
                ],
            })),
            consumeItem: (id, amount) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, item.quantity - amount) } : item
                ),
            })),
            getItemsByStatus: (status) => get().items.filter((i) => i.status === status),
            getTotalStock: (name) => get().items
                .filter(i => i.name.toLowerCase() === name.toLowerCase() && i.status === 'in_stock')
                .reduce((acc, curr) => acc + curr.quantity, 0),
        }),
        {
            name: 'tedsai-inventory-storage',
        }
    )
);
