import React from 'react';
import { Container, Section } from '../ui/Container';
import { Card } from '../ui/card';
import { MessageSquare, PenTool, CheckCircle, Send } from 'lucide-react';

export const ProcessDesign = () => {
    const steps = [
        {
            num: "01",
            icon: <MessageSquare size={24} />,
            title: "Le Brief",
            desc: "Nous discutons de votre vision, de vos valeurs et de vos objectifs. Nous analysons votre concurrence."
        },
        {
            num: "02",
            icon: <PenTool size={24} />,
            title: "Création",
            desc: "Nos designers explorent plusieurs pistes créatives et vous présentent les concepts les plus forts."
        },
        {
            num: "03",
            icon: <CheckCircle size={24} />,
            title: "Affinement",
            desc: "Nous peaufinons le design choisi selon vos retours jusqu'à ce qu'il soit pixel-perfect."
        },
        {
            num: "04",
            icon: <Send size={24} />,
            title: "Livraison",
            desc: "Vous recevez tous les fichiers sources et formats nécessaires pour l'impression et le web."
        }
    ];

    return (
        <Section spacing="lg" className="bg-white">
            <Container>
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <div className="text-[var(--color-primary)] font-bold tracking-widest text-sm uppercase mb-4">
                            Méthodologie
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-6">Un Process Créatif <br />Simple et Efficace</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Nous savons que votre temps est précieux. Notre workflow est conçu pour minimiser les allers-retours inutiles tout en maximisant la créativité.
                        </p>

                        {/* Vertical Timeline */}
                        <div className="space-y-8 relative pl-8 border-l-2 border-gray-100">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-white border-2 border-[var(--color-primary)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                                        {step.num}
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            {step.icon}
                                            <h3 className="font-bold text-lg">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative h-[600px] w-full hidden lg:block">
                        <div className="absolute inset-0 bg-gray-100 rounded-3xl overflow-hidden shadow-2xl skew-y-3 transform origin-top-left transition-all hover:skew-y-0 duration-700">
                            {/* Visual representation of a workspace/moodboard */}
                            <div className="absolute top-10 left-10 right-10 bottom-10 bg-white shadow-sm p-4 grid grid-cols-2 gap-4">
                                <div className="bg-purple-100 rounded-lg aspect-square" />
                                <div className="bg-pink-100 rounded-lg aspect-square" />
                                <div className="bg-blue-100 rounded-lg aspect-square col-span-2" />
                            </div>

                            {/* Floating Tools */}
                            <Card className="absolute top-20 -right-10 w-48 p-4 shadow-xl z-10 animate-pulse">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="text-xs font-bold text-gray-400">Color Palette</div>
                                </div>
                                <div className="flex gap-1 h-8">
                                    <div className="flex-1 bg-[#2C3E50]" />
                                    <div className="flex-1 bg-[#E74C3C]" />
                                    <div className="flex-1 bg-[#ECF0F1]" />
                                </div>
                            </Card>

                            <Card className="absolute bottom-40 -left-10 w-48 p-4 shadow-xl z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <div className="text-xs font-bold text-gray-400">Typography</div>
                                </div>
                                <div className="text-2xl font-heading font-bold">Aa</div>
                                <div className="text-xs text-gray-400">Playfair Display</div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
