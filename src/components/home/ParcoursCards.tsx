import React from 'react';
import { FadeInOnScroll } from '../utils/FadeInOnScroll';
import { Container } from '../ui/Container';
import { Card } from '../ui/card';
import { Utensils, Sprout, BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';







export const ParcoursCards = () => {
    const parcours = [
        {
            title: "Je veux manger ou acheter",
            description: "Réservez au restaurant viTEDia ou commandez à la Boutique TEDSAI.",
            icon: <Utensils size={32} className="text-[var(--color-accent)]" />,
            link: "/vitedia",
            color: "var(--color-accent-50)",
            delay: 0.1
        },
        {
            title: "Je suis une entreprise",
            description: "Découvrez nos solutions IA et nos services d'infographie.",
            icon: <BrainCircuit size={32} className="text-[var(--color-secondary)]" />,
            link: "/solutions-ia",
            color: "var(--color-secondary-50)",
            delay: 0.2
        },
        {
            title: "Je veux comprendre",
            description: "Explorez l'Observatoire TEDSAI : analyses et tendances.",
            icon: <Sprout size={32} className="text-[var(--color-primary)]" />,
            link: "/observatoire",
            color: "var(--color-primary-50)",
            delay: 0.3
        }
    ];

    return (
        <div className="relative -mt-10 z-30 pb-20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {parcours.map((item, index) => (
                        <FadeInOnScroll key={index} delay={index * 0.15} fullWidth>
                            <Link href={item.link} className="block group h-full">
                                <Card
                                    variant="elevated"
                                    hover
                                    className="h-full flex flex-row items-center gap-4 p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                    <ArrowRight size={20} className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                </Card>
                            </Link>
                        </FadeInOnScroll>
                    ))}
                </div>
            </Container>
        </div>
    );
};
