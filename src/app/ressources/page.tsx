'use client';

import React from 'react';
// @ts-ignore
import data from '../../../assets/data/resources.json';

export default function RessourcesPage() {
    const resources = data.resources;

    const downloadResource = (id: string, title: string) => {
        const email = window.prompt("Entrez votre email pour recevoir le document :");
        if (email && email.includes('@')) {
            const messages = JSON.parse(localStorage.getItem('tedsai_messages') || '[]');
            messages.unshift({
                id: 'resource_' + Date.now(),
                name: 'Téléchargement Ressource',
                email: email,
                interest: 'ressources',
                message: `Téléchargement : ${title}`,
                date: new Date().toISOString()
            });
            localStorage.setItem('tedsai_messages', JSON.stringify(messages));
            alert(`Merci ! Le lien de téléchargement a été envoyé à ${email}.`);
        } else if (email) {
            alert("Email invalide.");
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-content container fade-in-up">
                    <h1>Ressources Gratuites</h1>
                    <p>Guides • Checklists • Modèles • Baromètres</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Outils Pratiques pour Réussir</h2>
                <p style={{ maxWidth: '700px', margin: '0 auto', color: '#666' }}>
                    Téléchargez nos ressources gratuites : guides complets, checklists, modèles Excel.
                    Conçus par nos experts pour vous faire gagner du temps.
                </p>
            </section>

            <section className="container">
                <div className="prod-grid" id="resources-container">
                    {resources.map((resource: any) => (
                        <div key={resource.id} className="prod-card">
                            <i className={`fa-solid ${resource.icon} prod-icon`} style={{ color: resource.color, fontSize: '3rem' }}></i>
                            <h3>{resource.title}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', margin: '1rem 0' }}>{resource.description}</p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
                                <span><i className="fa-solid fa-file"></i> {resource.type}</span>
                                {resource.pages && <span><i className="fa-solid fa-book-open"></i> {resource.pages} pages</span>}
                            </div>
                            <button className="btn btn-primary" onClick={() => downloadResource(resource.id, resource.title)} style={{ width: '100%' }}>
                                <i className="fa-solid fa-download"></i> Télécharger
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
