'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function ElevagePage() {
    const [stats, setStats] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const statsDoc = await getDoc(doc(db, 'elevage_stats', 'current'));
                if (statsDoc.exists()) {
                    setStats(statsDoc.data());
                }

                const servicesDoc = await getDoc(doc(db, 'elevage_services', 'list'));
                if (servicesDoc.exists()) {
                    setServices(servicesDoc.data().items || []);
                }
            } catch (error) {
                console.error('Error loading elevage data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Chargement...</p>
                </div>
            </div>
        );
    }

    const volaille = stats?.volaille || {};
    const aquaculture = stats?.aquaculture || {};

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}>
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-5xl font-extrabold mb-4">TEDSAI Élevage</h1>
                    <p className="text-xl mb-4">Volaille & Aquaculture Durable</p>
                    <p className="text-lg opacity-90">Production locale • Biosécurité • Rentabilité</p>
                </div>
            </section>

            {/* Production Stats */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-12">Notre Production</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Volaille Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-center mb-6">
                            <i className="fa-solid fa-drumstick-bite text-5xl text-[#8B4513] mb-4"></i>
                            <h3 className="text-2xl font-bold text-[#8B4513]">Volaille (Poulet de Chair)</h3>
                        </div>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="py-2 text-gray-600">Capacité</td><td className="font-bold">{volaille.capacity || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Durée cycle</td><td className="font-bold">{volaille.cycle_duration || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Production/an</td><td className="font-bold">{volaille.production_annuelle || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Taux survie</td><td className="font-bold text-green-600">{volaille.taux_survie || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Poids moyen</td><td className="font-bold">{volaille.poids_moyen || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Rentabilité</td><td className="font-bold text-green-600">{volaille.rentabilite || 'N/A'}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Aquaculture Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-center mb-6">
                            <i className="fa-solid fa-fish text-5xl text-[#16A085] mb-4"></i>
                            <h3 className="text-2xl font-bold text-[#16A085]">Aquaculture</h3>
                        </div>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="py-2 text-gray-600">Espèces</td><td className="font-bold">{aquaculture.especes || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Bassins</td><td className="font-bold">{aquaculture.bassins || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Production/an</td><td className="font-bold">{aquaculture.production_annuelle || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Taux survie</td><td className="font-bold text-green-600">{aquaculture.taux_survie || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Poids Tilapia</td><td className="font-bold">{aquaculture.poids_moyen_tilapia || 'N/A'}</td></tr>
                                <tr><td className="py-2 text-gray-600">Rentabilité</td><td className="font-bold text-green-600">{aquaculture.rentabilite || 'N/A'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Services */}
            {services.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <i className="fa-solid fa-handshake text-3xl text-[#8B4513] mb-4"></i>
                                    <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                                    <strong className="text-[#8B4513] block">{service.price}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-16 container mx-auto px-4 text-center">
                <div className="bg-[#8B4513] text-white p-12 rounded-3xl">
                    <h2 className="text-3xl font-bold mb-4">Démarrer Votre Élevage</h2>
                    <p className="text-lg mb-8 opacity-90">Conseil, formation, vente d'intrants. Nous vous accompagnons de A à Z.</p>
                    <Link href="/contact" className="inline-block bg-white text-[#8B4513] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                        Demander un Devis
                    </Link>
                </div>
            </section>
        </div>
    );
}
