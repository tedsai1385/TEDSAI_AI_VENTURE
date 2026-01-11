import React from 'react';

export default function Confidentialite() {
    return (
        <div className="container" style={{ padding: '8rem 0 4rem', maxWidth: '800px', lineHeight: '1.6' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Politique de Confidentialité</h1>
            <p style={{ fontStyle: 'italic', marginBottom: '2rem' }}>Dernière mise à jour : 11 Janvier 2026</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>1. QUI SOMMES-NOUS ?</h2>
                <p>TEDSAI Complex SARL est responsable du traitement de vos données. Pour toute question, contactez-nous à <a href="mailto:privacy@tedsai.cm">privacy@tedsai.cm</a>.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>2. DONNÉES COLLECTÉES</h2>
                <p>Nous collectons les données que vous nous fournissez directement (nom, email, téléphone, détails de réservation, messages via TED) ou via des outils automatiques (IP, type de navigateur, pages visitées - via cookies).</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>3. FINALITÉS</h2>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                    <li>Traiter vos réservations au restaurant viTEDia</li>
                    <li>Répondre à vos demandes de contact et devis</li>
                    <li>Améliorer votre expérience sur le site et l'assistant TED</li>
                    <li>Analyser le trafic de manière anonymisée</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>4. PARTAGE ET CONSERVATION</h2>
                <p>Nous ne vendons jamais vos données. Le partage est limité à nos prestataires techniques (hébergement, email, paiement Stripe). Nous conservons vos données selon les durées légales (ex: 3 ans pour les réservations).</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>5. VOS DROITS</h2>
                <p>Vous disposez d'un droit d'accès, de rectification, de suppression, et de portabilité de vos données. Contactez-nous à <a href="mailto:privacy@tedsai.cm">privacy@tedsai.cm</a> pour toute demande (réponse sous 30 jours max).</p>
            </section>

            <section>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>6. COOKIES</h2>
                <p>Nous utilisons des cookies essentiels (fonctionnement) et optionnels (analytics, préférences). Vous pouvez gérer vos préférences via les paramètres de votre navigateur.</p>
            </section>
        </div>
    );
}
