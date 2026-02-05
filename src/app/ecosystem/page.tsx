'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Network,
    Leaf,
    Utensils,
    Brain,
    ArrowRight,
    Zap,
    TrendingUp,
    Users,
    Recycle,
    CheckCircle,
    ShoppingBag,
    Calendar,
    Cloud,
    Globe
} from 'lucide-react';

export default function EcosystemPage() {
    const steps = [
        { title: "1. SEMIS", desc: "L'IA sélectionne la variété optimale selon la saison et la demande prévue." },
        { title: "2. CULTURE", desc: "Capteurs IoT surveillent pH (6.8), température (24°C), oxygène en temps réel." },
        { title: "3. RÉCOLTE", desc: "Chaque matin à 6h30, nos cultivateurs récoltent les produits à maturité parfaite." },
        { title: "4. TRAÇABILITÉ", desc: "Chaque lot reçoit un QR code lié à une transaction blockchain (Celo)." },
        { title: "5. TRANSFORMATION", desc: "Les chefs de viTEDia créent des plats fusion avec les produits du jour." },
        { title: "6. SERVICE", desc: "Le client scanne son plat et vérifie tout le parcours en 10 secondes." },
        { title: "7. FEEDBACK", desc: "Les retours clients enrichissent nos algorithmes de prédiction." },
    ];

    const stats = [
        { label: "Gaspillage alimentaire", tedsai: "-40%", industrial: "30% (pertes)" },
        { label: "Consommation d'eau", tedsai: "-60%", industrial: "Culture classique" },
        { label: "Temps récolte → assiette", tedsai: "4 heures", industrial: "48 heures" },
        { label: "Précision prédictive IA", tedsai: "98.7%", industrial: "N/A" },
        { label: "PME accompagnées", tedsai: "47", industrial: "—" },
    ];

    return (
        <main className="min-h-screen bg-[#F8F5F0]">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden bg-[#0A2540] text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/hero_main.png')] bg-cover bg-center mix-blend-overlay" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <Badge variant="accent" className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Manifeste TEDSAI
                        </Badge>
                        <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight">
                            De la Terre au Cloud : <br />
                            <span className="text-emerald-400">L'Écosystème TEDSAI</span>
                        </h1>
                        <p className="text-2xl text-gray-300 mb-8 font-light italic">
                            Un modèle unique où chaque élément nourrit l'autre.
                        </p>
                        <div className="h-1 w-24 bg-emerald-500 mb-8" />
                        <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                            TEDSAI Complex n'est pas une simple entreprise : c'est un organisme vivant où les données alimentent le sol, le sol nourrit l'assiette, et l'assiette finance l'innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24 border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#0A2540]">Synergie Totale</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Basé à Yaoundé, notre écosystème réunit cinq piliers interconnectés : SelecTED Garden, un restaurant traçable, une boutique de produits locaux, des solutions IA pour entreprises et un studio d'infographie.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Chaque pilier renforce les autres. C'est la synergie TEDSAI.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Link href="/vitedia">
                                    <Button className="bg-[#0A2540]">viTEDia</Button>
                                </Link>
                                <Link href="/garden-selected">
                                    <Button variant="outline">SelecTED Garden</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-emerald-100 rounded-3xl p-8 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative w-full h-full border-2 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center"
                                >
                                    <div className="absolute top-0 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg">
                                        <Leaf className="text-emerald-600 w-8 h-8" />
                                    </div>
                                    <div className="absolute right-0 transform translate-x-1/2 bg-white p-4 rounded-xl shadow-lg">
                                        <Brain className="text-blue-600 w-8 h-8" />
                                    </div>
                                    <div className="absolute bottom-0 transform translate-y-1/2 bg-white p-4 rounded-xl shadow-lg">
                                        <Utensils className="text-orange-600 w-8 h-8" />
                                    </div>
                                    <div className="absolute left-0 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg">
                                        <ShoppingBag className="text-purple-600 w-8 h-8" />
                                    </div>
                                </motion.div>
                                <div className="absolute center bg-white p-8 rounded-full shadow-2xl">
                                    <Globe className="w-12 h-12 text-[#0A2540]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Chain Timeline */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#0A2540] mb-4">De la Racine à Votre Assiette</h2>
                        <p className="text-xl text-gray-500">7 Étapes Vérifiées & Traçables</p>
                    </div>

                    <div className="relative space-y-12">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />

                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center md:justify-between group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="hidden md:block w-5/12" />
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow md:-translate-x-2 z-10" />
                                <div className="w-11/12 md:w-5/12 pl-16 md:pl-0">
                                    <Card className="border-none shadow-md group-hover:shadow-lg transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-emerald-700">{step.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact table */}
            <section className="py-24 bg-emerald-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#0A2540] mb-4">La Preuve par les Chiffres</h2>
                        <p className="text-xl text-gray-600">Performance TEDSAI vs Standards Industriels</p>
                    </div>

                    <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0A2540] text-white">
                                    <th className="p-6 font-bold">Indicateur</th>
                                    <th className="p-6 font-bold">Valeur TEDSAI</th>
                                    <th className="p-6 font-bold">Standard Industrie</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.map((stat, i) => (
                                    <tr key={i} className="hover:bg-emerald-50/50 transition-colors">
                                        <td className="p-6 font-medium text-gray-700">{stat.label}</td>
                                        <td className="p-6 text-emerald-600 font-bold">{stat.tedsai}</td>
                                        <td className="p-6 text-gray-400">{stat.industrial}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-bold text-[#0A2540] mb-8 leading-tight">
                                L'Afrique Ne Suit Pas la Tech — <br />
                                <span className="text-emerald-600">Elle La Redéfinit</span>
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Chez TEDSAI, nous croyons que l'innovation africaine ne doit pas copier le Nord. Elle doit s'inventer à partir de ses racines.
                                </p>
                                <p>
                                    C'est pourquoi nos algorithmes sont entraînés sur des données camerounaises : météo de Yaoundé, cycles de culture locaux, comportements de consommation réels.
                                </p>
                                <p className="font-medium text-[#0A2540]">
                                    Notre promesse : une technologie qui comprend le terrain, pas une solution générique importée.
                                </p>
                            </div>

                            <blockquote className="mt-12 p-8 bg-[#F8F5F0] border-l-4 border-emerald-500 rounded-r-2xl italic text-xl text-gray-700 shadow-sm">
                                "La terre code, nous cultivons."
                                <footer className="mt-4 not-italic font-bold text-[#0A2540]">
                                    — Dr. TED, Fondateur TEDSAI Complex
                                </footer>
                            </blockquote>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="aspect-video bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <img src="/images/ia_dashboard.png" alt="Intelligence Artificielle" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#0A2540] text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-8">Prêt à rejoindre l'écosystème ?</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/vitedia">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none h-14 px-8 rounded-full text-lg">
                                <Utensils className="mr-2" /> Réserver au Restaurant
                            </Button>
                        </Link>
                        <Link href="/boutique">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] h-14 px-8 rounded-full text-lg">
                                <ShoppingBag className="mr-2" /> Commander à la Boutique
                            </Button>
                        </Link>
                        <Link href="/solutions-ia">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] h-14 px-8 rounded-full text-lg">
                                <Brain className="mr-2" /> Solutions pour Entreprises
                            </Button>
                        </Link>
                        <Link href="/garden-selected">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] h-14 px-8 rounded-full text-lg">
                                <Calendar className="mr-2" /> Visiter SelecTED Garden
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
