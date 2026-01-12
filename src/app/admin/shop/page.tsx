'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    ShoppingBag,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

interface Product {
    id: string;
    name: string;
    category: 'epice' | 'volaille' | 'poisson';
    origin: string;
    price: number;
    unit: string;
    description: string;
    available: boolean;
    traceable: boolean;
}

export default function AdminShopPage() {
    const [mounted, setMounted] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const [formData, setFormData] = useState({
        name: '',
        category: 'epice' as 'epice' | 'volaille' | 'poisson',
        origin: '',
        price: 0,
        unit: '',
        description: '',
        available: true,
        traceable: true
    });

    useEffect(() => {
        setMounted(true);
        const unsub = onSnapshot(query(collection(db, 'epicerie_products'), orderBy('name')), (snap) => {
            const prodList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
            setProducts(prodList);
        });
        return () => unsub();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateDoc(doc(db, 'epicerie_products', editingProduct.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'epicerie_products'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            origin: product.origin,
            price: product.price,
            unit: product.unit,
            description: product.description,
            available: product.available,
            traceable: product.traceable
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer ce produit ?')) {
            try {
                await deleteDoc(doc(db, 'epicerie_products', id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'epice',
            origin: '',
            price: 0,
            unit: '',
            description: '',
            available: true,
            traceable: true
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (!mounted) return null;

    return (
        <AdminGuard>
            <PageHeader
                title="Gestion Épicerie"
                subtitle="Gérez les épices et produits frais de la boutique."
                icon={ShoppingBag}
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} />
                        {showForm ? 'Annuler' : 'Nouveau Produit'}
                    </button>
                }
            />

            {/* Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[32px] p-8 mb-8 border border-white/5"
                >
                    <h3 className="text-xl font-bold text-white mb-6">{editingProduct ? 'Modifier' : 'Ajouter'} un Produit</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                            >
                                <option value="epice">Épice</option>
                                <option value="volaille">Volaille</option>
                                <option value="poisson">Poisson</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Origine</label>
                            <input
                                type="text"
                                required
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Prix (FCFA)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Unité</label>
                            <input
                                type="text"
                                required
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 250g, kg, pièce"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                Disponible
                            </label>
                            <label className="flex items-center gap-2 text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={formData.traceable}
                                    onChange={(e) => setFormData({ ...formData, traceable: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                Traçable
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold transition-all"
                            >
                                {editingProduct ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-emerald-500/50"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                >
                    <option value="all">Toutes catégories</option>
                    <option value="epice">Épices</option>
                    <option value="volaille">Volaille</option>
                    <option value="poisson">Poisson</option>
                </select>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">{product.name}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {product.category}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{product.description}</p>
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <div className="text-2xl font-bold text-emerald-400">{product.price} FCFA</div>
                                <div className="text-slate-500">/ {product.unit}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Origine</div>
                                <div className="text-sm text-slate-300">{product.origin}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {product.available && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                    En stock
                                </span>
                            )}
                            {product.traceable && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    Traçable
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <Package className="mx-auto text-slate-600 mb-4" size={64} />
                    <p className="text-slate-400">Aucun produit trouvé</p>
                </div>
            )}
        </AdminGuard>
    );
}
