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

export type ProductCategory = 'epices' | 'sucres' | 'huiles' | 'super-aliments' | 'frais' | 'autre';
export type ProductBadge = 'IGP' | 'Bio' | 'Rare' | 'Artisanal' | 'Montagne' | 'Village' | 'Fort' | 'Nouveau';

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: ProductCategory;
    price: string; // Stored as string to handle formatted currency if needed, or number. Let's use string for consistency with existing code, or number if strictly needed. User prompt said integer. Let's stick to string for display flexibility or number. Plan said number. Let's use number for calculation. 
    // Actually, PacksManager used string "15 000 FCFA". Let's try to be cleaner here and use number for price, string for formatting. 
    priceVal: number; // Raw number
    description: string;
    shortDescription: string;
    weightVolume: string;
    stock: number;
    badges: ProductBadge[];
    mainImage: string;
    galleryImages: string[];
    // status supprimé - auto-publish : tous les produits sont publiés par défaut
    isFeatured: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

interface ProductsStore {
    products: Product[];
    isLoading: boolean;
    filters: {
        category: ProductCategory | 'all';
        search: string;
    };

    // Actions
    setFilter: (key: keyof ProductsStore['filters'], value: any) => void;
    listenToProducts: () => () => void;
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    // toggleStatus supprimé - auto-publish uniquement
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
    products: [],
    isLoading: true,
    filters: {
        category: 'all',
        search: ''
    },

    setFilter: (key, value) => {
        set(state => ({
            filters: { ...state.filters, [key]: value }
        }));
    },

    listenToProducts: () => {
        set({ isLoading: true });
        // Ensure the collection matches the one in rules: epicerie_products
        const q = query(collection(db, 'epicerie_products'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];

            set({ products, isLoading: false });
        }, (error) => {
            console.error('❌ Products Store Error:', error);
            toast.error("Erreur de chargement des produits");
            set({ isLoading: false });
        });

        return unsubscribe;
    },

    addProduct: async (productData) => {
        try {
            // Auto generation of slug if empty
            if (!productData.slug) {
                productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }

            const docRef = await addDoc(collection(db, 'epicerie_products'), {
                ...productData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            toast.success("Produit ajouté avec succès");
            return docRef.id;
        } catch (error: any) {
            console.error("Add Product Error:", error);
            throw new Error(error.message);
        }
    },

    updateProduct: async (id, updates) => {
        try {
            // Validation stricte du stock
            if (updates.stock !== undefined) {
                updates.stock = Math.max(0, Number(updates.stock) || 0);
            }

            // Validation du prix
            if (updates.priceVal !== undefined) {
                updates.priceVal = Math.max(0, Number(updates.priceVal) || 0);
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Update Product:', { id, stock: updates.stock, price: updates.priceVal });
            }

            const docRef = doc(db, 'epicerie_products', id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });

            // Optimistic update local
            set((state) => ({
                products: state.products.map(p =>
                    p.id === id ? { ...p, ...updates } : p
                )
            }));

            toast.success("✅ Produit mis à jour", {
                description: updates.stock !== undefined ? `Stock: ${updates.stock} unités` : undefined
            });
        } catch (error: any) {
            console.error("❌ Update Product Error:", error);
            toast.error("❌ Erreur mise à jour");
            throw new Error(error.message);
        }
    },

    deleteProduct: async (id) => {
        try {
            await deleteDoc(doc(db, 'epicerie_products', id));
            toast.success("Produit supprimé");
        } catch (error: any) {
            console.error("Delete Product Error:", error);
            throw new Error(error.message);
        }
    },

    // toggleStatus supprimé - tous les produits sont publiés automatiquement
}));
