import React from 'react';

export default function CGU() {
    return (
        <div className="container" style={{ padding: '8rem 0 4rem', maxWidth: '800px', lineHeight: '1.6' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Conditions Générales d'Utilisation</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>1. OBJET ET ACCEPTATION</h2>
                <p>Les présentes CGU régissent l'utilisation du site tedsai.com. L'accès au site implique l'acceptation pleine et entière de ces conditions.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>2. SERVICES PROPOSÉS</h2>
                <p>Le site présente les activités de TEDSAI Complex (IA, Restaurant, Jardin), permet les réservations en ligne, les demandes de devis, et propose un assistant conversationnel TED.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>3. UTILISATION ACCEPTABLE</h2>
                <p>Il est interdit d'utiliser le site à des fins illégales, de tenter de compromettre sa sécurité, de scraper les données massivement ou de nuire à la réputation de TEDSAI Complex.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>4. RÉSERVATIONS viTEDia</h2>
                <p>Toute réservation est ferme après confirmation par email ou SMS. Les annulations sont gratuites jusqu'à 24h avant l'heure prévue. En cas de no-shows répétés, l'accès au service peut être restreint.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>5. ASSISTANT TED</h2>
                <p>TED est un outil d'assistance conversationnelle. Les réponses ne constituent pas un conseil juridique ou médical. Les conversations peuvent être enregistrées pour améliorer la qualité du service.</p>
            </section>

            <section>
                <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>6. DROIT APPLICABLE</h2>
                <p>Ces conditions sont régies par le droit camerounais. Tout litige sera porté devant les tribunaux de Yaoundé après tentative de résolution amiable.</p>
            </section>
        </div>
    );
}
