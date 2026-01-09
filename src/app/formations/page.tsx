'use client';

import React from 'react';
import Link from 'next/link';

export default function FormationsPage() {

    const requestInfo = (formation: string) => {
        const email = window.prompt(`Inscription "${formation}" - Entrez votre email :`);
        if (email && email.includes('@')) {
            const messages = JSON.parse(localStorage.getItem('tedsai_messages') || '[]');
            messages.unshift({
                id: 'formation_' + Date.now(),
                name: 'Demande Formation',
                email: email,
                interest: 'formation',
                message: `Inscription : ${formation}`,
                date: new Date().toISOString()
            });
            localStorage.setItem('tedsai_messages', JSON.stringify(messages));
            alert(`Merci ! Nous vous contactons sous 24h pour finaliser votre inscription à "${formation}".`);
        } else if (email) {
            alert("Email invalide.");
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-content container fade-in-up">
                    <h1>Formations TEDSAI</h1>
                    <p>Montée en Compétences • Pratique • Certifiante</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Notre Catalogue</h2>

                <div className="prod-grid">
                    <div className="prod-card">
                        <i className="fa-solid fa-brain prod-icon" style={{ color: 'var(--color-primary)' }}></i>
                        <h3>IA pour PME</h3>
                        <p style={{ color: '#666', margin: '1rem 0' }}>Comprendre et déployer l'IA dans votre entreprise. Cas pratiques, outils no-code.</p>
                        <div style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                            <div><i className="fa-solid fa-clock"></i> 3 jours (21h)</div>
                            <div><i className="fa-solid fa-users"></i> Max 12 participants</div>
                        </div>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '1.3rem' }}>150 000 FCFA</strong>
                        <button className="btn btn-primary" onClick={() => requestInfo('IA PME')}
                            style={{ width: '100%', marginTop: '1rem' }}>S'inscrire</button>
                    </div>

                    <div className="prod-card">
                        <i className="fa-solid fa-chart-line prod-icon" style={{ color: '#16A085' }}></i>
                        <h3>Data & Tableaux de Bord</h3>
                        <p style={{ color: '#666', margin: '1rem 0' }}>Créer des dashboards pour piloter votre activité. Excel avancé, Power BI.</p>
                        <div style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                            <div><i className="fa-solid fa-clock"></i> 2 jours (14h)</div>
                            <div><i className="fa-solid fa-users"></i> Max 15 participants</div>
                        </div>
                        <strong style={{ color: '#16A085', fontSize: '1.3rem' }}>100 000 FCFA</strong>
                        <button className="btn btn-primary" onClick={() => requestInfo('Data')}
                            style={{ width: '100%', marginTop: '1rem', background: '#16A085' }}>S'inscrire</button>
                    </div>

                    <div className="prod-card">
                        <i className="fa-solid fa-seedling prod-icon" style={{ color: 'var(--color-garden-primary)' }}></i>
                        <h3>Agriculture Urbaine Rentable</h3>
                        <p style={{ color: '#666', margin: '1rem 0' }}>Techniques, gestion de l'eau, commercialisation. Visite terrain incluse.</p>
                        <div style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                            <div><i className="fa-solid fa-clock"></i> 3 jours (21h)</div>
                            <div><i className="fa-solid fa-users"></i> Max 10 participants</div>
                        </div>
                        <strong style={{ color: 'var(--color-garden-primary)', fontSize: '1.3rem' }}>120 000 FCFA</strong>
                        <button className="btn btn-primary" onClick={() => requestInfo('Agriculture')}
                            style={{ width: '100%', marginTop: '1rem', background: 'var(--color-garden-primary)' }}>S'inscrire</button>
                    </div>

                    <div className="prod-card">
                        <i className="fa-solid fa-drumstick-bite prod-icon" style={{ color: '#8B4513' }}></i>
                        <h3>Élevage : Poulet & Poisson</h3>
                        <p style={{ color: '#666', margin: '1rem 0' }}>Démarrage, alimentation, biosécurité, rentabilité. Pratique sur site.</p>
                        <div style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                            <div><i className="fa-solid fa-clock"></i> 3 jours (21h)</div>
                            <div><i className="fa-solid fa-users"></i> Max 10 participants</div>
                        </div>
                        <strong style={{ color: '#8B4513', fontSize: '1.3rem' }}>75 000 FCFA</strong>
                        <button className="btn btn-primary" onClick={() => requestInfo('Élevage')}
                            style={{ width: '100%', marginTop: '1rem', background: '#8B4513' }}>S'inscrire</button>
                    </div>
                </div>
            </section>

            <section className="container" style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '12px', margin: '4rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Formations Sur-Mesure</h2>
                <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
                    Besoin d'une formation adaptée à votre équipe ? Nous concevons des programmes personnalisés.
                </p>
                <div style={{ textAlign: 'center' }}>
                    <Link href="/contact" className="btn btn-primary">Demander un Devis</Link>
                </div>
            </section>
        </>
    );
}
