import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Category } from '@/types/category';

const CATEGORIES_COLLECTION = 'categories';

export const subscribeToCategories = (callback: (data: Category[]) => void) => {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('label', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Category[];
        callback(categories);
    });
};

export const addCategory = async (name: string, icon: string): Promise<Category> => {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        label: name,
        icon: icon,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        createdAt: serverTimestamp()
    });

    return {
        id: docRef.id,
        label: name,
        icon: icon,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    } as Category;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

export const seedCategories = async (): Promise<void> => {
    const batch = writeBatch(db);
    const defaults = [
        { label: 'Intelligence Artificielle', icon: 'Cpu' },
        { label: 'Agriculture Urbaine', icon: 'Leaf' },
        { label: 'Économie', icon: 'TrendingUp' },
        { label: 'Énergie', icon: 'Zap' },
        { label: 'Éducation', icon: 'BookOpen' }
    ];

    defaults.forEach(cat => {
        const ref = doc(collection(db, CATEGORIES_COLLECTION));
        batch.set(ref, {
            ...cat,
            slug: cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            createdAt: serverTimestamp()
        });
    });

    await batch.commit();
};
