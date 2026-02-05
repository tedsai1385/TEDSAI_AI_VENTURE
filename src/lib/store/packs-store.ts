import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';

export interface PackItem {
    id: string;
    title: string;
    price: string;
    desc: string;
    items: string[]; // List of contents like "Miel d'Oku", "Thé" etc.
    image: string;
    promo?: string; // Optional tag like "Bio", "-20%", etc.
    bg?: string; // Tailwind class for background color
    iconType?: 'utensils' | 'home' | 'package' | 'gift'; // Simple selection for icons
    createdAt: string;
}

interface PacksStore {
    packs: PackItem[];
    isLoading: boolean;
    listenToPacks: () => (() => void);
    addPack: (pack: Omit<PackItem, 'id' | 'createdAt'>) => Promise<void>;
    updatePack: (id: string, updates: Partial<PackItem>) => Promise<void>;
    deletePack: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<string>;
}

export const usePacksStore = create<PacksStore>((set) => ({
    packs: [],
    isLoading: true,
    listenToPacks: () => {
        if (!db) {
            console.warn('⚠️ Packs: Firestore not initialized');
            set({ isLoading: false });
            return () => { };
        }

        const q = query(collection(db, 'packs'), orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const packs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as PackItem));
            set({ packs, isLoading: false });
        }, (error) => {
            console.error('❌ Packs: Error listening to packs:', error);
            set({ isLoading: false });
        });
    },
    addPack: async (newPack) => {
        if (!db) return;
        await addDoc(collection(db, 'packs'), {
            ...newPack,
            createdAt: new Date().toISOString()
        });
    },
    updatePack: async (id, updates) => {
        if (!db) return;
        await updateDoc(doc(db, 'packs', id), updates);
    },
    deletePack: async (id) => {
        if (!db) return;
        await deleteDoc(doc(db, 'packs', id));
    },
    uploadFile: async (file) => {
        const path = `packs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        const response = await fetch('/api/gallery/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
    }
}));
