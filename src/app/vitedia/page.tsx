'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MenuDuJour from '@/components/vitedia/MenuDuJour';
import DishCard, { DishProps } from '@/components/vitedia/DishCard';

import {
    Utensils,
    Leaf,
    Award,
    MapPin,
    Clock,
    CheckCircle,
    QrCode,
    ArrowRight,
    Phone,
    Mail,
    Star
} from 'lucide-react';

export default function VitediaPage() {
    const dishes: DishProps[] = [
        {
            id: 'ndole-revisite',
            name: 'Ndolé Revisité',
            description: 'L\'emblème national sublimé : Feuilles de Ndolé fraîches, pâte d\'arachides bio torréfiée maison, et crevettes de Kribi.',
            image: '/assets/images/vitedia_dish_ndole.webp',
            price: 8500,
            category: 'Tradition',
            spicyLevel: 1,
            isPopular: true,
            traceability: [
                { ingredient: 'Épinards Amers', source: 'Jardin SelecTED A3', verified: true },
                { ingredient: 'Arachides', source: 'Coopérative Bio Ouest', verified: true },
                { ingredient: 'Crevettes', source: 'Pêche Artisanale Kribi', verified: true },
            ],
        },
        {
            id: 'poulet-dg-royal',
            name: 'Poulet DG Royal',
            description: 'Poulet du directeur général : Mijoté de poulet fermier, plantains mûrs frits, carottes et haricots verts croquants.',
            image: '/assets/images/vitedia_dish_poulet_dg.webp',
            price: 9500,
            category: 'Signature',
            spicyLevel: 2,
            traceability: [
                { ingredient: 'Poulet', source: 'Élevage TEDSAI', verified: true },
                { ingredient: 'Plantains', source: 'Verger SelecTED', verified: true },
                { ingredient: 'Légumes', source: 'Serre Hydroponique B', verified: true },
            ],
        },
        {
            id: 'koki-haricots',
            name: 'Koki de Haricots',
            description: 'Gâteau de haricots blancs (Koki) cuit à la vapeur dans des feuilles de bananier, huile de palme rouge pure.',
            image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
            price: 6500,
            category: 'Végétarien',
            spicyLevel: 3,
            traceability: [
                { ingredient: 'Haricots Koki', source: 'Producteurs Locaux', verified: true },
                { ingredient: 'Huile de Palme', source: 'Pressée à froid locale', verified: true },
            ],
        },
        {
            id: 'eru-waterfufu',
            name: 'Eru & Waterfufu',
            description: 'Légumes sauvages (Okok) finement découpés, cuisinés avec de la peau de bœuf et des écrevisses fumées.',
            image: '/assets/images/vitedia_dish_eru.webp',
            price: 7500,
            category: 'Terroir',
            isNew: true,
            traceability: [
                { ingredient: 'Eru (Okok)', source: 'Cueillette Forêt Centre', verified: true },
                { ingredient: 'Écrevisses', source: 'Fumage Traditionnel', verified: true },
            ],
        },
        {
            id: 'sanga-boeuf',
            name: 'Sanga de Boeuf',
            description: 'Un délice de maïs frais, feuilles de zom et pulpe de noix de palme, agrémenté de morceaux de bœuf tendres.',
            image: '/assets/images/vitedia_dish_grilled_fish.webp',
            price: 10500,
            category: 'Signature',
            traceability: [
                { ingredient: 'Boeuf', source: 'Élevage Pâturage', verified: true },
                { ingredient: 'Maïs', source: 'Jardin SelecTED D2', verified: true },
            ],
        },
        {
            id: 'poisson-braise',
            name: 'Poisson Braisé "Dos Touné"',
            description: 'Bar ou Carpe fraîchement pêché, mariné aux épices secrètes du chef et braisé à la perfection.',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
            price: 12000,
            category: 'Grillades',
            traceability: [
                { ingredient: 'Poisson', source: 'Arrivage Quotidien', verified: true },
                { ingredient: 'Épices', source: 'Jardin Aromatique', verified: true },
            ],
        },
    ];

    const gallery = [
        { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', alt: 'Plat Signature - Dressage', span: 'col-span-1 row-span-1' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', alt: 'Ambiance Feutrée Soirée', span: 'col-span-2 row-span-2' },
        { src: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80', alt: 'Cuisine Ouverte Chefs', span: 'col-span-1 row-span-2' },
        { src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80', alt: 'Table Dressée', span: 'col-span-1 row-span-1' },
        { src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', alt: 'Gestes du Chef', span: 'col-span-1 row-span-1' },
    ];

    return (
        <main className="min-h-screen bg-[#fcfaf7]">
            {/* Hero Section - Video Parallax Style */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/assets/images/vitedia_dish_poulet_dg.webp" // Fallback / Main Hero
                    alt="Hero Restaurant"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="relative z-10 text-center text-white px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex justify-center mb-8">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                                <Image
                                    src="/assets/images/logos/vitedia_logo.jpg"
                                    alt="Logo viTEDia"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mb-6">
                            <Badge className="bg-amber-600/80 backdrop-blur-md text-white border-none px-4 py-2 text-sm uppercase tracking-widest font-serif">
                                Gastronomie Traçable
                            </Badge>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-black mb-6 drop-shadow-2xl">
                            viTEDia
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-white/90 mb-10 leading-relaxed font-serif italic">
                            "L'alliance de la data et du goût, pour une expérience culinaire sans compromis."
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="#reservation">
                                <Button size="lg" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white px-8 h-14 text-lg">
                                    Réserver une Table
                                </Button>
                            </Link>
                            <Link href="#menu">
                                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/20 px-8 h-14 text-lg backdrop-blur-sm">
                                    Découvrir la Carte
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Menu du Jour Section - Parchment Style */}
            <section className="py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-amber-600 font-bold tracking-wider uppercase text-sm">Suggestion du Chef</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-2">Le Menu du Jour</h2>
                    </div>

                    <MenuDuJour />
                </div>
            </section>

            {/* Signature Dishes Grid */}
            <section id="menu" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">La Carte</h2>
                            <p className="text-gray-600 max-w-xl text-lg">
                                Une sélection de plats iconiques, préparés avec des ingrédients dont nous maîtrisons l'origine à 100%.
                            </p>
                        </div>
                        <Link href="/shop" className="hidden md:flex items-center gap-2 text-amber-700 font-bold hover:gap-4 transition-all uppercase tracking-wide text-sm">
                            Voir toute la carte <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {dishes.map((dish, i) => (
                            <DishCard key={i} dish={dish} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Button variant="outline" className="rounded-full w-full">Voir toute la carte</Button>
                    </div>
                </div>
            </section>

            {/* Immersive Gallery - Tiles Style */}
            <section className="py-20 bg-[#1a1a1a] text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">L'Atmosphère</h2>
                        <p className="text-white/60 text-lg">Plongez dans l'univers viTEDia</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px] auto-rows-[minmax(150px,auto)]">
                        {gallery.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`relative rounded-xl overflow-hidden group ${item.span || ''}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-serif italic text-xl tracking-wider border-b border-white/50 pb-1">
                                        {item.alt}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Traceability Flow - Dark Mode Style */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-serif font-bold mb-12">Notre Engagement Qualité</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: Leaf, label: 'Jardin SelecTED', sub: 'Récolte Matinale' },
                                { icon: Award, label: 'Contrôle IA', sub: 'Qualité Certifiée' },
                                { icon: Utensils, label: 'Cuisine Minute', sub: 'Fait Maison' },
                                { icon: Star, label: 'Service Premium', sub: 'Satisfaction' },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center group">
                                    <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-amber-600">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{step.label}</h3>
                                    <p className="text-sm text-gray-500">{step.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reservation CTA - Elegant */}
            <section id="reservation" className="py-24 bg-amber-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-black mb-8">
                        Réservez Votre Moment
                    </h2>
                    <p className="text-xl text-amber-100/80 mb-12 max-w-2xl mx-auto font-light">
                        Pour un dîner romantique, un repas d'affaires ou une célébration.
                        Laissez-nous vous offrir une parenthèse inoubliable.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                        <div className="flex items-center gap-3 text-2xl font-serif">
                            <Phone className="w-6 h-6 text-amber-400" />
                            <span>+237 6XX 00 00 00</span>
                        </div>
                        <div className="hidden md:block w-px h-8 bg-white/20"></div>
                        <Button size="xl" className="rounded-full bg-white text-amber-900 hover:bg-amber-50 px-10 h-16 text-lg font-bold shadow-2xl">
                            Réserver en Ligne
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
