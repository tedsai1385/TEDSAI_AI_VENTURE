import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase/config';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

export interface GardenProduct {
    id: string;
    name: string;
    description: string;
    price: string;
    tag: string;
    quantity: number;
    unit: string;
    inStock: boolean;
    image: string; // Base64 or URL
    createdAt?: any;
    updatedAt?: any;
    isSyncing?: boolean;
}

interface GardenState {
    products: GardenProduct[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setProducts: (products: GardenProduct[]) => void;
    addItem: (product: Omit<GardenProduct, 'id'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<GardenProduct>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;

    // Sync
    startFirestoreSync: () => () => void;

    // Debug
    _lastSyncSource: 'local' | 'firestore' | null;
}

export const useGardenStore = create<GardenState>()(
    persist(
        (set, get) => ({
            products: [],
            isLoading: false,
            error: null,
            _lastSyncSource: null,

            setProducts: (products) => set({ products }),

            addItem: async (newProduct) => {
                const tempId = crypto.randomUUID();
                const productWithId: GardenProduct = {
                    ...newProduct,
                    id: tempId,
                    isSyncing: true,
                    createdAt: { seconds: Math.floor(Date.now() / 1000) }
                };

                set((state) => ({ products: [productWithId, ...state.products] }));

                try {
                    console.log('📡 [Store] Tentative de synchro Firestore...');
                    await addDoc(collection(db, 'garden_products'), {
                        ...newProduct,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });
                } catch (err: any) {
                    console.error('❌ [Store] Erreur synchro:', err);
                }
            },

            updateItem: async (id, updates) => {
                set((state) => ({
                    products: state.products.map(p => p.id === id ? { ...p, ...updates, isSyncing: true } : p)
                }));

                try {
                    await updateDoc(doc(db, 'garden_products', id), {
                        ...updates,
                        updatedAt: serverTimestamp()
                    });
                } catch (err: any) {
                    console.error('❌ [Store] Erreur update:', err);
                }
            },

            deleteItem: async (id) => {
                set((state) => ({
                    products: state.products.filter(p => p.id !== id)
                }));

                try {
                    await deleteDoc(doc(db, 'garden_products', id));
                } catch (err: any) {
                    console.error('❌ [Store] Erreur delete:', err);
                }
            },

            startFirestoreSync: () => {
                console.log('🔄 [Store] Démarrage de la synchronisation...');
                set({ isLoading: true });

                const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const firestoreProducts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as GardenProduct[];

                    console.log(`📡 [Store] ${firestoreProducts.length} produits Firestore reçus`);

                    const currentProducts = get().products;
                    const localPending = currentProducts.filter(p => p.isSyncing === true);

                    const finalProducts = [
                        ...localPending.filter(lp => !firestoreProducts.find(fp => fp.name === lp.name)),
                        ...firestoreProducts
                    ];

                    set({
                        products: finalProducts,
                        isLoading: false,
                        error: null,
                        _lastSyncSource: 'firestore'
                    });
                }, (error) => {
                    console.error("❌ [Store] Erreur Listener:", error);
                    set({
                        isLoading: false,
                        error: error.message,
                        _lastSyncSource: 'local'
                    });
                });

                return unsubscribe;
            },
        }),
        {
            name: 'tedsai-garden-storage',
            partialize: (state) => ({ products: state.products }),
        }
    )
);
