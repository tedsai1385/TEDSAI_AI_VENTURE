import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export const VitediaHero = () => {
    return (
        <section className="relative w-full h-[80vh] min-h-[500px] flex items-center overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
                {/* Background Image */}
                <Image
                    src="/images/vitedia-placeholder.jpg"
                    alt="viTEDia - Cuisine Connectée"
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                />
            </div>

            <Container className="relative z-20 text-white">
                <div className="max-w-3xl">
                    <Badge variant="accent" className="mb-6 bg-[var(--color-accent)] text-white border-none text-sm tracking-wider uppercase">
                        Cuisine Connectée
                    </Badge>

                    <h1 className="text-[#f4ede0] text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                        viTEDia — <br />
                        De la Data à l'<span className="text-[var(--color-accent)]">Assiette</span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-light text-gray-100 mb-6">
                        La première table de Yaoundé où le menu se prouve.
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light max-w-2xl border-l-4 border-[var(--color-accent)] pl-4">
                        Scannez. Découvrez. Savourez.
                        Chez viTEDia, vous ne mangez pas seulement — vous comprenez d'où vient chaque ingrédient.
                        Récolte du matin à 6h30. QR code gravé sur chaque plat.
                    </p>


                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/vitedia#reservation">
                            <Button size="lg" variant="accent" leftIcon={<Calendar size={20} />}>
                                Réserver une Table
                            </Button>
                        </Link>
                        <Link href="https://wa.me/237699999999" target="_blank">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/5 border-white/30 text-white hover:bg-white/10"
                                leftIcon={<ShoppingBag size={20} />}
                            >
                                Commander via WhatsApp
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-sm">
                <span>Découvrir le menu</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </div>
        </section>
    );
};
