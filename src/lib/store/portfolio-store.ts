import { create } from 'zustand';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

export type PortfolioCategory = 'Logo' | 'Web' | 'Packaging' | 'Print' | 'Social' | 'All';
export type MediaType = 'image' | 'video';
export type LayoutPosition = 'featured_left' | 'grid_right' | 'masonry_auto';

export interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    clientName?: string;
    category: PortfolioCategory;
    mediaType: MediaType;
    mediaUrl: string;
    thumbnailUrl: string; // Poster for video, or medium res for image
    layoutPosition: LayoutPosition;
    displayOrder: number;
    status: 'draft' | 'published' | 'archived';
    videoDuration?: number; // in seconds
    altText?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

interface PortfolioStore {
    items: PortfolioItem[];
    isLoading: boolean;
    filters: {
        category: PortfolioCategory;
        status: 'all' | 'published' | 'draft';
    };

    // Actions
    setFilter: (key: keyof PortfolioStore['filters'], value: any) => void;
    listenToPortfolio: () => () => void;
    addItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateItem: (id: string, updates: Partial<PortfolioItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    toggleStatus: (id: string, currentStatus: PortfolioItem['status']) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
    items: [],
    isLoading: true,
    filters: {
        category: 'All',
        status: 'all'
    },

    setFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value }
        }));
    },

    listenToPortfolio: () => {
        if (!db) return () => { };

        set({ isLoading: true });
        const q = query(collection(db, 'portfolio_items'), orderBy('displayOrder', 'asc'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PortfolioItem[];

            set({ items, isLoading: false });
        }, (error) => {
            console.error('❌ Portfolio Store Error:', error);
            toast.error("Erreur de chargement du portfolio");
            set({ isLoading: false });
        });

        return unsubscribe;
    },

    addItem: async (itemData) => {
        try {
            const docRef = await addDoc(collection(db, 'portfolio_items'), {
                ...itemData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            toast.success("Média ajouté au portfolio");
            return docRef.id;
        } catch (error: any) {
            console.error("Add Portfolio Item Error:", error);
            toast.error("Erreur lors de l'ajout");
            throw error;
        }
    },

    updateItem: async (id, updates) => {
        try {
            const docRef = doc(db, 'portfolio_items', id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            toast.success("Média mis à jour");
        } catch (error: any) {
            console.error("Update Portfolio Item Error:", error);
            toast.error("Erreur lors de la mise à jour");
            throw error;
        }
    },

    deleteItem: async (id) => {
        try {
            await deleteDoc(doc(db, 'portfolio_items', id));
            toast.success("Média supprimé du portfolio");
        } catch (error: any) {
            console.error("Delete Portfolio Item Error:", error);
            toast.error("Erreur lors de la suppression");
            throw error;
        }
    },

    toggleStatus: async (id, currentStatus) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        await get().updateItem(id, { status: newStatus });
    }
}));
