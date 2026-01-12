'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './garden.css';

const Garden = () => {
    const [traceCode, setTraceCode] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [traceResult, setTraceResult] = useState<any>(null);

    const [recentHarvests, setRecentHarvests] = useState<any[]>([]);

    useEffect(() => {
        const fetchHarvests = async () => {
            try {
                const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
                const { db } = await import('@/lib/firebase/config');

                const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'), limit(6));
                const snapshot = await getDocs(q);
                setRecentHarvests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching harvests:", error);
            }
        };
        fetchHarvests();
    }, []);

    const handleTrace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!traceCode.trim()) return;

        setIsSearching(true);
        setSearchError(null);
        setTraceResult(null);

        try {
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase/config');

            // Try to find the document by ID (Trace Code)
            const docRef = doc(db, 'garden_products', traceCode.trim());
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setTraceResult({
                    name: data.name,
                    origin: data.parcel || 'SelecTED Garden',
                    plantedAt: 'Cycle Court (Automatique)', // Could be added to data model
                    harvestedAt: data.harvestDate?.toDate().toLocaleDateString('fr-FR') || new Date().toLocaleDateString('fr-FR'),
                    technician: 'Équipe Jardin',
                    destination: 'Vente Directe / Restaurant',
                    cert: data.cert,
                    status: data.status
                });
                setShowResult(true);
                setTimeout(() => {
                    const element = document.getElementById('trace-result');
                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                setSearchError("Aucun produit trouvé avec ce code de traçabilité.");
            }
        } catch (err) {
            console.error(err);
            setSearchError("Erreur lors de la recherche. Vérifiez votre connexion.");
        } finally {
            setIsSearching(false);
        }
    };

    const categories = [
        { icon: 'fa-solid fa-pepper-hot', name: 'Épices Rares', desc: 'Poivre de Penja, Gingembre, Curcuma bio.', link: '/shop' },
        { icon: 'fa-solid fa-leaf', name: 'Légumes Feuilles', desc: 'Ndolé, Biteskout, Basilic frais.', link: null },
        { icon: 'fa-solid fa-carrot', name: 'Maraîchage', desc: 'Tomates, Carottes, Poivrons sans pesticides.', link: null },
        { icon: 'fa-solid fa-egg', name: 'Élevage Local', desc: 'Poulets fermiers et œufs du jour.', link: '/elevage' }
    ];

    return (
        <>
            {/* Hero */}
            <section className="hero-garden">
                <div className="container hero-content fade-in-up">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>La Base Agricole du Complexe</h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Production Locale • Élevage • Traçabilité Totale</p>
                </div>
            </section>

            {/* Production Categories */}
            <section className="container" style={{ padding: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--color-garden-primary)', marginBottom: '3rem', fontSize: '2.5rem' }}>Nos Filières</h2>
                <div className="prod-grid">
                    {categories.map((prod, idx) => (
                        prod.link ? (
                            <Link key={idx} href={prod.link} className="prod-card block hover:shadow-xl transition-shadow cursor-pointer">
                                <div className="prod-icon">
                                    <i className={prod.icon}></i>
                                </div>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--color-garden-primary)' }}>{prod.name} <i className="fa-solid fa-arrow-right text-sm ml-2"></i></h3>
                                <p style={{ color: '#666' }}>{prod.desc}</p>
                            </Link>
                        ) : (
                            <div key={idx} className="prod-card">
                                <div className="prod-icon">
                                    <i className={prod.icon}></i>
                                </div>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--color-garden-primary)' }}>{prod.name}</h3>
                                <p style={{ color: '#666' }}>{prod.desc}</p>
                            </div>
                        )
                    ))}
                </div>
            </section>

            {/* Real-time Inventory */}
            {recentHarvests.length > 0 && (
                <section className="container" style={{ paddingBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                        <i className="fa-solid fa-basket-shopping" style={{ color: 'var(--color-garden-primary)', marginRight: '10px' }}></i>
                        Récoltes du Jour (En direct)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentHarvests.map((harvest) => (
                            <div key={harvest.id} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full uppercase">{harvest.parcel || 'Jardin'}</span>
                                    <span className="text-xs font-bold text-gray-400">#{harvest.id.slice(0, 6)}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{harvest.name}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-2 h-2 rounded-full ${harvest.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    <span className="text-sm text-gray-500 capitalize">{harvest.status === 'optimal' ? 'Qualité Premium' : 'Quality Standard'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <span className="font-mono font-bold text-gray-700">{harvest.stock}</span>
                                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{harvest.cert || 'BIO'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Spices Project Teaser */}
            <section style={{ background: 'var(--color-garden-primary)', color: 'white', padding: '5rem 0' }}>
                <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', opacity: 0.8 }}>Prochainement</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>The Spices Project</h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Nous préparons une plateforme dédiée à l'exportation des épices rares du Cameroun.
                            Traçabilité par Blockchain, certification Bio et commerce équitable direct producteur.
                        </p>
                        <button className="btn" style={{ background: 'white', color: 'var(--color-garden-primary)', fontWeight: 'bold' }}>S'inscrire à l'accès anticipé</button>
                    </div>
                    <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
                        <i className="fa-solid fa-earth-africa" style={{ fontSize: '10rem', opacity: 0.2 }}></i>
                    </div>
                </div>
            </section>

            {/* Traceability Section */}
            <section className="traceability-section">
                <div className="container">
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--color-garden-primary)' }}>Suivez le Parcours de Votre Ingrédient</h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Entrez le code produit présent sur votre ticket ou étiquette.</p>

                    <form onSubmit={handleTrace} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="trace-input"
                            placeholder="Ex: ID du produit (scan QR)"
                            value={traceCode}
                            onChange={(e) => setTraceCode(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-garden" disabled={isSearching}>
                            {isSearching ? 'Recherche...' : 'Tracer'}
                        </button>
                    </form>

                    {searchError && <p style={{ color: 'red', marginTop: '1rem' }}>{searchError}</p>}

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => alert('Ouverture de la caméra... (Simulation)')}
                            style={{ color: 'var(--color-garden-primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            <i className="fa-solid fa-qrcode"></i> Ou scannez un QR Code
                        </button>
                    </div>
                </div>

                {
                    showResult && traceResult && (
                        <div id="trace-result" className="trace-result-container fade-in">
                            <h3 style={{ color: 'var(--color-garden-primary)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Résultat de la Traçabilité</h3>
                            <div style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{traceResult.name}</span>
                                <span style={{ color: '#666' }}>Code: {traceCode}</span>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', gap: '1rem' }}>
                                    <span style={{ color: '#888', fontWeight: 600 }}>ORIGINE</span>
                                    <span><strong>{traceResult.origin}</strong></span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', gap: '1rem' }}>
                                    <span style={{ color: '#888', fontWeight: 600 }}>RÉCOLTE</span>
                                    <span>{traceResult.harvestedAt}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', gap: '1rem' }}>
                                    <span style={{ color: '#888', fontWeight: 600 }}>QUALITÉ</span>
                                    <span className="capitalize">{traceResult.status}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', gap: '1rem' }}>
                                    <span style={{ color: '#888', fontWeight: 600 }}>DESTINATION</span>
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>{traceResult.destination}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.print()}
                                >
                                    Imprimer Fiche
                                </button>
                            </div>
                        </div>
                    )
                }
            </section>

            {/* Partnerships Section */}
            <section className="container" style={{ padding: '5rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Partenariats & Approvisionnement</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
                        <i className="fa-solid fa-handshake" style={{ fontSize: '2.5rem', color: 'var(--color-garden-primary)', marginBottom: '1rem' }}></i>
                        <h3>Hôtels & Restaurants</h3>
                        <p>Devenez partenaire et recevez nos produits ultra-frais chaque matin.</p>
                    </div>
                    <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
                        <i className="fa-solid fa-store" style={{ fontSize: '2.5rem', color: 'var(--color-garden-primary)', marginBottom: '1rem' }}></i>
                        <h3>Points de Vente</h3>
                        <p>Distribuez nos épices SelecTED et nos huiles pressées à froid.</p>
                    </div>
                </div>
            </section>

            {/* Sustainable Section */}
            <section className="container" style={{ padding: '5rem 0', textAlign: 'center', background: '#f9fbf9', borderRadius: '24px', marginBottom: '4rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <i className="fa-solid fa-recycle" style={{ fontSize: '3rem', color: 'var(--color-garden-primary)', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ marginBottom: '1.5rem' }}>Économie Circulaire</h2>
                    <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>
                        Rien ne se perd, tout se transforme. Les biodéchets du restaurant viTEDia sont compostés pour enrichir les sols du SelecTED Garden. L'eau de pluie est collectée et filtrée par IA pour optimiser l'irrigation goutte-à-goutte.
                    </p>
                </div>
            </section>
        </>
    );
};

export default Garden;
