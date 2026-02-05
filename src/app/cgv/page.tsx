import React from 'react';
import { Container, Section } from '@/components/ui/Container';

export default function CGV() {
    return (
        <Section spacing="base" className="bg-white">
            <Container size="md">
                <h1 className="text-3xl font-heading font-bold mb-8">Conditions Générales de Vente (CGV)</h1>
                <p className="text-sm text-gray-500 mb-8 italic">Dernière mise à jour : Janvier 2026</p>

                <div className="prose prose-green max-w-none space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Objet</h2>
                        <p>
                            Les présentes conditions régissent les ventes de produits (paniers bio, épicerie) et services (ateliers, formations) par la société TEDSAI AI VENTURE SARL.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. Prix</h2>
                        <p>
                            Les prix de nos produits sont indiqués en Francs CFA (XAF) toutes taxes comprises (TTC).
                            TEDSAI se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Commandes</h2>
                        <p>
                            Vous pouvez passer commande :
                            <ul className="list-disc pl-5 mt-2">
                                <li>Sur Internet : www.tedsai.cm</li>
                                <li>Par WhatsApp : via notre assistant virtuel dédié</li>
                            </ul>
                            Les informations contractuelles sont présentées en langue française.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Paiement</h2>
                        <p>
                            Le règlement de vos achats s'effectue principalement par Mobile Money (Orange Money, MTN Mobile Money) ou en espèces à la livraison (sous conditions).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">5. Livraison</h2>
                        <p>
                            Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande, dans la zone géographique convenue (Yaoundé Centre et périphérie proche).
                            Les délais de livraison sont donnés à titre indicatif.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">6. Rétractation & Réclamations</h2>
                        <p>
                            Concernant les produits périssables (légumes frais, plats cuisinés), le droit de rétractation ne peut être exercé.
                            Toutefois, en cas de produit non conforme ou détérioré, merci de contacter le service client sous 24h avec photo à l'appui pour un remplacement ou un avoir.
                        </p>
                    </section>
                </div>
            </Container>
        </Section>
    );
}
