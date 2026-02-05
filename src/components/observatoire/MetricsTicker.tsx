'use client';

import React, { useEffect } from 'react';
import { useMetricsStore } from '@/lib/store/metrics-store';
import { Thermometer, Droplets, Beaker, TrendingUp, Droplet, Leaf, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
}

const MetricItem = ({ icon, label, value, trend, color = 'text-green-400' }: MetricItemProps) => {
    const trendIcon = {
        up: '↑',
        down: '↓',
        stable: '→'
    };

    return (
        <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`${color}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white">{value}</span>
                    {trend && (
                        <span className={`text-xs ${trend === 'up' ? 'text-green-400' :
                                trend === 'down' ? 'text-red-400' :
                                    'text-gray-400'
                            }`}>
                            {trendIcon[trend]}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const MetricsTicker = () => {
    const { metrics, listenToMetrics, startAutoSimulation, stopAutoSimulation } = useMetricsStore();

    useEffect(() => {
        // Démarrer la simulation automatique
        startAutoSimulation();

        // Écouter les changements en temps réel
        const unsubscribe = listenToMetrics();

        return () => {
            stopAutoSimulation();
            unsubscribe();
        };
    }, []);

    if (!metrics) {
        return (
            <div className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm">Chargement des données agricoles...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white sticky top-0 z-40 shadow-lg"
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
                        {/* Température */}
                        <MetricItem
                            icon={<Thermometer size={18} />}
                            label="Température"
                            value={`${metrics.temperature.current}°C`}
                            trend={metrics.temperature.trend}
                            color="text-orange-400"
                        />

                        {/* Humidité */}
                        <MetricItem
                            icon={<Droplets size={18} />}
                            label="Humidité"
                            value={`${metrics.soilHumidity.current}%`}
                            color="text-blue-400"
                        />

                        {/* pH */}
                        <MetricItem
                            icon={<Beaker size={18} />}
                            label="pH Sol"
                            value={metrics.soilPH.current.toFixed(1)}
                            color="text-purple-400"
                        />

                        {/* Yield IA */}
                        <MetricItem
                            icon={<TrendingUp size={18} />}
                            label="Rendement IA"
                            value={`${metrics.yieldIndex.current}`}
                            trend={
                                metrics.yieldIndex.current > 80 ? 'up' :
                                    metrics.yieldIndex.current < 60 ? 'down' :
                                        'stable'
                            }
                            color="text-green-400"
                        />

                        {/* Eau */}
                        <MetricItem
                            icon={<Droplet size={18} />}
                            label="Eau Recyclée"
                            value={`${(metrics.waterRecycled.today / 1000).toFixed(1)}kL`}
                            color="text-cyan-400"
                        />

                        {/* CO2 */}
                        <MetricItem
                            icon={<Leaf size={18} />}
                            label="CO2 Économisé"
                            value={`${metrics.co2Saved.thisWeek.toFixed(0)} kg`}
                            color="text-emerald-400"
                        />

                        {/* Énergie */}
                        <MetricItem
                            icon={<Zap size={18} />}
                            label="Efficacité"
                            value={`${metrics.energyEfficiency.costIndex}`}
                            color="text-yellow-400"
                        />
                    </div>
                </div>

                {/* Pulse indicator (mise à jour toutes les 5min) */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-green-400/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 298 }} // 5 min - 2s
                />
            </motion.div>
        </AnimatePresence>
    );
};
