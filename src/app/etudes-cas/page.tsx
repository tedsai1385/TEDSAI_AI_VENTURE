
import React from 'react';
import Link from 'next/link';
// @ts-ignore
import data from '../../../assets/data/case-studies.json';

export const metadata = {
    title: 'Études de Cas - TEDSAI Complex',
};

export default function CaseStudiesPage() {
    const caseStudies = data.case_studies;

    return (
        <>
            <section className="hero">
                <div className="hero-content container fade-in-up">
                    <h1>Études de Cas</h1>
                    <p>Résultats Concrets • Avant/Après • ROI Mesurable</p>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 0' }}>
                <div id="case-studies-container">
                    {caseStudies.map((cs: any) => (
                        <div key={cs.id} style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ color: 'var(--color-primary)', margin: '0' }}>{cs.client}</h2>
                                    <p style={{ color: '#666', margin: '0.5rem 0 0' }}>{cs.sector}</p>
                                </div>
                                <span style={{ background: 'var(--color-secondary)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>{cs.date}</span>
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#e74c3c', margin: '0 0 0.5rem' }}><i className="fa-solid fa-exclamation-circle"></i> Défi</h4>
                                <p style={{ margin: '0' }}>{cs.challenge}</p>
                            </div>

                            <div style={{ background: '#e8f5e9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#27ae60', margin: '0 0 0.5rem' }}><i className="fa-solid fa-lightbulb"></i> Solution</h4>
                                <p style={{ margin: '0' }}>{cs.solution}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                {Object.entries(cs.results).map(([key, value]) => (
                                    <div key={key} style={{ textAlign: 'center', background: 'white', padding: '1rem', borderRadius: '8px', border: '2px solid var(--color-primary)' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{value as string}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
                                <p style={{ margin: '0', fontStyle: 'italic' }}>"{cs.testimonial}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container"
                style={{ background: 'var(--color-primary)', color: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', marginBottom: '4rem' }}>
                <h2>Votre Projet, Notre Expertise</h2>
                <p style={{ margin: '1rem 0' }}>Discutons de vos défis et objectifs. Audit gratuit.</p>
                <Link href="/contact" className="btn btn-secondary">Demander un Audit</Link>
            </section>
        </>
    );
}
