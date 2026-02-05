import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Truck, Smartphone, CreditCard } from 'lucide-react';

export const CommandeLivraison = () => {
    return (
        <Section spacing="base" className="bg-white">
            <Container>
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <Badge variant="secondary" className="mb-4">viTEDia at Home</Badge>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            L'expérience viTEDia <br />
                            <span className="text-[var(--color-primary)]">chez vous</span>.
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                            Profitez de notre carte et de nos produits frais sans bouger.
                            Livraison rapide et sécurisée dans tout Yaoundé centre.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <Card padded={false} className="p-4 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Livraison Express</h4>
                                    <p className="text-sm text-gray-500">Moins de 45 min pour le centre-ville.</p>
                                </div>
                            </Card>
                            <Card padded={false} className="p-4 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-full">
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Commande WhatsApp</h4>
                                    <p className="text-sm text-gray-500">Un message suffit pour commander.</p>
                                </div>
                            </Card>
                            <Card padded={false} className="p-4 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Zones Couvertes</h4>
                                    <p className="text-sm text-gray-500">Bastos, Omnisports, Centre, Golf.</p>
                                </div>
                            </Card>
                            <Card padded={false} className="p-4 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Paiement Mobile</h4>
                                    <p className="text-sm text-gray-500">Orange Money & MTN MoMo acceptés.</p>
                                </div>
                            </Card>
                        </div>

                        <Button size="lg" variant="primary" leftIcon={<Truck size={20} />}>
                            Voir la carte livraison
                        </Button>
                    </div>

                    <div className="flex-1 w-full h-[400px] bg-gray-100 rounded-3xl overflow-hidden relative shadow-inner">
                        {/* Placeholder Map */}
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl tracking-widest">
                            CARTE ZONE LIVRAISON
                        </div>
                        {/* Overlay Zone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--color-primary)] opacity-20 rounded-full blur-xl animate-pulse" />

                        <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                            <div>
                                <div className="font-bold text-gray-900">Livraison Gratuite</div>
                                <div className="text-sm text-gray-500">Dès 15 000 FCFA de commande</div>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                0F
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
