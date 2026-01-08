'use client';

import React from 'react';
import Link from 'next/link';

export default function ElevagePage() {
    const volaille = {
        capacity: "5000 têtes",
        cycle_duration: "45 jours",
        production_annuelle: "40,000 poulets",
        stats: { taux_survie: "96%", poids_moyen: "2.2kg", rentabilite: "+25%" }
    };

    const aquaculture = {
        especes: ["Tilapia", "Silure"],
        bassins: "12",
        production_annuelle: "5 tonnes",
        stats: { taux_survie: "92%", poids_moyen_tilapia: "500g", rentabilite: "+30%" }
    };

    const services = [
        { name: "Consultation Démarrage", description: "Étude de faisabilité et dimensionnement de votre projet.", price: "50,000 FCFA" },
        { name: "Suivi Vétérinaire", description: "Audit sanitaire et plan de prophylaxie personnalisé.", price: "Sur devis" },
        { name: "Formation Avicole", description: "3 jours de formation pratique sur site.", price: "75,000 FCFA" },
        { name: "Vente Poussins 1J", description: "Souche Cobb 500, vaccinés Marek/Newcastle.", price: "Variable" }
    ];

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
                                <tr><td className="py-2 text-gray-600">Capacité</td><td className="font-bold">{volaille.capacity}</td></tr>
                                <tr><td className="py-2 text-gray-600">Durée cycle</td><td className="font-bold">{volaille.cycle_duration}</td></tr>
                                <tr><td className="py-2 text-gray-600">Production/an</td><td className="font-bold">{volaille.production_annuelle}</td></tr>
                                <tr><td className="py-2 text-gray-600">Taux survie</td><td className="font-bold text-green-600">{volaille.stats.taux_survie}</td></tr>
                                <tr><td className="py-2 text-gray-600">Poids moyen</td><td className="font-bold">{volaille.stats.poids_moyen}</td></tr>
                                <tr><td className="py-2 text-gray-600">Rentabilité</td><td className="font-bold text-green-600">{volaille.stats.rentabilite}</td></tr>
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
                                <tr><td className="py-2 text-gray-600">Espèces</td><td className="font-bold">{aquaculture.especes.join(', ')}</td></tr>
                                <tr><td className="py-2 text-gray-600">Bassins</td><td className="font-bold">{aquaculture.bassins}</td></tr>
                                <tr><td className="py-2 text-gray-600">Production/an</td><td className="font-bold">{aquaculture.production_annuelle}</td></tr>
                                <tr><td className="py-2 text-gray-600">Taux survie</td><td className="font-bold text-green-600">{aquaculture.stats.taux_survie}</td></tr>
                                <tr><td className="py-2 text-gray-600">Poids Tilapia</td><td className="font-bold">{aquaculture.stats.poids_moyen_tilapia}</td></tr>
                                <tr><td className="py-2 text-gray-600">Rentabilité</td><td className="font-bold text-green-600">{aquaculture.stats.rentabilite}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Services */}
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
