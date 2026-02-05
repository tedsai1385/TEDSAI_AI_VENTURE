import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';

export const PricingTable = () => {
    const plans = [
        {
            name: "Audit Flash",
            price: "50 000",
            period: "one-shot",
            desc: "Diagnostic complet de votre maturité numérique et plan d'action immédiat.",
            features: [
                "Audit des processus actuels",
                "Identification des goulots d'étranglement",
                "Feuille de route IA personnalisée"
            ],
            cta: "Réserver mon Audit",
            color: "border-gray-200",
            popular: false
        },
        {
            name: "Pack Starter",
            price: "200 000",
            period: "mois",
            desc: "L'essentiel pour automatiser votre relation client et piloter votre activité.",
            features: [
                "Chatbot WhatsApp Commercial",
                "CRM Simple connecté",
                "1 Dashboard de pilotage (Ventes/Stock)",
                "Support prioritaire"
            ],
            cta: "Déarrer maintenant",
            color: "border-[var(--color-secondary)] ring-2 ring-[var(--color-secondary)] ring-offset-2",
            popular: true
        },
        {
            name: "Sur Mesure",
            price: "Sur Devis",
            period: "",
            desc: "Transformation digitale complète et intégration profonde.",
            features: [
                "Algorithmes prédictifs spécifiques",
                "Intégration ERP / Comptabilité",
                "Développement d'agents IA autonomes",
                "Formation continue des équipes"
            ],
            cta: "Parler à un Expert",
            color: "border-[var(--color-accent)]",
            popular: false
        }
    ];

    return (
        <Section spacing="lg" className="bg-[var(--color-background)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Investissez dans votre Croissance</h2>
                    <p className="text-gray-600">Tarification transparente. Sans frais cachés. Rentabilisé dès le 1er mois.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            padded
                            className={`relative ${plan.color} ${plan.popular ? 'shadow-2xl scale-105 z-10' : 'shadow-md'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <Badge variant="secondary" className="bg-[var(--color-secondary)] text-white shadow-lg">
                                        Populaire
                                    </Badge>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-2">
                                <span className="text-4xl font-bold text-[var(--color-text-primary)]">{plan.price}</span>
                                {plan.period && <span className="text-gray-500 mb-1">FCFA / {plan.period}</span>}
                            </div>
                            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{plan.desc}</p>

                            <div className="w-full h-px bg-gray-100 mb-6" />

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                fullWidth
                                variant={plan.popular ? 'secondary' : 'outline'}
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    Besoin d'une installation sur site ? <a href="#" className="underline hover:text-[var(--color-secondary)]">Consultez nos tarifs déploiement</a>.
                </div>
            </Container>
        </Section>
    );
};
