
import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Le Lab - TEDSAI Complex',
};

export default function BlogPage() {
    return (
        <>
            <section className="hero" style={{ background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)' }}>
                <div className="hero-content container fade-in-up">
                    <h1>Le Lab TEDSAI</h1>
                    <p>Blog • Recherche • Actualités</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <i className="fa-solid fa-flask" style={{ fontSize: '3rem', color: '#8e44ad', marginBottom: '1rem' }}></i>
                <h2>Nos Dernières Expérimentations</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Découvrez nos avancées sur l'agriculture connectée de Yaoundé et nos modèles d'IA prédictive pour la météo
                    locale.
                </p>
                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', display: 'inline-block' }}>
                    <p><strong>Article à la Une :</strong></p>
                    <h3>Comment l'IA réduit le gaspillage alimentaire chez viTEDia ?</h3>
                    <p><em>Publié le 01 Janvier 2026</em></p>
                    {/* Note: This link was '#' in the original. Ideally leads to a specific article. */}
                    <Link href="#" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        Lire l'article
                    </Link>
                </div>
            </section>
        </>
    );
}
