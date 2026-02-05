import React from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { MessageCircle, Utensils, Sprout } from 'lucide-react';
import Link from 'next/link';

export const CTAFinal = () => {
    return (
        <Section spacing="lg" className="bg-[var(--color-background)]">
            <Container>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Prêt à démarrer l'expérience ?
                    </h2>
                    <p className="text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-2xl mx-auto">
                        Réservez votre table, recevez votre panier bio, ou lancez un diagnostic IA pour votre entreprise.
                        TEDSAI vous accompagne dès maintenant.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
                        <Link href="/vitedia">
                            <Button size="lg" variant="primary" leftIcon={<Utensils size={20} />}>
                                Réserver chez viTEDia
                            </Button>
                        </Link>
                        <Link href="/garden-selected">
                            <Button size="lg" variant="secondary" className="bg-green-700 hover:bg-green-800" leftIcon={<Sprout size={20} />}>
                                Commander au SelecTED Garden
                            </Button>
                        </Link>
                        <Link href="/solutions-ia">
                            <Button size="lg" variant="outline" leftIcon={<MessageCircle size={20} />}>
                                Diagnostic IA Gratuit
                            </Button>
                        </Link>
                    </div>

                    <div className="text-sm text-gray-400">
                        Besoin d'aide ? <a href="https://wa.me/237683121654" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-primary)]">Contactez le support WhatsApp</a>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
