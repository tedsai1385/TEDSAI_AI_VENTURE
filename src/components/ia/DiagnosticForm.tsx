'use client';

import React, { useState } from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, ArrowRight, Building2, Users, LineChart } from 'lucide-react';

export const DiagnosticForm = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        sector: '',
        painPoint: '',
        whatsappVolume: '',
        contact: { name: '', company: '', phone: '' }
    });

    const handleNext = () => setStep(step + 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // API call would go here
    };

    if (submitted) {
        return (
            <Section id="diagnostic" spacing="base" className="bg-blue-50">
                <Container size="sm">
                    <Card className="text-center py-12 px-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Diagnostic en Cours...</h2>
                        <p className="text-gray-600 mb-8">
                            Merci {formData.contact.name}. Notre algorithme analyse votre profil.
                            Un consultant expert vous contactera sous 24h avec un plan d'action personnalisé pour {formData.contact.company}.
                        </p>
                        <Button variant="outline" onClick={() => setSubmitted(false)}>Retour</Button>
                    </Card>
                </Container>
            </Section>
        );
    }

    return (
        <Section id="diagnostic" spacing="base" className="bg-[var(--color-primary-50)]">
            <Container size="md">
                <div className="text-center mb-10">
                    <Badge variant="accent" className="mb-4">Gratuit</Badge>
                    <h2 className="text-3xl font-heading font-bold mb-4">Votre Entreprise est-elle prête pour l'IA ?</h2>
                    <p className="text-gray-600">Répondez à 3 questions et recevez une estimation de vos gains potentiels.</p>
                </div>

                <Card className="p-8 shadow-xl bg-white relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                        <div
                            className="h-full bg-[var(--color-accent)] transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Building2 className="text-[var(--color-accent)]" />
                                    Quelle est votre activité principale ?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Restauration / Bar', 'Commerce / Retail', 'Santé / Clinique', 'Services / Agence', 'Immobilier', 'Autre'].map((sec) => (
                                        <button
                                            key={sec}
                                            type="button"
                                            onClick={() => { setFormData({ ...formData, sector: sec }); handleNext(); }}
                                            className={`p-4 rounded-xl border text-left hover:border-[var(--color-accent)] hover:bg-blue-50 transition-all ${formData.sector === sec ? 'border-[var(--color-accent)] bg-blue-50 ring-1 ring-[var(--color-accent)]' : 'border-gray-200'}`}
                                        >
                                            <span className="font-medium">{sec}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Button size="sm" variant="ghost" onClick={() => setStep(1)} className="mb-2 p-0 h-auto text-gray-400 hover:text-gray-600">← Retour</Button>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <LineChart className="text-[var(--color-accent)]" />
                                    Votre plus gros défi actuel ?
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        'Je perds trop de temps à répondre sur WhatsApp',
                                        'J\'ai des erreurs de stock / commandes',
                                        'Je ne sais pas quoi commander à l\'avance',
                                        'Mes clients se plaignent de la lenteur',
                                        'Je veux juste augmenter mes ventes'
                                    ].map((pain) => (
                                        <button
                                            key={pain}
                                            type="button"
                                            onClick={() => { setFormData({ ...formData, painPoint: pain }); handleNext(); }}
                                            className="w-full p-4 rounded-xl border border-gray-200 text-left hover:border-[var(--color-accent)] hover:bg-blue-50 transition-all"
                                        >
                                            {pain}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Button size="sm" variant="ghost" onClick={() => setStep(2)} className="mb-2 p-0 h-auto text-gray-400 hover:text-gray-600">← Retour</Button>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Users className="text-[var(--color-accent)]" />
                                    Où envoyer votre rapport ?
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
                                            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, name: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
                                            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, company: e.target.value } })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone / WhatsApp</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="6XX XX XX XX"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
                                            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" fullWidth size="lg" variant="primary" rightIcon={<ArrowRight size={20} />}>
                                    Obtenir mon Diagnostic Gratuit
                                </Button>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Vos données sont confidentielles. Analyse effectuée par IA sécurisée.
                                </p>
                            </div>
                        )}
                    </form>
                </Card>
            </Container>
        </Section>
    );
};
