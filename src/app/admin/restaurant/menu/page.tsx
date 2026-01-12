'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import {
    UtensilsCrossed,
    Plus,
    Edit,
    Trash2,
    Star,
    DollarSign,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'starter' | 'main' | 'dessert';
    available: boolean;
    traceable: boolean;
    isDailySpecial?: boolean;
}

export default function MenuManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'main' as 'starter' | 'main' | 'dessert',
        available: true,
        traceable: true,
        isDailySpecial: false
    });

    useEffect(() => {
        setMounted(true);
        const unsub = onSnapshot(query(collection(db, 'vitedia_menu'), orderBy('category')), (snap) => {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
            setMenuItems(items);
        });
        return () => unsub();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateDoc(doc(db, 'vitedia_menu', editingItem.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'vitedia_menu'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }
            resetForm();
            alert(editingItem ? '✅ Plat mis à jour !' : '✅ Plat ajouté !');
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert('❌ Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: item.available,
            traceable: item.traceable,
            isDailySpecial: item.isDailySpecial || false
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer ce plat ?')) {
            try {
                await deleteDoc(doc(db, 'vitedia_menu', id));
                alert('✅ Plat supprimé');
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const toggleDailySpecial = async (item: MenuItem) => {
        try {
            await updateDoc(doc(db, 'vitedia_menu', item.id), {
                isDailySpecial: !item.isDailySpecial
            });
        } catch (error) {
            console.error('Error toggling daily special:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: 'main',
            available: true,
            traceable: true,
            isDailySpecial: false
        });
        setEditingItem(null);
        setShowForm(false);
    };

    const filteredItems = filterCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === filterCategory);

    const dailySpecials = menuItems.filter(item => item.isDailySpecial);

    if (!mounted) return null;

    return (
        <AdminGuard>
            <PageHeader
                title="Gestion du Menu"
                subtitle="Gérez la carte du restaurant et le menu du jour."
                icon={UtensilsCrossed}
                actions={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} />
                        {showForm ? 'Annuler' : 'Nouveau Plat'}
                    </button>
                }
            />

            {/* Daily Specials Banner */}
            {dailySpecials.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 mb-8 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Star className="text-amber-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Menu du Jour</h3>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold border border-amber-500/30">
                            {dailySpecials.length} plat{dailySpecials.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dailySpecials.map(item => (
                            <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="font-bold text-white mb-1">{item.name}</div>
                                <div className="text-sm text-slate-400">{item.description}</div>
                                <div className="text-amber-400 font-bold mt-2">{item.price}€</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[32px] p-8 mb-8 border border-white/5"
                >
                    <h3 className="text-xl font-bold text-white mb-6">{editingItem ? 'Modifier' : 'Ajouter'} un Plat</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nom du plat</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                            >
                                <option value="starter">Entrée</option>
                                <option value="main">Plat</option>
                                <option value="dessert">Dessert</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Prix (€)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
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
                            <label className="flex items-center gap-2 text-amber-400">
                                <input
                                    type="checkbox"
                                    checked={formData.isDailySpecial}
                                    onChange={(e) => setFormData({ ...formData, isDailySpecial: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <Star size={16} className="inline" /> Menu du Jour
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {editingItem ? 'Mettre à jour' : 'Ajouter'}
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
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-semibold transition-all",
                        filterCategory === 'all'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    )}
                >
                    Tous ({menuItems.length})
                </button>
                <button
                    onClick={() => setFilterCategory('starter')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-semibold transition-all",
                        filterCategory === 'starter'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    )}
                >
                    Entrées
                </button>
                <button
                    onClick={() => setFilterCategory('main')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-semibold transition-all",
                        filterCategory === 'main'
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    )}
                >
                    Plats
                </button>
                <button
                    onClick={() => setFilterCategory('dessert')}
                    className={cn(
                        "px-6 py-3 rounded-xl font-semibold transition-all",
                        filterCategory === 'dessert'
                            ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    )}
                >
                    Desserts
                </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                            "glass rounded-2xl p-6 border transition-all group relative",
                            item.isDailySpecial ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 hover:border-blue-500/30'
                        )}
                    >
                        {item.isDailySpecial && (
                            <div className="absolute top-4 right-4">
                                <Star className="text-amber-400 fill-amber-400" size={20} />
                            </div>
                        )}
                        <div className="mb-4">
                            <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-blue-400">{item.price}€</div>
                            <span className={cn(
                                "text-xs px-3 py-1 rounded-full border",
                                item.category === 'starter' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    item.category === 'main' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-pink-500/10 text-pink-400 border-pink-500/20'
                            )}>
                                {item.category === 'starter' ? 'Entrée' : item.category === 'main' ? 'Plat' : 'Dessert'}
                            </span>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {item.available && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                    Disponible
                                </span>
                            )}
                            {item.traceable && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    Traçable
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleDailySpecial(item)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all text-sm",
                                    item.isDailySpecial
                                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                                )}
                            >
                                <Star size={14} className={item.isDailySpecial ? 'fill-amber-400' : ''} />
                                {item.isDailySpecial ? 'Retirer' : 'Menu du Jour'}
                            </button>
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all border border-white/10"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all border border-white/10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-16">
                    <UtensilsCrossed className="mx-auto text-slate-600 mb-4" size={64} />
                    <p className="text-slate-400">Aucun plat dans cette catégorie</p>
                </div>
            )}
        </AdminGuard>
    );
}
