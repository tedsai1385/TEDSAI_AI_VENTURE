'use client';

import React, { useEffect } from 'react';
import { useMetricsStore } from '@/lib/store/metrics-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Beaker, TrendingUp, Droplet, Leaf, Zap, RefreshCw, Play, Pause } from 'lucide-react';
import Link from 'next/link';

export default function ObservatoireDashboardPage() {
    const { metrics, isLoading, simulateUpdate, listenToMetrics, startAutoSimulation, stopAutoSimulation } = useMetricsStore();
    const [isSimulating, setIsSimulating] = React.useState(false);

    useEffect(() => {
        const unsubscribe = listenToMetrics();
        return () => unsubscribe();
    }, []);

    const handleManualUpdate = async () => {
        await simulateUpdate();
    };

    const toggleAutoSimulation = () => {
        if (isSimulating) {
            stopAutoSimulation();
            setIsSimulating(false);
        } else {
            startAutoSimulation();
            setIsSimulating(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Observatoire TEDSAI - Dashboard</h1>
                    <p className="text-gray-300 mt-1 font-medium">
                        Centre d'Intelligence Data & Expertises AgriTech
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={toggleAutoSimulation}
                        leftIcon={isSimulating ? <Pause size={18} /> : <Play size={18} />}
                    >
                        {isSimulating ? 'Arrêter Simulation' : 'Démarrer Simulation'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleManualUpdate}
                        leftIcon={<RefreshCw size={18} />}
                    >
                        Mettre à Jour Maintenant
                    </Button>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/observatoire/articles">
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80 hover:border-purple-500/30 transition-all cursor-pointer group backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Gérer Articles</h3>
                                <p className="text-sm text-gray-400">Publications, validations</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/observatoire/metrics">
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80 hover:border-blue-500/30 transition-all cursor-pointer group backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Métriques Live</h3>
                                <p className="text-sm text-gray-400">Données agricoles temps réel</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/observatoire" target="_blank">
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80 hover:border-green-500/30 transition-all cursor-pointer group backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Leaf className="text-green-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Voir Site Public</h3>
                                <p className="text-sm text-gray-400">Prévisualiser la page</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {/* Metrics Overview */}
            {isLoading ? (
                <Card padded className="bg-gray-800/60 border border-gray-700/50">
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </Card>
            ) : metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Temperature */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Thermometer className="text-orange-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">Température</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.temperature.current}°C</p>
                        <p className="text-xs text-gray-700 mt-1 font-semibold">
                            Optimal: {metrics.temperature.optimal[0]}-{metrics.temperature.optimal[1]}°C
                        </p>
                    </Card>

                    {/* Humidity */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Droplets className="text-blue-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">HUMIDITÉ SOL</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.soilHumidity.current}%</p>
                        <p className="text-xs text-gray-400 mt-1">Zone {metrics.soilHumidity.zone}</p>
                    </Card>

                    {/* pH */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Beaker className="text-purple-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">pH SOL</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.soilPH.current.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{metrics.soilPH.status}</p>
                    </Card>

                    {/* Yield */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-green-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">YIELD IA</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.yieldIndex.current}/100</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Prévision: {metrics.yieldIndex.forecast}
                        </p>
                    </Card>

                    {/* Water */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Droplet className="text-cyan-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">EAU RECYCLÉE</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{(metrics.waterRecycled.today / 1000).toFixed(1)}kL</p>
                        <p className="text-xs text-gray-400 mt-1">Économie: {metrics.waterRecycled.savedVsTraditional}%</p>
                    </Card>

                    {/* CO2 */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf className="text-emerald-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">CO2 ÉCONOMISÉ</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.co2Saved.totalKg.toFixed(0)} kg</p>
                        <p className="text-xs text-gray-400 mt-1">
                            ≈ {metrics.co2Saved.equivalentTrees} arbres/an
                        </p>
                    </Card>

                    {/* Energy */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-yellow-500" size={20} />
                            <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wide">ÉNERGIE</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{metrics.energyEfficiency.kwhPerKg} kWh/kg</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Renouvelable: {metrics.energyEfficiency.renewablePercent}%
                        </p>
                    </Card>

                    {/* Last Update */}
                    <Card padded className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 backdrop-blur-sm">
                        <div className="flex flex-col h-full justify-center">
                            <h4 className="font-semibold text-sm text-gray-300 mb-2">DERNIÈRE MAJ</h4>
                            <p className="text-lg font-bold text-purple-300">
                                {metrics.updatedAt.toLocaleTimeString('fr-FR')}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                Prochaine: {metrics.nextUpdate.toLocaleTimeString('fr-FR')}
                            </p>
                        </div>
                    </Card>
                </div>
            ) : (
                <Card padded className="bg-gray-800/60 border border-gray-700/50">
                    <p className="text-center text-gray-400">Aucune donnée pour le moment</p>
                </Card>
            )}
        </div>
    );
}
