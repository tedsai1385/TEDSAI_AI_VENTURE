import React from 'react';
import { Container, Section } from '@/components/ui/Container';

export default function PolitiqueConfidentialite() {
    return (
        <Section spacing="base" className="bg-white">
            <Container size="md">
                <h1 className="text-3xl font-heading font-bold mb-8">Politique de Confidentialité</h1>

                <div className="prose prose-green max-w-none space-y-6 text-gray-700">
                    <p className="lead text-lg">
                        La protection de vos données personnelles est au cœur de nos préoccupations. TEDSAI s'engage à ce que la collecte et le traitement de vos données soient conformes aux lois en vigueur au Cameroun et aux standards internationaux (GDPR).
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Données collectées</h2>
                        <p>
                            Nous collectons les données que vous nous transmettez directement, notamment lors de :
                        </p>
                        <ul className="list-disc pl-5 mt-2">
                            <li>La création de commande (Nom, Téléphone, Adresse)</li>
                            <li>L'inscription à la newsletter (Email)</li>
                            <li>L'utilisation du chatbot (Historique de conversation anonymisé pour entraînement IA)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. Utilisation des données</h2>
                        <p>
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc pl-5 mt-2">
                            <li>Gérer et livrer vos commandes</li>
                            <li>Améliorer nos services et notre IA</li>
                            <li>Vous envoyer des informations pertinentes (si vous avez accepté)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Partage des données</h2>
                        <p>
                            Nous ne vendons <strong>jamais</strong> vos données à des tiers.
                            Elles peuvent être partagées uniquement avec nos prestataires logistiques (livreurs) pour la stricte exécution de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Vos droits</h2>
                        <p>
                            Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données.
                            Pour exercer ce droit, envoyez simplement un email à privacy@tedsai.cm.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">5. Cookies</h2>
                        <p>
                            Ce site utilise des cookies techniques nécessaires au fonctionnement (panier, session).
                            Nous utilisons également des cookies analytiques anonymes pour mesurer l'audience.
                        </p>
                    </section>
                </div>
            </Container>
        </Section>
    );
}
