import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { PenTool, Layout, Monitor, Printer, Instagram, Briefcase } from 'lucide-react';

export const ServicesDesign = () => {
    const services = [
        {
            icon: <PenTool size={32} />,
            title: "Identité Visuelle",
            desc: "Logos vectoriels, chartes graphiques, choix typographiques. L'ADN unique de votre entreprise.",
            color: "text-pink-500",
            bg: "bg-pink-50"
        },
        {
            icon: <Printer size={32} />,
            title: "Supports Print",
            desc: "Flyers A5/A4, cartes de visite de luxe, affiches événementielles, kakémonos.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            icon: <Instagram size={32} />,
            title: "Réseaux Sociaux",
            desc: "Kits de bienvenue, templates de posts, stories animées, bannières LinkedIn/Facebook.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            icon: <Layout size={32} />,
            title: "Packaging Produit",
            desc: "Étiquettes conformes, boîtes, sachets doypack. Votre produit doit se vendre en rayon.",
            color: "text-yellow-500",
            bg: "bg-yellow-50"
        },
        {
            icon: <Briefcase size={32} />,
            title: "Pitch Decks",
            desc: "Présentations PowerPoint/Canva pour investisseurs. Design épuré et impactant.",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: <Monitor size={32} />,
            title: "Web Design UI",
            desc: "Maquettage de sites vitrines et e-commerce avant développement. Expérience utilisateur (UX) optimisée.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        }
    ];

    return (
        <Section spacing="lg" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Ce que nous créons</h2>
                    <p className="text-gray-600">Une suite complète de services créatifs pour couvrir tous vos besoins.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} hover className="border border-gray-100 p-8 flex flex-col items-center text-center group transition-all duration-300">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${service.bg} ${service.color} transition-transform group-hover:scale-110 duration-500`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-gray-900 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {service.desc}
                            </p>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
