import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { MessageCircle, BrainCircuit, Database, LineChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ServicesGrid = () => {
    const services = [
        {
            icon: <MessageCircle size={32} />,
            title: "Chatbots WhatsApp",
            desc: "Transformez WhatsApp en canal de vente automatisé. Catalogue, prise de commande, FAQ, sans intervention humaine.",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: <LineChart size={32} />,
            title: "Tableaux de Bord Vivants",
            desc: "Vos données Excel/Caisse connectées en temps réel sur PowerBI ou Streamlit. Prenez des décisions sur des chiffres, pas des intuitions.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            icon: <BrainCircuit size={32} />,
            title: "Analyse Prédictive",
            desc: "Prévisions de stocks, anticipation des ruptures, détection d'anomalies financières. L'IA qui voit le futur de votre PME.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            icon: <Database size={32} />,
            title: "Formations IA",
            desc: "Ateliers pratiques pour dirigeants et équipes : 'ChatGPT pour le Business', 'Automatiser sans coder', 'Data pour Managers'.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        }
    ];

    return (
        <Section spacing="lg" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">La Suite d'Outils <span className="text-[var(--color-secondary)]">TEDSAI</span></h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Nous ne vendons pas de la technologie pour la technologie.
                        Nous vendons du temps gagné et du chiffre d'affaires sécurisé.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} hover className="border border-gray-100 p-8 flex flex-col md:flex-row gap-6 items-start group transition-all duration-300">
                            <div className={`p-4 rounded-xl shrink-0 ${service.bg} ${service.color} transition-transform group-hover:scale-110 duration-300`}>
                                {service.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-secondary)] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {service.desc}
                                </p>
                                <Link href="#" className="inline-flex items-center text-sm font-bold text-[var(--color-secondary)] hover:gap-2 transition-all">
                                    En savoir plus <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
