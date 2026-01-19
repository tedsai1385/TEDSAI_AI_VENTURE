'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MenuDuJour() {
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        const d = new Date();
        // Format French Date: "Lundi 20 Janvier"
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setDate(formatter.format(d));
    }, []);

    const menuItems = {
        entree: { name: "Velouté de Courge & Gingembre", price: "4 500" },
        plat: { name: "Capitaine Braisé aux Épices Kribiennes", price: "12 000" },
        dessert: { name: "Mousse Passion & Copeaux de Coco", price: "3 500" }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto py-12 px-8">
            {/* Background Texture - Simulating Parchment */}
            <div className="absolute inset-0 bg-[#f4e4bc] rounded-sm shadow-2xl transform rotate-1 z-0 border-8 border-double border-[#8b5a2b]/30"
                style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(139, 90, 43, 0.1) inset'
                }}
            />

            {/* Content Container */}
            <motion.div
                className="relative z-10 text-center text-[#5c4033]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Header */}
                <div className="mb-8 border-b-2 border-[#8b5a2b]/20 pb-6 mx-8">
                    <h3 className="font-serif italic text-xl text-[#8b5a2b] mb-2">~ Le Menu du Marché ~</h3>
                    <h2 className="font-serif text-3xl font-bold capitalize tracking-wide">{date}</h2>
                </div>

                {/* Courses */}
                <div className="space-y-8 px-4">

                    {/* Entrée */}
                    <div className="group cursor-default">
                        <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-1">Pour Commencer</span>
                        <h4 className="font-serif text-2xl font-semibold mb-1 group-hover:text-[#8b5a2b] transition-colors">
                            {menuItems.entree.name}
                        </h4>
                        <div className="w-12 h-0.5 bg-[#8b5a2b]/20 mx-auto my-2 group-hover:w-24 transition-all duration-500" />
                        <span className="font-bold text-lg">{menuItems.entree.price} FCFA</span>
                    </div>

                    {/* Plat */}
                    <div className="group cursor-default transform scale-105">
                        <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-1">La Pièce Maîtresse</span>
                        <h4 className="font-serif text-3xl font-bold mb-1 text-[#8b5a2b]">
                            {menuItems.plat.name}
                        </h4>
                        <p className="text-sm italic opacity-80 mb-2">Accompagné de riz parfumé et plantains mûrs</p>
                        <div className="w-16 h-0.5 bg-[#8b5a2b]/40 mx-auto my-2 group-hover:w-32 transition-all duration-500" />
                        <span className="font-bold text-xl">{menuItems.plat.price} FCFA</span>
                    </div>

                    {/* Dessert */}
                    <div className="group cursor-default">
                        <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-1">Douceur Finale</span>
                        <h4 className="font-serif text-2xl font-semibold mb-1 group-hover:text-[#8b5a2b] transition-colors">
                            {menuItems.dessert.name}
                        </h4>
                        <div className="w-12 h-0.5 bg-[#8b5a2b]/20 mx-auto my-2 group-hover:w-24 transition-all duration-500" />
                        <span className="font-bold text-lg">{menuItems.dessert.price} FCFA</span>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-12 text-sm italic opacity-75 border-t border-[#8b5a2b]/20 pt-6 mx-12">
                    "Une cuisine sincère, inspirée par la terre et sublimée par la passion."
                </div>
            </motion.div>

            {/* Decorative Stamps or Corners could go here */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#8b5a2b]/30" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#8b5a2b]/30" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#8b5a2b]/30" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#8b5a2b]/30" />
        </div>
    );
}
