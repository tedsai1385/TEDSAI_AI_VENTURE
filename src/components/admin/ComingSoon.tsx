'use client';

import { Sparkles, Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ComingSoonProps {
    title: string;
    description?: string;
}

export function ComingSoon({ title, description = "Nous travaillons d'arrache-pied sur cette fonctionnalité. Elle sera disponible très bientôt !" }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-cortex-restaurant/20 blur-3xl rounded-full" />
                <div className="relative w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-4 mx-auto animate-bounce shadow-2xl">
                    <Construction className="w-10 h-10 text-cortex-restaurant" />
                </div>
            </div>

            <div className="space-y-2 max-w-md relative z-10">
                <h2 className="text-3xl font-heading font-bold text-white tracking-tight">{title}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-cortex-garden via-cortex-restaurant to-cortex-shop mx-auto rounded-full" />
                <p className="text-zinc-500 mt-4 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/admin">
                    <Button variant="outline" className="border-neutral-800 text-zinc-400 hover:text-white hover:bg-white/5 h-12 px-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour au Dashboard
                    </Button>
                </Link>
                <Button className="bg-cortex-restaurant hover:bg-cortex-restaurant/90 text-white font-bold h-12 px-8 shadow-lg shadow-cortex-restaurant/20">
                    <Sparkles className="w-4 h-4 mr-2" /> Me notifier du lancement
                </Button>
            </div>

            <div className="pt-12 flex gap-8 opacity-20 filter grayscale">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-cortex-garden" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Garden</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-cortex-restaurant" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Resto</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-cortex-shop" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Shop</span>
                </div>
            </div>
        </div>
    );
}
