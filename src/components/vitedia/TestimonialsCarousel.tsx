import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

export const TestimonialsCarousel = () => {
    const reviews = [
        {
            name: "Marc A.",
            date: "Entrepreneur",
            rating: 5,
            text: "Le meilleur poulet DG de Yaoundé, et en plus je sais exactement d'où il vient !",
            dish: "Poulet DG \"Data-Driven\""
        },
        {
            name: "Amina",
            date: "Entrepreneure",
            rating: 5,
            text: "Je n'avais jamais vu la fiche d'identité de ma salade avant. Bluffant et délicieux.",
            dish: "Salade Aquaponique"
        },
        {
            name: "M. Kamdem",
            date: "PDG Biscuiterie Star",
            rating: 5,
            text: "J'ai scanné mon poisson devant mes clients. Ils ont vu la transaction blockchain. La vente était faite.",
            dish: "Poisson Braisé"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background-pure)]">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold mb-4">La Parole aux Gourmets</h2>
                    <div className="flex items-center justify-center gap-2 text-[var(--color-accent)] font-bold text-xl">
                        <span>4.9/5</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={20} fill="currentColor" />)}
                        </div>
                        <span className="text-gray-400 text-sm font-normal">(128 avis vérifiés)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <Card key={i} className="bg-[var(--color-surface)] p-8 relative">
                            <Quote size={40} className="text-[var(--color-primary-100)] absolute top-6 right-6" />

                            <div className="flex gap-1 text-[var(--color-accent)] mb-4">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{review.name}</div>
                                    <div className="text-xs text-gray-400">{review.date} • {review.dish}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
