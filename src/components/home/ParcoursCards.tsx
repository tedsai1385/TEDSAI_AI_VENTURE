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
                {/* Mobile: Horizontal Scroll | Tablet+: Grid */}
                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {parcours.map((item, index) => (
                        <div key={index} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center h-full">
                            <FadeInOnScroll delay={index * 0.15} fullWidth>
                                <Link href={item.link} className="block group h-full">
                                    <Card
                                        variant="elevated"
                                        hover
                                        className="h-full flex flex-row items-center gap-4 p-5 md:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <div
                                            className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {/* Clone element matching generic ReactNode type, assuming logic holds */}
                                            {React.isValidElement(item.icon) && React.cloneElement(item.icon as React.ReactElement<any>, {
                                                size: undefined,
                                                className: `w-6 h-6 md:w-8 md:h-8 ${(item.icon as React.ReactElement<any>).props.className || ''}`
                                            })}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-heading font-bold text-base md:text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-[var(--color-text-secondary)] text-sm leading-tight">
                                                {item.description}
                                            </p>
                                        </div>
                                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all shrink-0" />
                                    </Card>
                                </Link>
                            </FadeInOnScroll>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
