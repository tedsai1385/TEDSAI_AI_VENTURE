'use client';

import React, { useState } from 'react';
import { Leaf, Box, MapPin, BadgeCheck, Camera, X } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface HarvestFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function HarvestForm({ onClose, onSuccess }: HarvestFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        weight: '',
        parcel: 'Parcelle A',
        status: 'optimal',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'garden_products'), {
                ...formData,
                stock: formData.weight + 'kg', // Initial stock = harvest weight
                cert: 'BIO CERTIFIÉ',
                harvestDate: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving harvest:', error);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Leaf className="text-emerald-400" size={24} />
                        Nouvelle Récolte
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Produit</label>
                            <div className="relative">
                                <Leaf className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Tomates Cœur de Bœuf"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Poids (kg)</label>
                            <div className="relative">
                                <Box className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input
                                    type="number"
                                    required
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Parcelle</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-500" size={16} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 transition-all outline-none appearance-none"
                                    value={formData.parcel}
                                    onChange={e => setFormData({ ...formData, parcel: e.target.value })}
                                >
                                    <option>Parcelle A</option>
                                    <option>Parcelle B</option>
                                    <option>Serre Hydroponique</option>
                                    <option>Jardin Vertical</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Qualité</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-3 text-slate-500" size={16} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 transition-all outline-none appearance-none"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="optimal">Premium (Optimal)</option>
                                    <option value="standard">Standard</option>
                                    <option value="processing">Pour Transformation</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-slate-300 font-bold hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enregistrement...' : 'Confirmer Récolte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
