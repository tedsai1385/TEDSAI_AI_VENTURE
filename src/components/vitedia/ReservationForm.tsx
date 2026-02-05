'use client';

import React, { useState } from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Users, Clock, Phone, CheckCircle } from 'lucide-react';
import { useReservationStore } from '@/lib/store/reservation-store';
import { cn } from '@/lib/utils';

export const ReservationForm = ({ isInline = false }: { isInline?: boolean }) => {
    const { addReservation } = useReservationStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 2,
        name: '',
        phone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addReservation({
            ...formData,
            guests: Number(formData.guests)
        });
        setStep(2); // Show confirmation
    };

    const handleWhatsApp = () => {
        const message = `Bonjour, je souhaite réserver : ${formData.date} à ${formData.time} pour ${formData.guests} personnes. Nom: ${formData.name}`;
        window.open(`https://wa.me/237600000000?text=${encodeURIComponent(message)}`, '_blank');
    };

    const formContent = (
        <div className={cn("relative overflow-hidden", isInline ? "" : "max-w-md mx-auto")}>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-heading font-bold mb-4">Réserver votre Table</h2>
                <p className="text-gray-600 italic">
                    Réponse immédiate garantie.
                </p>
            </div>

            <Card padded className="bg-white shadow-xl border-t-4 border-[var(--color-accent)]">
                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} /> Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Heure */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock size={16} /> Heure
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                >
                                    <option value="">Choisir</option>
                                    <option value="12:00">12:00</option>
                                    <option value="12:30">12:30</option>
                                    <option value="13:00">13:00</option>
                                    <option value="13:30">13:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                    <option value="20:00">20:00</option>
                                    <option value="20:30">20:30</option>
                                    <option value="21:00">21:00</option>
                                </select>
                            </div>
                        </div>

                        {/* Personnes */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Users size={16} /> Nombre de personnes
                            </label>
                            <div className="flex gap-2 justify-center bg-gray-50 p-2 rounded-lg">
                                {[1, 2, 3, 4, 5, 6, "7+"].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, guests: Number(num) || 8 })}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${(formData.guests === num || (num === "7+" && formData.guests > 6))
                                            ? 'bg-[var(--color-accent)] text-white shadow-md scale-110'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Votre nom"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone size={16} /> WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="6XX XX XX XX"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button fullWidth size="lg" variant="accent" type="submit" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white">
                            Confirmer la Réservation
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Demande Reçue !</h3>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                            Merci {formData.name}, nous avons bien reçu votre demande pour {formData.guests} personnes.
                        </p>
                        <Button onClick={handleWhatsApp} fullWidth variant="accent" className="bg-green-600 hover:bg-green-700 text-white">
                            WhatsApp Direct
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );

    if (isInline) return formContent;

    return (
        <Section id="reservation" spacing="base" className="bg-white">
            <Container size="md">
                {formContent}
            </Container>
        </Section>
    );
};
