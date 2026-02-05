'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ArticleFiltersProps {
    selected: string;
    onChange: (category: string) => void;
    counts: Record<string, number>;
}

const CATEGORIES = [
    { id: 'all', label: 'Tous' },
    { id: 'agriculture-urbaine', label: 'Agu-Urbaine' },
    { id: 'intelligence-artificielle', label: 'IA' },
    { id: 'tech-for-good', label: 'Tech4Good' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'durable', label: 'Durable' },
];

export function ArticleFilters({ selected, onChange, counts }: ArticleFiltersProps) {
    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="w-full border-y border-gray-800 bg-black/40 backdrop-blur top-0 z-20 sticky">
            <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                    {CATEGORIES.map((cat) => {
                        const count = cat.id === 'all' ? totalCount : (counts[cat.id] || 0);
                        const isActive = selected === cat.id;

                        return (
                            <Button
                                key={cat.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(cat.id)}
                                className={cn(
                                    "rounded-full border transition-all duration-300",
                                    isActive
                                        ? "bg-purple-900/30 border-purple-500 text-purple-200"
                                        : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white hover:bg-gray-900"
                                )}
                            >
                                {cat.label}
                                <span className={cn(
                                    "ml-2 text-xs py-0.5 px-1.5 rounded-full",
                                    isActive ? "bg-purple-500/20 text-purple-200" : "bg-gray-800 text-gray-500"
                                )}>
                                    {count}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 rounded-full border-2 border-purple-500/50 pointer-events-none"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
