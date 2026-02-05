import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Palette, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const InfographieHero = () => {
    return (
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center overflow-hidden bg-black text-white">
            {/* Artistic Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/infographie_hero.jpg"
                    alt="TEDSAI Infographie Hero"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-sm uppercase mb-6">
                        <Palette size={16} /> Studio de Design & Branding
                    </div>

                    <h1 className="text-white text-5xl md:text-7xl font-heading font-bold mb-8 leading-tight">
                        TEDSAI Infographie — <br />
                        Votre Vision, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Notre Précision</span>.
                    </h1>

                    <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl">
                        Identités visuelles qui marquent. Supports marketing qui vendent.
                        Nous donnons corps à votre marque avec une esthétique premium adaptée au marché local.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/infographie#portfolio">
                            <Button size="lg" variant="primary" className="bg-purple-600 hover:bg-purple-700 border-none" leftIcon={<Layers size={20} />}>
                                Voir notre Portfolio
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/5 border-white/30 text-white hover:bg-white/10"
                            >
                                Demander un Devis
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
