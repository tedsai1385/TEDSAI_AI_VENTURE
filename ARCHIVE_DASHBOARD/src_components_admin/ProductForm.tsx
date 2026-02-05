'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GardenProduct } from '@/types';

interface ProductFormProps {
    initialData?: GardenProduct | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductForm({ initialData, onClose, onSuccess }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<GardenProduct>>(initialData || {
        name: '',
        variety: '',
        category: 'Légumes',
        price: 0,
        stock: 0,
        description: '',
        inStock: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const categories = ['Légumes', 'Épices', 'Aromates', 'Élevage', 'Fruits', 'Épicerie Fine'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const productData = {
                ...formData,
                image: imageUrl || 'https://via.placeholder.com/400',
                updatedAt: new Date().toISOString()
            };

            if (initialData?.id) {
                await updateDoc(doc(db, 'garden_products', initialData.id), productData);
            } else {
                await addDoc(collection(db, 'garden_products'), {
                    ...productData,
                    createdAt: new Date().toISOString()
                });
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-inter text-slate-800">
                        {initialData ? 'Modifier le Produit' : 'Nouveau Produit'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border rounded-lg"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Variété</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={formData.variety}
                                onChange={e => setFormData({ ...formData, variety: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (XAF)</label>
                            <input
                                type="number"
                                required
                                className="w-full p-2 border rounded-lg"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                required
                                className="w-full p-2 border rounded-lg"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded-lg text-sm"
                            onChange={e => setImageFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                            id="inStock"
                        />
                        <label htmlFor="inStock" className="text-sm text-gray-700">Disponible en stock</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                </form>
            </div>
        </div>
    );
}
