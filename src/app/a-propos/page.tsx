
import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'À Propos - TEDSAI Complex',
};

export default function AProposPage() {
    return (
        <>
            <section className="hero" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
                <div className="hero-content container fade-in-up">
                    <h1>À Propos de TEDSAI</h1>
                    <p>Innovation • Durabilité • Impact</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Notre Vision</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', fontSize: '1.1rem', color: '#555' }}>
                    Le <strong>Complex TEDSAI</strong> est né d'une ambition : unifier l'intelligence artificielle et les
                    besoins fondamentaux de l'Afrique (agriculture, alimentation, emploi). Nous bâtissons un écosystème où la technologie
                    sert l'humain et la nature, de la production (SelecTED Gardens) à la transformation (viTEDia)
                    jusqu'à l'optimisation par l'IA.
                </p>
            </section>

            <section className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
                <p><em>Page en cours d'enrichissement. L'histoire continue...</em></p>
                <Link href="/contact" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Nous Contacter
                </Link>
            </section>
        </>
    );
}
