'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



import {
    Utensils,
    Leaf,
    Award,
    MapPin,
    Clock,
    Star,
    CheckCircle,
    QrCode,
    ArrowRight,
    Phone,
    Mail
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function VitediaPage() {
    const dishes = [
        {
            name: 'Ndolé Revisité',
            description: 'Plat signature avec légumes du jardin SelecTED et arachides bio',
            image: '/assets/images/vitedia_dish_ndole.webp',
            price: 8500,
            category: 'Plats Traditionnels',
            traceability: [
                { ingredient: 'Épinards', source: 'Jardin A3', verified: true },
                { ingredient: 'Arachides', source: 'Local Bio', verified: true },
                { ingredient: 'Viande', source: 'Élevage TEDSAI', verified: true },
            ],
        },
        {
            name: 'Poulet DG Premium',
            description: 'Poulet fermier de notre élevage avec légumes frais et plantains',
            image: '/assets/images/vitedia_dish_poulet_dg.webp',
            price: 9500,
            category: 'Plats Signature',
            traceability: [
                { ingredient: 'Poulet', source: 'Élevage TEDSAI', verified: true },
                { ingredient: 'Plantains', source: 'Jardin B2', verified: true },
                { ingredient: 'Légumes', source: 'Jardin A1', verified: true },
            ],
        },
        {
            name: 'Koki de Haricots',
            description: 'Recette traditionnelle avec haricots bio et huile de palme locale',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            price: 6500,
            category: 'Végétarien',
            traceability: [
                { ingredient: 'Haricots', source: 'Jardin C1', verified: true },
                { ingredient: 'Huile de palme', source: 'Production locale', verified: true },
            ],
        },
        {
            name: 'Eru Sauce',
            description: 'Légumes sauvages avec poisson fumé et crevettes',
            image: '/assets/images/vitedia_dish_eru.webp',
            price: 7500,
            category: 'Spécialités',
            traceability: [
                { ingredient: 'Eru', source: 'Cueillette locale', verified: true },
                { ingredient: 'Poisson fumé', source: 'Pêcheurs locaux', verified: true },
            ],
        },
        {
            name: 'Sanga de Boeuf',
            description: 'Boeuf mijoté avec épices et légumes du jardin',
            image: '/assets/images/vitedia_dish_grilled_fish.webp',
            price: 10500,
            category: 'Plats Signature',
            traceability: [
                { ingredient: 'Boeuf', source: 'Élevage local', verified: true },
                { ingredient: 'Épices', source: 'Jardin D2', verified: true },
            ],
        },
        {
            name: 'Okok aux Crevettes',
            description: 'Feuilles d\'okok avec crevettes fraîches et arachides',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
            price: 8000,
            category: 'Spécialités',
            traceability: [
                { ingredient: 'Okok', source: 'Cueillette locale', verified: true },
                { ingredient: 'Crevettes', source: 'Pêcheurs locaux', verified: true },
            ],
        },
    ];

    const gallery = [
        { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', alt: 'Plat signature viTEDia' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', alt: 'Ambiance restaurant' },
        { src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', alt: 'Ingrédients frais' },
        { src: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80', alt: 'Cuisine ouverte' },
        { src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80', alt: 'Table dressée' },
        { src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', alt: 'Chef en action' },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-6 relative w-32 h-32">
                                <Image
                                    src="/assets/images/logos/vitedia_logo.jpg"
                                    alt="Logo viTEDia"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <Badge variant="vitedia" className="mb-4">
                                <Utensils className="w-4 h-4" />
                                Gastronomie Traçable
                            </Badge>

                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 font-heading">
                                Restaurant <span className="text-vitedia-primary">viTEDia</span>
                            </h1>

                            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                                Chaque ingrédient raconte son histoire, du jardin à votre assiette.
                                Découvrez une cuisine fusion où tradition camerounaise et innovation
                                se rencontrent dans une expérience culinaire unique.
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {[
                                    { icon: CheckCircle, text: '100% Traçable' },
                                    { icon: Leaf, text: 'Produits Locaux' },
                                    { icon: Award, text: 'Bio Certifié' },
                                    { icon: QrCode, text: 'QR Code Menu' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                                        <feature.icon className="w-4 h-4 text-vitedia-primary" />
                                        <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="#reservation">
                                    <Button variant="vitedia" size="lg" rounded="full" className="shadow-xl">
                                        Réserver une Table
                                        <Clock className="w-5 h-5" />
                                    </Button>
                                </Link>

                                <Link href="#menu">
                                    <Button variant="outline" size="lg" rounded="full">
                                        Voir le Menu
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                                    <MapPin className="w-6 h-6 text-vitedia-primary flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-600">Adresse</div>
                                        <div className="font-semibold text-sm">Yaoundé, Cameroun</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                                    <Clock className="w-6 h-6 text-vitedia-primary flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-600">Horaires</div>
                                        <div className="font-semibold text-sm">11h - 23h</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image with Rating Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/assets/images/vitedia_dish_poulet_dg.webp"
                                    alt="Restaurant viTEDia"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Rating Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">⭐</div>
                                    <div>
                                        <div className="text-3xl font-bold text-vitedia-primary">4.9/5</div>
                                        <div className="text-sm text-gray-600">250+ Avis</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Signature Dishes Section */}
            <section id="menu" className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Nos Plats Signature
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez nos créations culinaires avec traçabilité complète de chaque ingrédient
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dishes.map((dish, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full group overflow-hidden">
                                    {/* Dish Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={dish.image}
                                            alt={dish.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-vitedia-primary shadow-lg">
                                            {formatCurrency(dish.price)}
                                        </div>
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="vitedia">{dish.category}</Badge>
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-xl">{dish.name}</CardTitle>
                                        <CardDescription>{dish.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Traceability */}
                                        <div className="space-y-2 mb-4">
                                            <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Traçabilité:
                                            </div>
                                            {dish.traceability.map((item, j) => (
                                                <div key={j} className="flex items-center justify-between text-xs text-gray-600 pl-6">
                                                    <span>• {item.ingredient}: {item.source}</span>
                                                    <QrCode className="w-4 h-4 text-primary-600 cursor-pointer hover:text-primary-700" />
                                                </div>
                                            ))}
                                        </div>

                                        <Button variant="vitedia" className="w-full" size="sm">
                                            Commander
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Galerie viTEDia
                        </h2>
                        <p className="text-xl text-gray-600">
                            Découvrez l'ambiance et nos créations culinaires
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white font-semibold">{item.alt}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Traceability Infographic */}
            <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-8 font-heading">
                            De la Graine à l'Assiette
                        </h2>

                        {/* Simple Flow Diagram */}
                        <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
                            {[
                                { icon: Leaf, label: 'Jardin SelecTED', color: 'text-green-600' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Award, label: 'Contrôle Qualité', color: 'text-blue-600' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Utensils, label: 'Cuisine viTEDia', color: 'text-vitedia-primary' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Star, label: 'Votre Table', color: 'text-amber-600' },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${step.color}`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    {step.label && <div className="mt-2 text-sm font-medium">{step.label}</div>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact & Reservation CTA */}
            <section id="reservation" className="py-20 bg-vitedia-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black mb-6 font-heading">
                            Prêt à Vivre l'Expérience viTEDia ?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Réservez votre table dès maintenant et découvrez une gastronomie
                            où chaque bouchée raconte une histoire.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                                <Phone className="w-5 h-5" />
                                <span>+237 6XX XX XX XX</span>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                                <Mail className="w-5 h-5" />
                                <span>contact@vitedia.cm</span>
                            </div>
                        </div>

                        <Button size="xl" rounded="full" className="bg-white text-vitedia-primary hover:bg-gray-100 shadow-2xl">
                            Réserver Maintenant
                            <Clock className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
