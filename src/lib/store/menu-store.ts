import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CourseType = 'entree' | 'plat' | 'dessert' | 'boisson';

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    image?: string;
    course: CourseType;
    isActive: boolean;
}

interface MenuState {
    date: string; // The specific date of the menu title text manually set if needed
    items: MenuItem[];

    // Actions
    addItem: (item: Omit<MenuItem, 'id' | 'isActive'>) => void;
    updateItem: (id: string, updates: Partial<MenuItem>) => void;
    deleteItem: (id: string) => void;
    setDate: (date: string) => void;
}

export const useMenuStore = create<MenuState>()(
    persist(
        (set) => ({
            date: '', // Will default to today if empty in component
            items: [
                {
                    id: '1',
                    course: 'entree',
                    name: "Velouté de Courge & Gingembre",
                    description: "Crème onctueuse avec une pointe d'épice locale",
                    price: "4 500",
                    isActive: true,
                    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=60" // Placeholder
                },
                {
                    id: '2',
                    course: 'plat',
                    name: "Capitaine Braisé aux Épices Kribiennes",
                    description: "Accompagné de riz parfumé et plantains mûrs",
                    price: "12 000",
                    isActive: true,
                    image: "https://images.unsplash.com/photo-1547496502-ffa22a33d274?auto=format&fit=crop&w=500&q=60"
                },
                {
                    id: '3',
                    course: 'dessert',
                    name: "Mousse Passion & Copeaux de Coco",
                    description: "Douceur acidulée et croquant coco",
                    price: "3 500",
                    isActive: true,
                    image: "https://images.unsplash.com/photo-1509456070627-7fce6f5d8481?auto=format&fit=crop&w=500&q=60"
                }
            ],

            addItem: (newItem) => set((state) => ({
                items: [...state.items, { ...newItem, id: crypto.randomUUID(), isActive: true }]
            })),

            updateItem: (id, updates) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, ...updates } : item
                )
            })),

            deleteItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),

            setDate: (date) => set({ date })
        }),
        {
            name: 'tedsai-menu-store',
        }
    )
);
