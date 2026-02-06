'use client';

import { motion } from 'framer-motion';
import { Leaf, Cpu, Users } from 'lucide-react';
import { Button } from '@/components/ui/button-mobile';

const principles = [
    {
        icon: Leaf,
        title: "Agriculture Urbaine",
        description: "Solutions durables pour villes intelligentes",
        color: "bg-green-500",
    },
    {
        icon: Cpu,
        title: "Intelligence Artificielle",
        description: "Optimisation par data et algorithmes",
        color: "bg-purple-500",
    },
    {
        icon: Users,
        title: "Impact Social",
        description: "Emplois et formation locale",
        color: "bg-blue-500",
    },
];

export function Principles() {
    return (
        <section className="py-8 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

                {/* Titre section */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-fluid-2xl sm:text-fluid-3xl font-bold text-center text-gray-900 mb-6 sm:mb-12"
                >
                    Nos Trois Piliers
                </motion.h2>

                {/* ═══════════════════════════════════════════════════════════════
            GRID : 3 colonnes desktop, horizontal scroll sur mobile
            ═══════════════════════════════════════════════════════════════ */}
                <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">

                    {principles.map((principle, index) => (
                        <motion.div
                            key={principle.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-[85vw] sm:w-auto snap-center"
                        >
                            <Button
                                variant="outline"
                                className="w-full h-auto p-3 sm:p-6 flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-4 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left sm:text-center whitespace-normal"
                            >
                                <div className={`${principle.color} p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0`}>
                                    <principle.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-lg truncate">
                                        {principle.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                                        {principle.description}
                                    </p>
                                </div>
                            </Button>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
