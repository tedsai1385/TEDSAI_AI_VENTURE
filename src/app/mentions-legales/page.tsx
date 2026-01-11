import React from 'react';

export default function MentionsLegales() {
    return (
        <div className="container" style={{ padding: '8rem 0 4rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Mentions Légales</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>1. ÉDITEUR DU SITE</h2>
                <p><strong>Raison sociale :</strong> TEDSAI Complex SARL</p>
                <p><strong>Siège social :</strong> Yaoundé, Cameroun</p>
                <p><strong>Capital social :</strong> [À compléter] FCFA</p>
                <p><strong>RCCM :</strong> [À compléter]</p>
                <p><strong>NIF :</strong> [À compléter]</p>
                <p><strong>Téléphone :</strong> +237 XXX XXX XXX</p>
                <p><strong>Email :</strong> contact@tedsai.cm</p>
                <p><strong>Directeur de la publication :</strong> Martial TEDSAI</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>2. HÉBERGEMENT</h2>
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789</p>
                <p><strong>Téléphone :</strong> +1 (559) 288-7060</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>3. PROPRIÉTÉ INTELLECTUELLE</h2>
                <p>
                    L'ensemble du site (structure, textes, images, logos, vidéos) est protégé par le droit d'auteur.
                    Toute reproduction sans autorisation est interdite.
                </p>
                <p style={{ marginTop: '1rem' }}>
                    <strong>Marques déposées :</strong><br />
                    • TEDSAI™<br />
                    • viTEDia™<br />
                    • SelecTED Garden™
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>4. DONNÉES PERSONNELLES & COOKIES</h2>
                <p>
                    Veuillez consulter notre <a href="/confidentialite" style={{ color: 'var(--color-secondary)' }}>Politique de Confidentialité</a> pour plus d'informations.
                </p>
            </section>

            <section>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>5. CONTACT</h2>
                <p>
                    Pour toute question juridique : <a href="mailto:legal@tedsai.cm" style={{ color: 'var(--color-secondary)' }}>legal@tedsai.cm</a>
                </p>
            </section>
        </div>
    );
}
