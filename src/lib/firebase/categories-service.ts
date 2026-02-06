import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    where,
    writeBatch
} from 'firebase/firestore';
import { db } from './config'; // Using shared config
import { Category } from '@/types/category';
// Simple slugify helper to avoid external dependency
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

const CATEGORIES_COLLECTION = 'categories';

export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Category[];
        callback(categories);
    });
};

export const addCategory = async (label: string, icon: string) => {
    const slug = slugify(label);
    const categoryRef = doc(db, CATEGORIES_COLLECTION, slug);

    // Get max order
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const order = snapshot.size + 1;

    const newCategory: Category = {
        id: slug,
        label,
        icon,
        order
    };

    await setDoc(categoryRef, newCategory);
    return newCategory;
};

export const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

// Seed initial
export const seedCategories = async () => {
    const defaults = [
        { label: 'Tech & IA', icon: 'Cpu' },
        { label: 'Agriculture Urbaine', icon: 'Leaf' },
        { label: 'Économie & Business', icon: 'TrendingUp' },
        { label: 'Innovation', icon: 'Zap' },
        { label: 'Études de Cas', icon: 'BookOpen' }
    ];

    const batch = writeBatch(db);

    defaults.forEach((cat, index) => {
        const slug = slugify(cat.label);
        const ref = doc(db, CATEGORIES_COLLECTION, slug);
        batch.set(ref, {
            id: slug,
            label: cat.label,
            icon: cat.icon,
            order: index + 1
        });
    });

    await batch.commit();
};
