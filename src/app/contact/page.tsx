'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MapPin,
    Phone,
    Send,
    MessageSquare,
    Clock,
    ArrowRight,
    CheckCircle,
    Loader2
} from 'lucide-react';

export default function ContactPage() {
    const [interest, setInterest] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulation
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-gray-900 to-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/hero_bg.webp')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-black/60" />

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-white/10 backdrop-blur-md border border-white/20">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Support & Partenariat
                        </Badge>
                        <h1 className="text-white text-5xl md:text-6xl font-black mb-6 font-heading">
                            Contactez <span className="text-primary-400">TEDSAI</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Une question sur nos services IA ? Une réservation au restaurant ?
                            Ou simplement envie de discuter innovation ? Nous sommes à votre écoute.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-1 space-y-8"
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos Coordonnées</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Adresse Physique</h4>
                                            <p className="text-gray-600 font-bold">TEDSAI Complex</p>
                                            <p className="text-gray-600">Bastos, Face Usine Bastos</p>
                                            <p className="text-sm italic text-emerald-600">L'Algorithme Organique</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Emails par département</h4>
                                            <div className="text-sm space-y-1 mt-1">
                                                <p className="text-gray-600">Général: <span className="font-medium">hello@tedsai.cm</span></p>
                                                <p className="text-gray-600">viTEDia: <span className="font-medium">vitedia@tedsai.cm</span></p>
                                                <p className="text-gray-600">garden: <span className="font-medium">garden@tedsai.cm</span></p>
                                                <p className="text-gray-600">IA: <span className="font-medium">ia@tedsai.cm</span></p>
                                                <p className="text-gray-600">Design: <span className="font-medium">design@tedsai.cm</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Téléphone & WhatsApp</h4>
                                            <p className="text-gray-600 text-lg font-medium">+237 699 99 99 99</p>
                                            <p className="text-gray-500 text-sm">Disponible 7j/7 pour viTEDia</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-8 border-gray-100" />

                                <h4 className="font-semibold text-gray-900 mb-4">Heures d'ouverture</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Lundi - Vendredi</span>
                                        <span className="font-medium">08:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Samedi</span>
                                        <span className="font-medium">09:00 - 13:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dimanche</span>
                                        <span className="text-amber-600 font-medium">Fermé</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map Preview */}
                            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative shadow-lg group cursor-pointer">
                                <iframe
                                    src="https://maps.google.com/maps?q=3.814343,11.476492&hl=fr&z=15&output=embed"
                                    className="w-full h-full border-0 absolute inset-0"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a
                                        href="https://maps.app.goo.gl/PAqnePyormGahFcW9"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                    >
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                        Voir sur Google Maps
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
                            >
                                {submitted ? (
                                    <div className="text-center py-20">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        >
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                        </motion.div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Envoyé !</h3>
                                        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                                            Merci de nous avoir contactés. Notre équipe a bien reçu votre demande et vous répondra très rapidement.
                                        </p>
                                        <Button
                                            onClick={() => setSubmitted(false)}
                                            size="lg"
                                            className="bg-gray-900 text-white hover:bg-gray-800"
                                        >
                                            Envoyer un autre message
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h2>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Email professionnel</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                                        placeholder="john@entreprise.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Je suis intéressé par</label>
                                                <select
                                                    value={interest}
                                                    onChange={(e) => setInterest(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                                                    required
                                                >
                                                    <option value="">-- Sélectionnez un sujet --</option>
                                                    <option value="ia">🧠 Solutions IA (B2B)</option>
                                                    <option value="resto">🍽️ Restaurant viTEDia</option>
                                                    <option value="garden">🌱 Garden & Paniers Bio</option>
                                                    <option value="design">🎨 Infographie & Design</option>
                                                    <option value="shop">🛒 Boutique & Produits</option>
                                                    <option value="other">💬 Autre demande</option>
                                                </select>
                                            </div>

                                            {interest === 'ia' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-4"
                                                >
                                                    <h4 className="font-semibold text-blue-900">Détails de votre projet IA</h4>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-blue-800">Nom de l'entreprise</label>
                                                            <input type="text" className="w-full px-4 py-2 rounded-lg border-blue-200 focus:border-blue-500 outline-none" placeholder="Votre société" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-blue-800">Taille équipe</label>
                                                            <select className="w-full px-4 py-2 rounded-lg border-blue-200 focus:border-blue-500 outline-none bg-white">
                                                                <option>1-10 employés</option>
                                                                <option>11-50 employés</option>
                                                                <option>50+ employés</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {interest === 'resto' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4"
                                                >
                                                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold text-amber-900 mb-1">Réservation Rapide</h4>
                                                        <p className="text-amber-800 text-sm mb-3">
                                                            Pour une confirmation immédiate, nous vous recommandons d'utiliser notre système de réservation dédié.
                                                        </p>
                                                        <Link href="/vitedia/reservation">
                                                            <Button size="sm" variant="outline" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100">
                                                                Aller aux réservations
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Message</label>
                                                <textarea
                                                    rows={6}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                                                    placeholder="Dites-nous en plus sur votre besoin..."
                                                ></textarea>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full text-lg h-14"
                                                size="lg"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        Envoyer le Message
                                                        <Send className="w-5 h-5 ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
