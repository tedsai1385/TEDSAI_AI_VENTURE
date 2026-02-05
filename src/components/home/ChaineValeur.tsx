import React from 'react';
import { FadeInOnScroll } from '../utils/FadeInOnScroll';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Sprout, ShoppingBasket, QrCode, ChefHat, BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ChaineValeur = () => {
    const steps = [
        {
            icon: <Sprout size={32} />,
            title: "Production",
            desc: "Culture urbaine responsable",
            color: "text-[var(--color-primary)]",
            bg: "bg-[var(--color-primary-50)]"
        },
        {
            icon: <ShoppingBasket size={32} />,
            title: "Collecte",
            desc: "Disponibilité & récolte du jour",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: <QrCode size={32} />,
            title: "Traçabilité",
            desc: "QR code unique par lot",
            color: "text-[var(--color-accent)]",
            bg: "bg-[var(--color-accent-50)]"
        },
        {
            icon: <ChefHat size={32} />,
            title: "Cuisine",
            desc: "Transformation & Qualité",
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            icon: <BrainCircuit size={32} />,
            title: "IA",
            desc: "Feedback & Optimisation",
            color: "text-[var(--color-secondary)]",
            bg: "bg-[var(--color-secondary-50)]"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background-pure)]">
            <Container>
                <FadeInOnScroll>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            La Chaîne de Valeur <span className="text-[var(--color-primary)]">TEDSAI</span>
                        </h2>
                        <p className="text-[var(--color-text-secondary)]">
                            Un processus intégré unique où chaque étape est connectée, mesurée et optimisée pour garantir une qualité absolue.
                        </p>
                    </div>
                </FadeInOnScroll>

                <div className="relative">
                    {/* Line connector for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 z-0" />

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <FadeInOnScroll key={index} delay={index * 0.2}>
                                <div className="flex flex-col items-center text-center group cursor-default">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-[360deg] shadow-sm group-hover:shadow-xl border-4 border-white z-10 relative ${step.bg} ${step.color}`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors">{step.title}</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{step.desc}</p>
                                </div>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/vitedia">
                        <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                            Voir un exemple de QR code
                        </Button>
                    </Link>
                </div>
            </Container>
        </Section>
    );
};
