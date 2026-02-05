import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ShoppingBag, Stethoscope, Briefcase } from 'lucide-react';
import Image from 'next/image';

export const CasUsages = () => {
    const cases = [
        {
            sector: "Boulangerie",
            icon: <ShoppingBag size={20} />,
            title: "BOULANGERIE MODERN",
            problem: "Surproduction de pain (+18% de perte le lundi).",
            solution: "Modèle prédictif ajusté sur trafic + jours fériés camerounais.",
            results: ["-23% Pertes", "8 semaines"],
            image: "/images/ia_dashboard.png"
        },
        {
            sector: "Industrie",
            icon: <ShoppingBag size={20} />,
            title: "BISCUITERIE STAR",
            problem: "Humidité affecte qualité de la farine.",
            solution: "Capteurs IoT + prédiction qualité.",
            results: ["-31% Pertes", "+25% Marge"],
            image: "/images/ia_dashboard.png"
        },
        {
            sector: "Écosystème",
            icon: <Briefcase size={20} />,
            title: "TEDSAI COMPLEX",
            problem: "Gaspillage alimentaire dans l'écosystème.",
            solution: "Prédiction demande + menu dynamique IA.",
            results: ["-40% Gaspillage", "98.7% Optim."],
            image: "/images/ia_dashboard.png"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background)]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <Badge variant="primary" className="mb-4">Histoires de Succès</Badge>
                        <h2 className="text-3xl font-heading font-bold mb-4">Ils ont passé le cap de l'IA</h2>
                        <p className="text-[var(--color-text-secondary)]">
                            L'intelligence artificielle n'est pas de la science-fiction.
                            C'est un avantage concurrentiel concret pour ces entreprises camerounaises.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {cases.map((c, index) => (
                        <Card key={index} padded={false} className="bg-white overflow-hidden flex flex-col h-full border-t-4 border-t-[var(--color-secondary)]">
                            <div className="relative h-48 bg-gray-200">
                                <Image
                                    src={c.image}
                                    alt={c.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/50 backdrop-blur px-2 py-1 rounded uppercase tracking-wider">
                                        {c.icon} {c.sector}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                {/* Removed old icon/sector header since it's now over the image */}
                                <h3 className="text-2xl font-bold mb-6">{c.title}</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-xs font-bold text-red-500 mb-1">PROBLÈME</div>
                                        <p className="text-sm text-gray-600">{c.problem}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-green-500 mb-1">SOLUTION IA</div>
                                        <p className="text-sm text-gray-600">{c.solution}</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="text-xs font-bold text-[var(--color-secondary)] mb-3">RÉSULTATS CLÉS</div>
                                    <div className="flex flex-wrap gap-2">
                                        {c.results.map((res, i) => (
                                            <Badge key={i} size="sm" variant="secondary" className="bg-blue-50 text-blue-800 border-none">
                                                {res}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
