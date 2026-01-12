'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import PageHeader from '@/components/dashboard/PageHeader';
import { Bird, Save, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminElevagePage() {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        volaille: {
            capacity: '',
            cycle_duration: '',
            production_annuelle: '',
            taux_survie: '',
            poids_moyen: '',
            rentabilite: ''
        },
        aquaculture: {
            especes: '',
            bassins: '',
            production_annuelle: '',
            taux_survie: '',
            poids_moyen_tilapia: '',
            rentabilite: ''
        }
    });

    const [services, setServices] = useState<Array<{ name: string; description: string; price: string }>>([]);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const statsDoc = await getDoc(doc(db, 'elevage_stats', 'current'));
            if (statsDoc.exists()) {
                const data = statsDoc.data();
                setStats(data as any);
            }

            const servicesDoc = await getDoc(doc(db, 'elevage_services', 'list'));
            if (servicesDoc.exists()) {
                setServices(servicesDoc.data().items || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSaveStats = async () => {
        try {
            await setDoc(doc(db, 'elevage_stats', 'current'), {
                ...stats,
                updatedAt: serverTimestamp()
            });
            alert('✅ Statistiques mises à jour !');
        } catch (error) {
            console.error('Error saving stats:', error);
            alert('❌ Erreur lors de la sauvegarde');
        }
    };

    const handleSaveServices = async () => {
        try {
            await setDoc(doc(db, 'elevage_services', 'list'), {
                items: services,
                updatedAt: serverTimestamp()
            });
            alert('✅ Services mis à jour !');
        } catch (error) {
            console.error('Error saving services:', error);
            alert('❌ Erreur lors de la sauvegarde');
        }
    };

    if (!mounted) return null;

    return (
        <AdminGuard>
            <PageHeader
                title="Gestion Élevage"
                subtitle="Modifiez les statistiques de production et les services proposés."
                icon={Bird}
            />

            {/* Production Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[32px] p-8 mb-8 border border-white/5"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-emerald-400" size={24} />
                        Statistiques de Production
                    </h3>
                    <button
                        onClick={handleSaveStats}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                    >
                        <Save size={18} />
                        Enregistrer
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Volaille */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-200 mb-4">🐔 Volaille (Poulet de Chair)</h4>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Capacité</label>
                            <input
                                type="text"
                                value={stats.volaille.capacity}
                                onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, capacity: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 5000 têtes"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Durée du cycle</label>
                            <input
                                type="text"
                                value={stats.volaille.cycle_duration}
                                onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, cycle_duration: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 45 jours"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Production annuelle</label>
                            <input
                                type="text"
                                value={stats.volaille.production_annuelle}
                                onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, production_annuelle: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 40,000 poulets"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Taux survie</label>
                                <input
                                    type="text"
                                    value={stats.volaille.taux_survie}
                                    onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, taux_survie: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="96%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Poids moyen</label>
                                <input
                                    type="text"
                                    value={stats.volaille.poids_moyen}
                                    onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, poids_moyen: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="2.2kg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Rentabilité</label>
                                <input
                                    type="text"
                                    value={stats.volaille.rentabilite}
                                    onChange={(e) => setStats({ ...stats, volaille: { ...stats.volaille, rentabilite: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="+25%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Aquaculture */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-200 mb-4">🐟 Aquaculture</h4>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Espèces</label>
                            <input
                                type="text"
                                value={stats.aquaculture.especes}
                                onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, especes: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: Tilapia, Silure"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de bassins</label>
                            <input
                                type="text"
                                value={stats.aquaculture.bassins}
                                onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, bassins: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Production annuelle</label>
                            <input
                                type="text"
                                value={stats.aquaculture.production_annuelle}
                                onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, production_annuelle: e.target.value } })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                placeholder="ex: 5 tonnes"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Taux survie</label>
                                <input
                                    type="text"
                                    value={stats.aquaculture.taux_survie}
                                    onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, taux_survie: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="92%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Poids Tilapia</label>
                                <input
                                    type="text"
                                    value={stats.aquaculture.poids_moyen_tilapia}
                                    onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, poids_moyen_tilapia: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="500g"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Rentabilité</label>
                                <input
                                    type="text"
                                    value={stats.aquaculture.rentabilite}
                                    onChange={(e) => setStats({ ...stats, aquaculture: { ...stats.aquaculture, rentabilite: e.target.value } })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50"
                                    placeholder="+30%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Services */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[32px] p-8 border border-white/5"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Services Proposés</h3>
                    <button
                        onClick={handleSaveServices}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all"
                    >
                        <Save size={18} />
                        Enregistrer
                    </button>
                </div>

                <div className="space-y-6">
                    {services.map((service, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Nom du service</label>
                                <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) => {
                                        const newServices = [...services];
                                        newServices[idx].name = e.target.value;
                                        setServices(newServices);
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={service.description}
                                    onChange={(e) => {
                                        const newServices = [...services];
                                        newServices[idx].description = e.target.value;
                                        setServices(newServices);
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Prix</label>
                                <input
                                    type="text"
                                    value={service.price}
                                    onChange={(e) => {
                                        const newServices = [...services];
                                        newServices[idx].price = e.target.value;
                                        setServices(newServices);
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </AdminGuard>
    );
}
