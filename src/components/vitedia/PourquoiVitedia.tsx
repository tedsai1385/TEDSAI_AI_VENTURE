import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Sprout, QrCode, Star } from 'lucide-react';

export const PourquoiVitedia = () => {
    const reasons = [
        {
            icon: <Sprout size={40} />,
            title: "Produits Frais",
            desc: "Nos légumes sont récoltés le matin même dans notre SelecTED Garden. Zéro pesticide, fraîcheur garantie.",
            color: "text-[var(--color-primary)]",
            bg: "bg-[var(--color-primary-50)]"
        },
        {
            icon: <QrCode size={40} />,
            title: "Traçabilité QR",
            desc: "Scannez le QR code sur votre table pour voir la fiche d'identité de votre plat : variété, heure de récolte, chef responsable.",
            color: "text-[var(--color-accent)]",
            bg: "bg-[var(--color-accent-50)]"
        },
        {
            icon: <Star size={40} />,
            title: "Cuisine Fusion",
            desc: "Recettes traditionnelles camerounaises revisitées avec rigueur, épices locales et zéro additif.",
            color: "text-[var(--color-secondary)]",
            bg: "bg-[var(--color-secondary-50)]"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Plus qu'un repas, une preuve d'amour</h2>
                    <p className="text-[var(--color-text-secondary)]">L'expérience viTEDia expliquée.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reasons.map((item, index) => (
                        <Card key={index} variant="default" className="text-center p-8 hover:shadow-lg transition-shadow">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${item.bg} ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
