'use client';

import React, { useEffect } from 'react';
import { useMetricsStore } from '@/lib/store/metrics-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Play, Pause, Download, TrendingUp } from 'lucide-react';

export default function MetricsManagementPage() {
    const { metrics, isLoading, simulateUpdate, startAutoSimulation, stopAutoSimulation, listenToMetrics } = useMetricsStore();
    const [isSimulating, setIsSimulating] = React.useState(false);

    useEffect(() => {
        const unsubscribe = listenToMetrics();
        return () => unsubscribe();
    }, []);

    const toggleAutoSimulation = () => {
        if (isSimulating) {
            stopAutoSimulation();
            setIsSimulating(false);
        } else {
            startAutoSimulation();
            setIsSimulating(true);
        }
    };

    const exportData = () => {
        if (!metrics) return;

        const data = JSON.stringify(metrics, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metrics_${new Date().toISOString()}.json`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Métriques Agricoles Live</h1>
                    <p className="text-gray-300 mt-1 font-medium">
                        Simulation haute-fidélité des données agricoles temps réel
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={exportData}
                        leftIcon={<Download size={18} />}
                    >
                        Exporter JSON
                    </Button>
                    <Button
                        variant={isSimulating ? 'secondary' : 'ghost'}
                        onClick={toggleAutoSimulation}
                        leftIcon={isSimulating ? <Pause size={18} /> : <Play size={18} />}
                    >
                        {isSimulating ? 'Simulation Active' : 'Démarrer Simulation'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={simulateUpdate}
                        leftIcon={<RefreshCw size={18} />}
                    >
                        MAJ Manuelle
                    </Button>
                </div>
            </div>

            {/* Status */}
            <Card padded className="bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <div>
                            <h3 className="font-bold text-white">État du Système</h3>
                            <p className="text-sm text-gray-300 font-medium">
                                {isSimulating ? 'Simulation automatique active (rafraîchissement toutes les 5 min)' : 'Simulation en pause'}
                            </p>
                        </div>
                    </div>
                    {metrics && (
                        <Badge variant="outline">
                            Dernière MAJ: {metrics.updatedAt.toLocaleString('fr-FR')}
                        </Badge>
                    )}
                </div>
            </Card>

            {/* Metrics Details */}
            {isLoading ? (
                <Card padded className="bg-gray-800/60 border border-gray-700/50">
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </Card>
            ) : metrics ? (
                <div className="space-y-4">
                    {/* Temperature */}
                    <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg mb-2 text-white">🌡️ Température</h4>
                                <p className="text-4xl font-bold text-orange-400">{metrics.temperature.current}°C</p>
                                <div className="mt-4 text-sm text-gray-300 space-y-1 font-medium">
                                    <p>Plage optimale: {metrics.temperature.optimal[0]}-{metrics.temperature.optimal[1]}°C</p>
                                    <p>Tendance: <span className="font-semibold capitalize">{metrics.temperature.trend}</span></p>
                                    <p>Historique: {metrics.temperature.history.length} points (48h)</p>
                                </div>
                            </div>
                            <Badge variant={metrics.temperature.trend === 'up' ? 'success' : metrics.temperature.trend === 'down' ? 'warning' : 'secondary'}>
                                {metrics.temperature.trend === 'up' ? '↑ Hausse' : metrics.temperature.trend === 'down' ? '↓ Baisse' : '→ Stable'}
                            </Badge>
                        </div>
                    </Card>

                    {/* Grid Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Humidity */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">💧 Humidité Sol</h4>
                            <p className="text-3xl font-bold text-blue-400 mb-2">{metrics.soilHumidity.current}%</p>
                            <div className="text-sm text-gray-300 space-y-1 font-medium">
                                <p>Zone: <Badge>{metrics.soilHumidity.zone}</Badge></p>
                                <p>Alerte: {metrics.soilHumidity.alert ? '🔴 Oui' : '✅ Non'}</p>
                            </div>
                        </Card>

                        {/* pH */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">🧪 pH Sol</h4>
                            <p className="text-3xl font-bold text-purple-400 mb-2">{metrics.soilPH.current.toFixed(2)}</p>
                            <div className="text-sm text-gray-300">
                                <p>Statut: <Badge variant={metrics.soilPH.status === 'optimal' ? 'success' : 'warning'}>{metrics.soilPH.status}</Badge></p>
                            </div>
                        </Card>

                        {/* Yield */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">📈 Rendement IA</h4>
                            <p className="text-3xl font-bold text-green-400 mb-2">{metrics.yieldIndex.current}/100</p>
                            <div className="text-sm text-gray-300 space-y-1 font-medium">
                                <p>Prévision 7j: {metrics.yieldIndex.forecast}</p>
                                <p>Vs mois dernier: {metrics.yieldIndex.comparisonLastMonth > 0 ? '+' : ''}{metrics.yieldIndex.comparisonLastMonth.toFixed(1)}%</p>
                            </div>
                        </Card>

                        {/* Water */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">💦 Eau Recyclée</h4>
                            <p className="text-3xl font-bold text-cyan-400 mb-2">{(metrics.waterRecycled.today / 1000).toFixed(1)} kL</p>
                            <div className="text-sm text-gray-300 space-y-1 font-medium">
                                <p>Ce mois: {(metrics.waterRecycled.thisMonth / 1000).toFixed(1)} kL</p>
                                <p>Économie vs traditionnel: {metrics.waterRecycled.savedVsTraditional}%</p>
                            </div>
                        </Card>

                        {/* CO2 */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">🌿 CO2 Économisé</h4>
                            <p className="text-3xl font-bold text-emerald-400 mb-2">{metrics.co2Saved.totalKg.toFixed(0)} kg</p>
                            <div className="text-sm text-gray-300 space-y-1 font-medium">
                                <p>Cette semaine: {metrics.co2Saved.thisWeek.toFixed(1)} kg</p>
                                <p>Équivalent arbres: {metrics.co2Saved.equivalentTrees} arbres/an</p>
                            </div>
                        </Card>

                        {/* Energy */}
                        <Card padded className="bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 transition-colors backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 text-white">⚡ Efficacité Énergétique</h4>
                            <p className="text-3xl font-bold text-yellow-400 mb-2">{metrics.energyEfficiency.kwhPerKg} kWh/kg</p>
                            <div className="text-sm text-gray-300 space-y-1 font-medium">
                                <p>Renouvelable: {metrics.energyEfficiency.renewablePercent}%</p>
                                <p>Index coût: {metrics.energyEfficiency.costIndex}/100</p>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card padded className="bg-gray-800/60 border border-gray-700/50">
                    <p className="text-center text-gray-300 py-12">
                        Aucune donnée pour le moment. Cliquez sur "Démarrer Simulation" pour générer des métriques.
                    </p>
                </Card>
            )}
        </div>
    );
}
