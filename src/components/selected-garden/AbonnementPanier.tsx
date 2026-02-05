'use client';

import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, ShoppingBasket } from 'lucide-react';

export const AbonnementPanier = () => {
    const plans = [
        {
            name: "Panier Découverte",
            price: "15 000",
            period: "mois",
            features: [
                "4 Paniers (1 par semaine)",
                "3kg de légumes mélangés",
                "1 bouquet aromatique",
                "Recettes WhatsApp"
            ],
            color: "border-gray-200",
            badge: null
        },
        {
            name: "Panier Famille",
            price: "35 000",
            period: "mois",
            features: [
                "8kg de légumes / semaine",
                "2 bouquets aromatiques",
                "1kg Tilapia offert / mois",
                "Livraison Prioritaire"
            ],
            color: "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2",
            badge: "Populaire"
        },
        {
            name: "Abonnement Pro",
            price: "Sur Devis",
            period: "mois",
            features: [
                "Pour Restaurants & Hôtels",
                "Livraison quotidienne",
                "Variétés sur mesure",
                "Facturation fin de mois"
            ],
            color: "border-[var(--color-accent)]",
            badge: "B2B"
        }
    ];

    return (
        <Section spacing="lg" className="bg-white">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Abonnez-vous à la Santé</h2>
                    <p className="text-[var(--color-text-secondary)]">
                        Recevez chaque semaine le meilleur de notre production, sans y penser.
                        Sans engagement, annulable à tout moment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            padded
                            className={`relative ${plan.color} ${plan.badge ? 'shadow-xl' : 'shadow-md'}`}
                        >
                            {plan.badge && (
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <Badge variant={plan.badge === 'Premium' ? 'accent' : 'primary'}>
                                        {plan.badge}
                                    </Badge>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-bold text-[var(--color-text-primary)]">{plan.price}</span>
                                <span className="text-gray-500 mb-1">FCFA / {plan.period}</span>
                            </div>

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
                                variant={plan.badge === 'Premium' ? 'accent' : plan.badge === 'Populaire' ? 'primary' : 'outline'}
                                leftIcon={<ShoppingBasket size={18} />}
                                onClick={() => alert(`Abonnement ${plan.name} sélectionné (Demo)`)}
                            >
                                Choisir ce panier
                            </Button>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
