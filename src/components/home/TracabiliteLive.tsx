import React from 'react';
import { FadeInOnScroll } from '../utils/FadeInOnScroll';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { QrCode, MapPin, Calendar, Database, Apple } from 'lucide-react';
import Link from 'next/link';

export const TracabiliteLive = () => {
    return (
        <Section spacing="base" className="bg-[var(--color-secondary)] text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-secondary-light)] opacity-20 -skew-x-12 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Side */}
                    <div className="flex-1">
                        <FadeInOnScroll direction="right">
                            <Badge variant="accent" className="mb-6 bg-[var(--color-accent)] text-white border-none">
                                Innovation TEDSAI
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                                Traçabilité : <br />
                                <span className="text-[var(--color-accent)]">La Preuve en Direct</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                Scannez ce QR code et voyez le parcours complet d'un produit TEDSAI :
                            </p>
                        </FadeInOnScroll>

                        <div className="flex flex-col gap-4">
                            <FadeInOnScroll delay={0.2} direction="right">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-white/10 shrink-0">
                                        <MapPin size={24} className="text-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Origine Garantie</h4>
                                        <p className="text-gray-400 text-sm">Géolocalisation précise de la parcelle de culture.</p>
                                    </div>
                                </div>
                            </FadeInOnScroll>
                            <FadeInOnScroll delay={0.3} direction="right">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-white/10 shrink-0">
                                        <Calendar size={24} className="text-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Fraîcheur Absolue</h4>
                                        <p className="text-gray-400 text-sm">Date et heure exacte de la récolte (souvent &lt; 24h).</p>
                                    </div>
                                </div>
                            </FadeInOnScroll>
                        </div>
                    </div>

                    {/* Interactive Widget Side */}
                    <div className="flex-1 w-full max-w-md">
                        <FadeInOnScroll direction="left" delay={0.2}>
                            <Card variant="glass" padded className="w-full bg-white text-[var(--color-text-primary)] shadow-2xl overflow-hidden relative hover:scale-105 transition-transform duration-500">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Fiche Produit #TDS-0126</div>
                                        <h3 className="text-2xl font-bold font-heading">Basilic Genovese</h3>
                                    </div>
                                    <QrCode size={48} className="text-[var(--color-text-primary)] opacity-80 animate-pulse" />
                                </div>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { icon: <Calendar size={16} />, label: "Date Récolte", value: "Aujourd'hui, 06:30", color: "text-[var(--color-primary)]" },
                                        { icon: <Database size={16} />, label: "Hash Blockchain", value: "0x3F7a...", color: "" },
                                        { icon: <MapPin size={16} />, label: "Destination", value: "Restaurant viTEDia", color: "" },
                                        { icon: <Apple size={16} />, label: "Nutriments", value: "100% Organique", color: "text-green-600" }
                                    ].map((item, i) => (
                                        <FadeInOnScroll key={i} delay={0.4 + (i * 0.1)} direction="none">
                                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    {item.icon} {item.label}
                                                </div>
                                                <div className={`font-medium ${item.color}`}>{item.value}</div>
                                            </div>
                                        </FadeInOnScroll>
                                    ))}
                                </div>

                                <Link href="/vitedia">
                                    <Button fullWidth variant="primary" className="hover:scale-105 transition-transform">
                                        Voir la fiche complète
                                    </Button>
                                </Link>
                            </Card>
                        </FadeInOnScroll>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
