import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Leaf, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const GardenHero = () => {
    return (
        <section className="relative w-full h-[80vh] min-h-[500px] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/jardin-hero.jpg"
                    alt="SelecTED Garden Aquaponie"
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
            </div>

            <Container className="relative z-20 text-white">
                <div className="max-w-3xl">
                    <Badge variant="success" className="mb-6 bg-green-500 text-white border-none text-sm tracking-wider uppercase">
                        Agriculture Urbaine Intelligente
                    </Badge>

                    <h1 className="text-white text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                        SelecTED Garden — <br />
                        Zéro Kilomètre, <span className="text-green-400">Zéro Doute</span>.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light max-w-2xl border-l-4 border-green-500 pl-4">
                        Le SelecTED Garden réinventé. Nos légumes poussent sur l'eau, nourris par nos poissons, pilotés par l'IA.
                        Récoltés ce matin à Yaoundé. Dans votre assiette à midi.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="#produits">
                            <Button size="lg" variant="primary" className="bg-green-600 hover:bg-green-700 border-none" leftIcon={<ShoppingCart size={20} />}>
                                Commander mon Panier
                            </Button>
                        </Link>
                        <Link href="#technologie">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/5 border-white/30 text-white hover:bg-white/10"
                                leftIcon={<Leaf size={20} />}
                            >
                                Découvrir la technologie
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
