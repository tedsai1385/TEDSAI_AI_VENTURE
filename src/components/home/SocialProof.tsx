import React from 'react';
import { FadeInOnScroll } from '../utils/FadeInOnScroll';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

export const SocialProof = () => {
    const testimonials = [
        {
            name: "M. Kamdem",
            role: "PDG Biscuiterie Star, Yaoundé",
            content: "Grâce à TEDSAI, nos pertes de farine ont chuté de 31%. La preuve est dans leurs prévisions météo intégrées.",
            rating: 5,
            image: "/images/avatar1.jpg"
        },
        {
            name: "Mme Bila",
            role: "Food Blogger 125k followers",
            content: "J'ai scanné mon poisson. Le niveau de détail est fou. Mes abonnés veulent la même chose !",
            rating: 5,
            image: "/images/avatar2.jpg"
        },
        {
            name: "Marc A.",
            role: "Entrepreneur",
            content: "Le meilleur poulet DG de Yaoundé, et en plus je sais exactement d'où il vient !",
            rating: 5,
            image: "/images/avatar3.jpg"
        }
    ];

    const partners = ["Ecocert CM", "ActivSpaces", "Celo Blockchain", "MINADER"];

    return (
        <Section spacing="base" className="bg-[var(--color-background)]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold mb-4">Ils font grandir l'écosystème</h2>
                    <p className="text-[var(--color-text-secondary)]">La confiance se cultive, jour après jour.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {testimonials.map((t, index) => (
                        <FadeInOnScroll key={index} delay={index * 0.1}>
                            <Card padded className="bg-white h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="flex gap-1 mb-4 text-[var(--color-accent)]">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{t.content}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                        {/* Placeholder avatar */}
                                        {/* <Image src={t.image} alt={t.name} width={40} height={40} /> */}
                                        <div className="w-full h-full bg-gray-300 animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                            </Card>
                        </FadeInOnScroll>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-16">
                    <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
                        Partenaires & Certifications
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((partner, i) => (
                            <div key={i} className="text-xl font-bold text-gray-400 hover:text-[var(--color-primary)] cursor-default">
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
};
