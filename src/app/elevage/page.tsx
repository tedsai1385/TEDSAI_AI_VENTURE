'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Bird,
    Egg,
    Heart,
    ShieldCheck,
    Sprout,
    ArrowRight
} from 'lucide-react';

export default function ElevagePage() {
    const practices = [
        {
            icon: Heart,
            title: 'Bien-être Animal',
            description: 'Nos animaux grandissent en plein air, avec de l\'espace et une alimentation naturelle.',
            color: 'text-red-500 bg-red-50'
        },
        {
            icon: Sprout,
            title: 'Alimentation Bio',
            description: 'Nourris exclusivement avec des grains biologiques et des végétaux de notre garden.',
            color: 'text-green-500 bg-green-50'
        },
        {
            icon: ShieldCheck,
            title: 'Sans Antibiotiques',
            description: 'Nous privilégions la prévention et les soins naturels pour garantir une viande saine.',
            color: 'text-blue-500 bg-blue-50'
        }
    ];

    const products = [
        {
            name: 'Poulet de Chair',
            desc: 'Chair ferme et savoureuse',
            price: '4,500 FCFA/kg',
            image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80'
        },
        {
            name: 'Œufs Frais',
            desc: 'Jaune intense, riches en oméga-3',
            price: '2,000 FCFA/alvéole',
            image: 'https://images.unsplash.com/photo-1582722872445-44dc775370ce?w=800&q=80'
        },
        {
            name: 'Poussins d\'un jour',
            desc: 'Souche rustique et résistante',
            price: 'Sur commande',
            image: 'https://images.unsplash.com/photo-1569884099862-e05e8ad72b26?w=800&q=80'
        }
    ];

    return (
        <main className="min-h-screen">
            <section className="relative py-24 bg-gradient-to-br from-amber-900 to-yellow-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <Bird className="w-4 h-4 mr-2" />
                            Élevage Responsable
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 font-heading">
                            Le Respect du <span className="text-amber-400">Vivant</span>
                        </h1>
                        <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
                            Un élevage à taille humaine qui privilégie la qualité à la quantité.
                            Découvrez nos méthodes respectueuses de l'animal et de l'environnement.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Engagements</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Nous croyons qu'un animal heureux donne des produits sains et savoureux.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {practices.map((practice, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${practice.color}`}>
                                    <practice.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{practice.title}</h3>
                                <p className="text-gray-600">{practice.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-amber-50 rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos Produits de la Ferme</h2>
                                <div className="space-y-6">
                                    {products.map((product, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden relative flex-shrink-0">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                                                    <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">{product.price}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">{product.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white w-full md:w-auto">
                                        Commander nos produits
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </div>
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl hidden md:block">
                                <Image
                                    src="https://images.unsplash.com/photo-1516467508483-a7212061b1ca?w=800&q=80"
                                    alt="Élevage TEDSAI"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
