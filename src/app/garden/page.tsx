'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



import {
    Leaf,
    Sprout,
    Award,
    MapPin,
    Clock,
    CheckCircle,
    QrCode,
    ArrowRight,
    Sun,
    Droplets,
    ShoppingCart,
    Truck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function GardenPage() {
    const products = [
        {
            name: 'Tomates Bio',
            description: 'Tomates fraîches cultivées sans pesticides',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
            price: 2500,
            unit: 'kg',
            category: 'Légumes',
            inStock: true,
            traceability: {
                plot: 'Jardin A1',
                planted: '15 Nov 2025',
                harvest: '10 Jan 2026',
                certifications: ['Bio', 'Sans OGM'],
            },
        },
        {
            name: 'Épinards Frais',
            description: 'Épinards cultivés en agriculture urbaine',
            image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80',
            price: 1500,
            unit: 'botte',
            category: 'Légumes',
            inStock: true,
            traceability: {
                plot: 'Jardin A3',
                planted: '20 Nov 2025',
                harvest: '12 Jan 2026',
                certifications: ['Bio', 'Local'],
            },
        },
        {
            name: 'Piment Camerounais',
            description: 'Piment fort cultivé localement',
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
            price: 3000,
            unit: 'kg',
            category: 'Épices',
            inStock: true,
            traceability: {
                plot: 'Jardin D2',
                planted: '01 Oct 2025',
                harvest: '05 Jan 2026',
                certifications: ['Bio', 'Traçable'],
            },
        },
        {
            name: 'Poulet Fermier',
            description: 'Poulet élevé en plein air, nourri aux grains bio',
            image: 'https://images.unsplash.com/photo-1628773822990-202c0e5858c6?w=800&q=80',
            price: 8500,
            unit: 'kg',
            category: 'Élevage',
            inStock: true,
            traceability: {
                plot: 'Élevage B',
                raised: '01 Sep 2025',
                ready: '10 Jan 2026',
                certifications: ['Plein Air', 'Sans Antibiotiques'],
            },
        },
        {
            name: 'Œufs Bio',
            description: 'Œufs de poules élevées en liberté',
            image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80',
            price: 3500,
            unit: 'douzaine',
            category: 'Élevage',
            inStock: true,
            traceability: {
                plot: 'Élevage A',
                collected: '14 Jan 2026',
                certifications: ['Bio', 'Plein Air'],
            },
        },
        {
            name: 'Gingembre Frais',
            description: 'Gingembre cultivé sans produits chimiques',
            image: 'https://images.unsplash.com/photo-1617343267882-fa849d5ffe7f?w=800&q=80',
            price: 4000,
            unit: 'kg',
            category: 'Épices',
            inStock: true,
            traceability: {
                plot: 'Jardin D1',
                planted: '01 Aug 2025',
                harvest: '08 Jan 2026',
                certifications: ['Bio', 'Premium'],
            },
        },
    ];

    const categories = [
        { name: 'Légumes', icon: Leaf, count: 15, color: 'text-green-600' },
        { name: 'Épices', icon: Sprout, count: 8, color: 'text-orange-600' },
        { name: 'Élevage', icon: Sun, count: 5, color: 'text-amber-600' },
        { name: 'Fruits', icon: Droplets, count: 12, color: 'text-red-600' },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
                                    src="/assets/images/logos/garden_logo.jpg"
                                    alt="Logo SelecTED Garden"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <Badge variant="garden" className="mb-4">
                                <Leaf className="w-4 h-4" />
                                Agriculture Urbaine Durable
                            </Badge>

                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 font-heading">
                                Jardin & Épicerie <span className="text-garden-primary">SelecTED</span>
                            </h1>

                            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                                De la graine à l'assiette, découvrez nos produits cultivés avec passion
                                dans notre jardin urbain. Traçabilité totale, qualité bio, et soutien
                                aux producteurs locaux.
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {[
                                    { icon: CheckCircle, text: '100% Bio' },
                                    { icon: Leaf, text: 'Sans Pesticides' },
                                    { icon: Award, text: 'Certifié Local' },
                                    { icon: QrCode, text: 'Traçabilité QR' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                                        <feature.icon className="w-4 h-4 text-garden-primary" />
                                        <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="#products">
                                    <Button variant="garden" size="lg" rounded="full" className="shadow-xl">
                                        Voir les Produits
                                        <ShoppingCart className="w-5 h-5" />
                                    </Button>
                                </Link>

                                <Link href="#visit">
                                    <Button variant="outline" size="lg" rounded="full">
                                        Visiter le Jardin
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                                    <MapPin className="w-6 h-6 text-garden-primary flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-600">Localisation</div>
                                        <div className="font-semibold text-sm">Yaoundé, Cameroun</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                                    <Truck className="w-6 h-6 text-garden-primary flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-600">Livraison</div>
                                        <div className="font-semibold text-sm">24-48h</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image with Stats Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1591857177580-dc82b9e4e11c?w=1200&q=80"
                                    alt="Jardin SelecTED"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Stats Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl">🌱</div>
                                    <div>
                                        <div className="text-3xl font-bold text-garden-primary">40+</div>
                                        <div className="text-sm text-gray-600">Produits Bio</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
                            >
                                <cat.icon className={`w-12 h-12 ${cat.color} mb-4`} />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                                <p className="text-gray-600">{cat.count} produits</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
                            Nos Produits Frais
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tous nos produits sont cultivés avec soin et traçables du champ à votre table
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hover className="h-full group overflow-hidden">
                                    {/* Product Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-garden-primary shadow-lg">
                                            {formatCurrency(product.price)}/{product.unit}
                                        </div>
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="garden">{product.category}</Badge>
                                        </div>
                                        {/* Stock Badge */}
                                        {product.inStock && (
                                            <div className="absolute bottom-4 left-4">
                                                <Badge variant="success">En Stock</Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-xl">{product.name}</CardTitle>
                                        <CardDescription>{product.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Traceability */}
                                        <div className="space-y-2 mb-4">
                                            <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Traçabilité:
                                            </div>
                                            <div className="text-xs text-gray-600 pl-6 space-y-1">
                                                <div>• Parcelle: {product.traceability.plot}</div>
                                                {product.traceability.planted && (
                                                    <div>• Semis: {product.traceability.planted}</div>
                                                )}
                                                {product.traceability.harvest && (
                                                    <div>• Récolte: {product.traceability.harvest}</div>
                                                )}
                                            </div>

                                            {/* Certifications */}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {product.traceability.certifications.map((cert, j) => (
                                                    <Badge key={j} variant="success" className="text-xs">
                                                        ✓ {cert}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Button variant="garden" className="w-full" size="sm">
                                            <ShoppingCart className="w-4 h-4" />
                                            Ajouter au Panier
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supply Chain Section */}
            <section className="py-16 bg-gradient-to-r from-green-100 to-emerald-100">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold mb-8 font-heading">
                            Notre Processus de Production
                        </h2>

                        {/* Flow Diagram */}
                        <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
                            {[
                                { icon: Sprout, label: 'Semis Bio', color: 'text-green-700' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Droplets, label: 'Irrigation Naturelle', color: 'text-blue-600' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Sun, label: 'Culture Sans Pesticides', color: 'text-yellow-600' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: Leaf, label: 'Récolte Manuelle', color: 'text-green-600' },
                                { icon: ArrowRight, label: '', color: 'text-gray-400' },
                                { icon: ShoppingCart, label: 'Votre Table', color: 'text-garden-primary' },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${step.color}`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    {step.label && <div className="mt-2 text-sm font-medium max-w-[100px] text-center">{step.label}</div>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Visit CTA */}
            <section id="visit" className="py-20 bg-garden-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black mb-6 font-heading">
                            Visitez Notre Jardin Urbain
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Découvrez comment nous cultivons vos produits préférés.
                            Visites guidées tous les samedis matin.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                                <Clock className="w-5 h-5" />
                                <span>Samedi 9h-12h</span>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                                <MapPin className="w-5 h-5" />
                                <span>Yaoundé, Cameroun</span>
                            </div>
                        </div>

                        <Button size="xl" rounded="full" className="bg-white text-garden-primary hover:bg-gray-100 shadow-2xl">
                            Réserver une Visite
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
