'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    origin: string;
    category: 'epice' | 'volaille' | 'poisson';
    available: boolean;
}

export default function EpiceriePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(
            query(collection(db, 'epicerie_products'), where('available', '==', true)),
            (snap) => {
                const prods = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
                setProducts(prods);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const epices = products.filter(p => p.category === 'epice');
    const produitsFrais = products.filter(p => p.category === 'volaille' || p.category === 'poisson');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Chargement des produits...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="hero" style={{ background: 'linear-gradient(135deg, #D35400 0%, #E67E22 100%)' }}>
                <div className="hero-content container fade-in-up">
                    <h1>TEDSAI Épicerie</h1>
                    <p>Épices Authentiques & Produits Frais</p>
                    <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>Du producteur à votre cuisine. 100% Traçable.</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2 style={{ color: '#D35400', marginBottom: '1rem' }}>Notre Promesse</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#555' }}>
                    Nous sélectionnons les meilleures <strong>épices camerounaises</strong> directement auprès des producteurs.
                    Nos <strong>produits frais</strong> (poulet, poisson, œufs) proviennent de notre propre élevage TEDSAI,
                    garantissant qualité et traçabilité totale.
                </p>
            </section>

            {epices.length > 0 && (
                <section className="container" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nos Épices</h2>
                    <div className="prod-grid" id="epices-container">
                        {epices.map((item) => (
                            <div key={item.id} className="prod-card">
                                <i className="fa-solid fa-pepper-hot prod-icon" style={{ color: '#D35400' }}></i>
                                <h3>{item.name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
                                <div style={{ marginTop: '1rem' }}>
                                    <strong style={{ color: '#D35400', fontSize: '1.2rem' }}>{item.price} FCFA</strong>
                                    <span style={{ color: '#888' }}> / {item.unit}</span>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#27ae60' }}>
                                    <i className="fa-solid fa-map-marker-alt"></i> {item.origin}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {produitsFrais.length > 0 && (
                <section className="container" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Produits Frais</h2>
                    <div className="prod-grid" id="frais-container">
                        {produitsFrais.map((item) => {
                            const icon = item.category === 'volaille' ? 'fa-drumstick-bite' : 'fa-fish';
                            return (
                                <div key={item.id} className="prod-card">
                                    <i className={`fa-solid ${icon} prod-icon`} style={{ color: '#8B4513' }}></i>
                                    <h3>{item.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
                                    <div style={{ marginTop: '1rem' }}>
                                        <strong style={{ color: '#8B4513', fontSize: '1.2rem' }}>{item.price} FCFA</strong>
                                        <span style={{ color: '#888' }}> / {item.unit}</span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#27ae60' }}>
                                        <i className="fa-solid fa-check-circle"></i> {item.origin}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="container" style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
                <h2 style={{ color: '#D35400' }}>Commander</h2>
                <p style={{ margin: '1rem 0' }}>Passez commande par téléphone ou WhatsApp. Livraison à Yaoundé sous 24h.</p>
                <Link href="/contact" className="btn btn-primary" style={{ background: '#D35400' }}>Nous Contacter</Link>
            </section>
        </>
    );
}
