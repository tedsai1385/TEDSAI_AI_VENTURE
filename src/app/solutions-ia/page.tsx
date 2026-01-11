'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './solutions-ia.css';

const SolutionsIA = () => {
  const [activeTab, setActiveTab] = useState('facturation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handlePlaygroundClick = () => {
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner une facture.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulation d'analyse OCR
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        vendor: "FOURNISSEUR EXEMPLE SARL",
        date: "12/01/2026",
        total: "145 000 FCFA",
        tax: "27 912 FCFA",
        items: [
          { desc: "Maintenance Serveur", qty: 1, price: "100 000" },
          { desc: "Licence Logiciel", qty: 5, price: "45 000" }
        ],
        confidence: "99.8%"
      });
    }, 3000);
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Hero Section */}
      <section className="hero hero-ia">
        <div className="hero-content container fade-in-up" style={{ textAlign: 'center' }}>
          <h1>Le Cerveau du Complexe</h1>
          <p>Intelligence Artificielle pour PME & Optimisation Interne</p>
        </div>
      </section>

      {/* Intro / Vision Section */}
      <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>Notre Double Mission</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: 'var(--color-secondary)' }}>
              <i className="fa-solid fa-network-wired"></i> <span>Interne</span>
            </h3>
            <p>TEDSAI IA pilote l'ensemble du complexe. Gestion des stocks du restaurant, régulation de l'irrigation du jardin, et analyse des flux en temps réel.</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: 'var(--color-secondary)' }}>
              <i className="fa-solid fa-briefcase"></i> <span>Externe</span>
            </h3>
            <p>Nous mettons cette même puissance technologique au service des PME locales pour automatiser, sécuriser et accélérer leur croissance.</p>
          </div>
        </div>
      </section>

      {/* Problems Tabs */}
      <section className="container tabs-container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>Vos Défis, Nos Solutions</h2>

        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'facturation' ? 'active' : ''}`} onClick={() => setActiveTab('facturation')}>🧾 Facturation</button>
          <button className={`tab-btn ${activeTab === 'stocks' ? 'active' : ''}`} onClick={() => setActiveTab('stocks')}>📦 Stocks</button>
          <button className={`tab-btn ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>💬 Service Client</button>
        </div>

        <div className={`tab-content ${activeTab === 'facturation' ? 'active' : ''}`}>
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3>Automatisation de la Facturation</h3>
              <p style={{ marginTop: '1rem' }}>Vos équipes passent 15h/semaine à saisir des factures manuellement ? L'IA TEDSAI scanne, extrait et intègre automatiquement vos factures dans votre ERP.</p>
              <ul style={{ marginTop: '1rem', listStyle: 'circle', paddingLeft: '1.5rem' }}>
                <li>Reconnaissance OCR 99.8%</li>
                <li>Intégration Sage, QuickBooks, Odoo</li>
                <li>Détection des erreurs et doublons</li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: '300px', background: '#f0f4f8', padding: 'var(--space-md)', borderRadius: '8px' }}>
              <h4>Résultats Client</h4>
              <p><strong>Supermarché Local :</strong></p>
              <p className="stats" style={{ color: 'var(--color-secondary)' }}>
                <span>ROI :</span>
                <span>5 500 000 FCFA économisés/an</span>
              </p>
              <p>Temps de gestion divisé par 8.</p>
            </div>
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'stocks' ? 'active' : ''}`}>
          <h3>Gestion Intelligente des Stocks</h3>
          <p>Anticipez la demande et réduisez le gaspillage grâce à nos algorithmes prédictifs.</p>
        </div>

        <div className={`tab-content ${activeTab === 'service' ? 'active' : ''}`}>
          <h3>Service Client 360°</h3>
          <p>Chatbots intelligents disponibles 24/7 pour répondre à vos clients instantanément.</p>
        </div>
      </section>

      {/* AI Playground Simulation */}
      <section id="playground" style={{ background: '#eef2f6', padding: 'var(--space-xl) 0', marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <div className="container">
          <h2>IA Playground</h2>
          <p>Testez notre technologie de reconnaissance de documents en temps réel.</p>

          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '800px',
            minHeight: '400px',
            margin: '2rem auto',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!analysisResult && !isAnalyzing ? (
              <div style={{ border: '2px dashed #ccc', padding: '3rem', borderRadius: '8px', cursor: 'pointer', width: '100%' }} onClick={() => document.getElementById('file-upload')?.click()}>
                <i className="fa-solid fa-cloud-upload-alt fa-3x" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedFile ? selectedFile.name : "Cliquez ou glissez une facture (Images/PDF)"}</p>
                <input type="file" id="file-upload" style={{ display: 'none' }} accept="image/*,application/pdf" onChange={handleFileChange} />
              </div>
            ) : isAnalyzing ? (
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }}></div>
                <h3>Analyse par l'IA en cours...</h3>
                <p>Extraction des données structurées via OCR multimodal</p>
                <style jsx>{`
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: scale(1.1) rotate(360deg); } }
                `}</style>
              </div>
            ) : (
              <div className="analysis-result fade-in" style={{ width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Résultat de l'analyse</h3>
                  <span style={{ background: '#27ae60', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>Confiance : {analysisResult.confidence}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <p><strong>Fournisseur :</strong> {analysisResult.vendor}</p>
                  <p><strong>Date :</strong> {analysisResult.date}</p>
                  <p><strong>Total TTC :</strong> {analysisResult.total}</p>
                  <p><strong>Dont TVA :</strong> {analysisResult.tax}</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Articles détectés :</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Qté</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Prix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.items.map((item: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '8px' }}>{item.desc}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>{item.price} F</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '2rem' }} onClick={() => setSelectedFile(null)}>Nouvelle analyse</button>
              </div>
            )}
          </div>

          {!analysisResult && (
            <button className="btn btn-primary" onClick={handlePlaygroundClick} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyse...' : "Lancer l'analyse intelligente"}
            </button>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--color-primary)' }}>Débuter maintenant</h2>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">325 000 FCFA<span style={{ fontSize: '1rem', color: '#666' }}>/mois</span></div>
            <p>Pour PME 1-10 employés</p>
            <Link href="/contact?plan=starter" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Choisir</Link>
          </div>

          <div className="pricing-card featured">
            <div style={{ background: 'var(--color-secondary)', color: 'white', position: 'absolute', top: 0, left: 0, width: '100%', padding: '4px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px 8px 0 0' }}>POPULAIRE</div>
            <h3 style={{ marginTop: '1.5rem' }}>Business</h3>
            <div className="price">850 000 FCFA<span style={{ fontSize: '1rem', color: '#666' }}>/mois</span></div>
            <p>Pour PME 10-50 employés</p>
            <Link href="/contact?plan=business" className="btn btn-primary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Choisir</Link>
          </div>

          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Sur Devis</div>
            <p>Pour +50 employés</p>
            <Link href="/contact?plan=enterprise" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Contacter</Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="container" style={{ padding: '4rem 0', background: '#f9f9f9', borderRadius: '12px', marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ressources Utiles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="pricing-card" style={{ textAlign: 'left' }}>
            <i className="fa-solid fa-file-pdf" style={{ color: '#e74c3c', fontSize: '2rem', marginBottom: '1rem' }}></i>
            <h3>Livre Blanc IA & PME</h3>
            <p>Guide complet pour digitaliser votre entreprise au Cameroun.</p>
            <button className="btn-text" style={{ color: 'var(--color-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginTop: '1rem' }}>Télécharger (PDF)</button>
          </div>
          <div className="pricing-card" style={{ textAlign: 'left' }}>
            <i className="fa-solid fa-file-excel" style={{ color: '#27ae60', fontSize: '2rem', marginBottom: '1rem' }}></i>
            <h3>Calculateur ROI</h3>
            <p>Fichier Excel pour calculer la rentabilité de l'automatisation.</p>
            <button className="btn-text" style={{ color: 'var(--color-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginTop: '1rem' }}>Télécharger (XLS)</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsIA;
