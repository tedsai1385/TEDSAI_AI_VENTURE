import { create } from 'zustand';
import { db, storage } from '@/lib/firebase/config';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type MediaType = 'image' | 'video';

export interface GalleryItem {
    id: string;
    url: string;
    type: MediaType;
    title: string;
    aspectRatio?: 'square' | 'wide' | 'tall' | 'large';
    createdAt: string;
}

interface GalleryStore {
    items: GalleryItem[];
    isLoading: boolean;
    listenToGallery: () => (() => void);
    addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => Promise<void>;
    uploadFile: (file: File, path: string) => Promise<string>;
    deleteItem: (id: string) => Promise<void>;
    cleanup: () => void;
}

// Singleton listener pour éviter les fuites mémoire
let activeListener: (() => void) | null = null;

export const useGalleryStore = create<GalleryStore>((set, get) => ({
    items: [],
    isLoading: true,
    listenToGallery: () => {
        // Empêcher multiples listeners UNIQUEMENT si on a déjà des données
        // Cela permet de gérer le Hot Reload où activeListener existe mais le store est vide
        const { items } = get();
        if (activeListener && items.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🛑 Gallery: Listener already active & data present, reusing');
            }
            // Force loading false just in case
            set({ isLoading: false });
            return activeListener;
        }

        // Si on a un vieux listener mais pas de données (ex: après refresh), on le tue
        if (activeListener) {
            activeListener();
            activeListener = null;
        }

        if (!db) {
            console.warn('⚠️ Gallery: Firestore not initialized');
            set({ isLoading: false });
            return () => { };
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('🖼️ Gallery: Starting Firestore listener...');
        }

        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));

        activeListener = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GalleryItem));

            set({ items, isLoading: false });
        }, (error) => {
            console.error('❌ Gallery: Error listening to gallery:', error);
            set({ isLoading: false, items: [] });
        });

        return activeListener;
    },
    cleanup: () => {
        if (activeListener) {
            activeListener();
            activeListener = null;
            if (process.env.NODE_ENV === 'development') {
                console.log('🧹 Gallery: Listener cleaned up');
            }
        }
    },
    addItem: async (newItem) => {
        if (!db) return;
        await addDoc(collection(db, 'gallery'), {
            ...newItem,
            createdAt: new Date().toISOString()
        });
    },
    uploadFile: async (file, path) => {
        if (!storage) throw new Error("Firebase Storage non initialisé");

        try {
            // Création de la référence de stockage
            const storageRef = ref(storage, path);

            // Upload direct depuis le client (contourne les restrictions Admin SDK billing)
            const snapshot = await uploadBytes(storageRef, file);

            // Récupération de l'URL publique
            const url = await getDownloadURL(snapshot.ref);

            return url;
        } catch (error: any) {
            console.error("Erreur Upload Client:", error);
            throw new Error(error.message || "Echec de l'upload client");
        }
    },
    deleteItem: async (id) => {
        if (!db) return;
        await deleteDoc(doc(db, 'gallery', id));
    }
}));
