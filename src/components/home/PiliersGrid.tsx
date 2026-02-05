import React from 'react';
import { FadeInOnScroll } from '../utils/FadeInOnScroll';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Leaf, Utensils, Cpu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const PiliersGrid = () => {
    const piliers = [
        {
            title: "viTEDia",
            subtitle: "De la Data à l'Assiette",
            desc: "Cuisine fusion camerounaise, produits du SelecTED Garden, traçabilité QR sur chaque plat.",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
            icon: <Utensils size={24} />,
            color: "var(--color-accent)",
            link: "/vitedia",
            activator: "Réserver votre table"
        },
        {
            title: "SelecTED Garden",
            subtitle: "Zéro Kilomètre, Zéro Doute",
            desc: "Agriculture aquaponique urbaine, zéro pesticide, production pilotée par l'IA.",
            image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&w=800&q=80",
            icon: <Leaf size={24} />,
            color: "var(--color-primary)",
            link: "/garden-selected", // Updated link
            activator: "Découvrir les Paniers Bio"
        },
        {
            title: "Boutique TEDSAI",
            subtitle: "Pépites Locales & Qualité Certifiée",
            desc: "Produits TEDSAI et sélection des meilleurs produits camerounais : miel d'Oku, poivre de Penja, épices rares.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
            icon: <Leaf size={24} />,
            color: "var(--color-primary)", // TODO: Add specific color if needed
            link: "/shop",
            activator: "Commander maintenant"
        },
        {
            title: "TEDSAI Digital Solutions",
            subtitle: "Zéro Hasard",
            desc: "Chatbots WhatsApp, automatisation, tableaux de bord, analyse prédictive pour PME.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            icon: <Cpu size={24} />,
            color: "var(--color-secondary)",
            link: "/solutions-ia",
            activator: "Obtenir un Diagnostic Gratuit"
        },
        {
            title: "TEDSAI Infographie",
            subtitle: "Votre Vision, Notre Précision",
            desc: "Identité visuelle, logos, menus, packagings, pitch decks et contenus réseaux sociaux.",
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
            icon: <Cpu size={24} />, // Replace with Palette if available, reusing CPU/Leaf for now
            color: "var(--color-secondary)",
            link: "/infographie",
            activator: "Voir le Portfolio"
        }
    ];

    return (
        <Section spacing="lg">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {piliers.map((pilier, index) => (
                        <FadeInOnScroll key={index} delay={index * 0.1}>
                            <Link href={pilier.link} className="block h-full group">
                                <Card
                                    variant="default"
                                    padded={false}
                                    className="h-full flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 rounded-2xl border-none"
                                >
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        <Image
                                            src={pilier.image}
                                            alt={pilier.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-lg text-[var(--color-text-primary)] z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                                            {pilier.icon}
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1 relative bg-white">
                                        <div className="text-xs font-bold tracking-widest uppercase mb-3 opacity-80" style={{ color: pilier.color }}>
                                            {pilier.subtitle}
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold mb-4 text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                                            {pilier.title}
                                        </h3>
                                        <p className="text-gray-500 mb-8 flex-1 leading-relaxed font-light">
                                            {pilier.desc}
                                        </p>
                                        <Button
                                            className="w-full justify-between bg-gray-50 hover:bg-[var(--color-primary)] hover:text-white border-none rounded-xl h-12 px-6 group/btn transition-colors duration-300"
                                            variant="ghost"
                                        >
                                            <span className="font-medium">{pilier.activator}</span>
                                            <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        </FadeInOnScroll>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
