import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Plug, BrainCircuit, BarChart3, Rocket, ArrowRight } from 'lucide-react';

export const CommentCaMarche = () => {
    const steps = [
        {
            icon: <Plug size={32} />,
            title: "Connectez",
            desc: "Nous relions notre IA à votre WhatsApp Business et (optionnel) à votre logiciel de caisse/stock.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: <BrainCircuit size={32} />,
            title: "Entraînez",
            desc: "Nous nourrissons l'algorithme avec vos menus, prix, FAQ et historique de ventes (anonymisé).",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            icon: <Rocket size={32} />,
            title: "Automatisez",
            desc: "Le chatbot prend le relais : il répond, qualifie et vend 24/7. Vous ne gérez que les cas complexes.",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: <BarChart3 size={32} />,
            title: "Optimisez",
            desc: "Chaque semaine, recevez un rapport sur votre 'santé prédictive' et des recommandations d'action.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">De l'Audit au Déploiement en <span className="text-[var(--color-secondary)]">2 Semaines</span></h2>
                    <p className="text-gray-600">Pas de longue intégration. Pas de formation complexe. Juste du résultat.</p>
                </div>

                <div className="relative">
                    {/* Connector line for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md border-4 border-white ${step.bg} ${step.color}`}>
                                    {step.icon}
                                    {index < steps.length - 1 && (
                                        <div className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-300">
                                            <ArrowRight className="rotate-90" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
};
