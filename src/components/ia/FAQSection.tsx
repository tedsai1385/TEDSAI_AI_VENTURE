'use client';

import React, { useState } from 'react';
import { Container, Section } from '../ui/Container';
import { Plus, Minus } from 'lucide-react';

export const FAQSection = () => {
    const faqs = [
        {
            q: "Faut-il être technique pour utiliser vos outils ?",
            a: "Absolument pas. Si vous savez utiliser WhatsApp, vous savez utiliser nos solutions. Nous nous occupons de toute la complexité technique en arrière-plan."
        },
        {
            q: "Combien de temps faut-il pour l'installation ?",
            a: "Pour l'offre Starter, votre chatbot est opérationnel en 48 heures. Pour les intégrations plus complexes (Growth), comptez environ 1 à 2 semaines."
        },
        {
            q: "L'IA comprend-elle le 'Camfranglais' ?",
            a: "Oui ! Nos modèles sont spécifiquement affinés sur les dialectes et expressions locales du Cameroun. Ils comprennent 'Combien ça coûte ?' tout comme 'C'est combien le mambo là ?'."
        },
        {
            q: "Mes données sont-elles sécurisées ?",
            a: "Sécurité militaire. Vos données ne sont jamais vendues. Elles servent uniquement à entraîner VOTRE modèle pour VOTRE entreprise."
        },
        {
            q: "Puis-je annuler mon abonnement ?",
            a: "Oui, à tout moment. Il n'y a aucun engagement de durée sur les offres Starter et Growth."
        },
        {
            q: "Le chatbot remplace-t-il mes employés ?",
            a: "Non, il les augmente. Il gère les tâches répétitives et fatigantes (répondre 50 fois à la même question), permettant à votre équipe de se concentrer sur le service client de qualité."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <Section spacing="base" className="bg-white">
            <Container size="md">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold mb-4">Questions Fréquentes</h2>
                    <p className="text-gray-600">Tout ce que vous devez savoir avant de digitaliser votre business.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 outline-none"
                            >
                                <span className="font-bold text-gray-900 pr-8">{faq.q}</span>
                                {openIndex === index ? (
                                    <Minus className="text-[var(--color-primary)] shrink-0" size={20} />
                                ) : (
                                    <Plus className="text-gray-400 shrink-0" size={20} />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-5 pt-0 text-gray-600 bg-white border-t border-gray-100 leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
};
