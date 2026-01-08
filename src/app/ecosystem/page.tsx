'use client';

import React from 'react';
import Link from 'next/link';
import './ecosystem.css';

const Ecosystem = () => {
    const poles = [
        {
            title: 'Intelligence Artificielle',
            icon: 'fa-solid fa-brain',
            color: 'var(--color-ecosystem-secondary)',
            desc: "Le cerveau du complexe. L'IA pilote l'ensemble de l'écosystème : optimisation des stocks, prédiction des récoltes, régulation de l'irrigation et solutions PME.",
            link: '/solutions-ia'
        },
        {
            title: 'Agriculture Urbaine',
            icon: 'fa-solid fa-leaf',
            color: '#2D5A27',
            desc: "Production maraîchère au cœur de Yaoundé. Tomates, laitues et herbes aromatiques 100% traçables. Zéro pesticide, circuit ultra-court.",
            link: '/garden'
        },
        {
            title: 'Élevage Traçable',
            icon: 'fa-solid fa-drumstick-bite',
            color: '#D35400',
            desc: "Poulet et poisson élevés dans des conditions optimales. Traçabilité complète de la naissance à l'assiette pour viTEDia et l'épicerie.",
            link: '/elevage'
        },
        {
            title: 'Restaurant viTEDia',
            icon: 'fa-solid fa-utensils',
            color: '#8B1E3F',
            desc: "Gastronomie camerounaise revisitée. Chaque plat raconte l'histoire de ses ingrédients : du jardin à l'assiette en quelques mètres.",
            link: '/vitedia'
        },
        {
            title: 'Épicerie SelecTED',
            icon: 'fa-solid fa-pepper-hot',
            color: '#B68D40',
            desc: "Épices des principaux mets locaux (piment, gingembre, ail, oignon pays...) et produits frais non cuits issus de notre élevage. Circuit court, fraîcheur garantie, prix justes.",
            link: '/shop'
        }
    ];

    const history = [
        { year: '2021', text: "L'idée naît : et si l'IA pouvait servir le concret ? Lancement de la R&D." },
        { year: '2022', text: "TEDSAI IA signe ses premiers clients PME pour l'automatisation." },
        { year: '2023', text: "Création de SelecTED Gardens : 2 hectares défrichés en ville." },
        { year: '2024', text: "Ouverture de viTEDia et lancement de l'écosystème complet." }
    ];

    return (
        <>
            {/* Hero */}
            <section className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(10,36,99,0.8), rgba(10,36,99,0.5)), url("https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")'
            }}>
                <div className="hero-content container fade-in-up">
                    <h1 className="hero-title">Notre Vision</h1>
                    <p className="hero-desc">Où l'Intelligence Artificielle Rencontre la Nature et la Gastronomie.</p>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="container section-padding text-center">
                <h2 className="section-title text-primary">Une Boucle Vertueuse</h2>
                <p className="section-desc">
                    TEDSAI Complex n'est pas une simple entreprise, c'est un laboratoire vivant où cinq mondes fusionnent. L'Intelligence Artificielle optimise la production de notre Jardin Urbain et de notre Élevage. Le Jardin et l'Élevage nourrissent notre Restaurant viTEDia et notre Épicerie. Le Restaurant génère des données et des déchets organiques qui retournent alimenter l'IA, le Jardin et l'Élevage. C'est l'économie circulaire à l'ère du numérique.
                </p>
            </section>

            {/* Poles Section */}
            <section style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }} className="section-padding">
                <div className="container">
                    <h2 className="section-title text-primary text-center mb-4">5 Pôles Interconnectés</h2>
                    <div className="poles-grid">
                        {poles.map((pole, idx) => (
                            <div key={idx} className="value-card pole-card" style={{ borderTop: `5px solid ${pole.color}` }}>
                                <i className={`${pole.icon} value-icon`} style={{ color: pole.color }}></i>
                                <h3 className="card-title text-primary">{pole.title}</h3>
                                <p className="card-desc">{pole.desc}</p>
                                <Link href={pole.link} className="btn-text" style={{ color: pole.color }}>
                                    En savoir plus <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section style={{ background: '#fff' }} className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center mb-3">Notre Histoire</h2>
                    <div className="timeline">
                        {history.map((item, idx) => (
                            <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="content">
                                    <h3 className="card-title text-primary">{item.year}</h3>
                                    <p className="card-desc">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container section-padding">
                <h2 className="section-title text-center mb-4">Nos Valeurs</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <i className="fa-solid fa-lightbulb value-icon"></i>
                        <h3>Innovation Pragmatique</h3>
                        <p className="card-desc">L'IA doit résoudre de vrais problèmes du quotidien.</p>
                    </div>
                    <div className="value-card">
                        <i className="fa-solid fa-recycle value-icon"></i>
                        <h3>Durabilité</h3>
                        <p className="card-desc">Zéro déchet, zéro pesticide, circuit 100% court.</p>
                    </div>
                    <div className="value-card">
                        <i className="fa-solid fa-hand-holding-heart value-icon"></i>
                        <h3>Humain d'Abord</h3>
                        <p className="card-desc">La technologie au service de l'épanouissement humain.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Ecosystem;
