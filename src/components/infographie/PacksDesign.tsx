import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';

export const PacksDesign = () => {
    const packs = [
        {
            name: "Pack Startup",
            price: "50 000",
            desc: "L'essentiel pour démarrer avec une image professionnelle.",
            features: [
                "Logo (2 propositions)",
                "Carte de visite recto/verso",
                "Avatar Facebook/WhatsApp",
                "Fichiers haute définition"
            ],
            cta: "Commander Startup",
            color: "border-gray-200",
            popular: false
        },
        {
            name: "Pack Branding",
            price: "150 000",
            desc: "Une identité complète pour inspirer confiance.",
            features: [
                "Logo Premium (3 pistes)",
                "Charte Graphique (PDF)",
                "Papier à en-tête & Facture",
                "3 Templates Réseaux Sociaux",
                "Flyer promotionnel",
                "Signature email"
            ],
            cta: "Commander Branding",
            color: "border-purple-500 ring-2 ring-purple-500 ring-offset-2",
            popular: true
        },
        {
            name: "Full Stack 360",
            price: "Sur Devis",
            desc: "Identité + Site Web + Packaging. Le lancement total.",
            features: [
                "Branding complet",
                "Site Web Vitrine ou E-commerce",
                "Packaging gamme de produits",
                "Shooting photo produits",
                "Vidéo publicitaire courte"
            ],
            cta: "Demander un Devis",
            color: "border-pink-500",
            popular: false
        }
    ];

    return (
        <Section spacing="lg" className="bg-gray-50">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Investissez dans votre Image</h2>
                    <p className="text-gray-600">Des forfaits clairs. Des livrables de qualité agence à prix PME.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {packs.map((plan, index) => (
                        <Card
                            key={index}
                            padded
                            className={`relative bg-white ${plan.color} ${plan.popular ? 'shadow-2xl scale-105 z-10' : 'shadow-md'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <Badge variant="accent" className="bg-purple-600 text-white shadow-lg">
                                        Best-Seller
                                    </Badge>
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-2">
                                <span className={`text-4xl font-bold ${plan.popular ? 'text-purple-600' : 'text-gray-900'}`}>{plan.price}</span>
                                {plan.price !== "Sur Devis" && <span className="text-gray-500 mb-1">FCFA</span>}
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
                                variant={plan.popular ? 'primary' : 'outline'}
                                className={plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            >
                                {plan.cta}
                            </Button>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
