import { create } from 'zustand';
import { doc, getDoc, setDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AgriculturalMetrics } from '@/types/observatoire';
import { generateMetricsSnapshot, generateInitialMetrics } from '@/lib/simulation/metrics-generator';
import { toast } from 'sonner';

interface MetricsStore {
    metrics: AgriculturalMetrics | null;
    isLoading: boolean;
    isSimulating: boolean;

    // Methods
    fetchMetrics: () => Promise<void>;
    listenToMetrics: () => () => void;
    simulateUpdate: () => Promise<void>;
    startAutoSimulation: () => void;
    stopAutoSimulation: () => void;
}

const METRICS_DOC_ID = 'live';
const SIMULATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

let simulationTimer: NodeJS.Timeout | null = null;
let unsubscribeListener: (() => void) | null = null;

export const useMetricsStore = create<MetricsStore>((set, get) => ({
    metrics: null,
    isLoading: false,
    isSimulating: false,

    /**
     * Récupère les métriques actuelles (one-time)
     */
    fetchMetrics: async () => {
        set({ isLoading: true });

        try {
            const metricsRef = doc(db, 'metrics', METRICS_DOC_ID);
            const snapshot = await getDoc(metricsRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const metrics: AgriculturalMetrics = {
                    ...data,
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                    nextUpdate: data.nextUpdate?.toDate() || new Date(),
                    temperature: {
                        ...data.temperature,
                        history: data.temperature.history?.map((h: any) => ({
                            timestamp: h.timestamp?.toDate() || new Date(),
                            value: h.value
                        })) || []
                    }
                } as AgriculturalMetrics;

                set({ metrics, isLoading: false });
            } else {
                // Première initialisation : créer des métriques
                console.log('📊 Initialisation des métriques...');
                const initialMetrics = generateInitialMetrics();
                await get().simulateUpdate();
            }
        } catch (error) {
            console.error('❌ Error fetching metrics:', error);
            toast.error('Erreur lors du chargement des métriques');
            set({ isLoading: false });
        }
    },

    /**
     * Écoute les changements en temps réel (real-time)
     */
    listenToMetrics: () => {
        // Nettoyer l'ancien listener si existant
        if (unsubscribeListener) {
            unsubscribeListener();
        }

        const metricsRef = doc(db, 'metrics', METRICS_DOC_ID);

        unsubscribeListener = onSnapshot(
            metricsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const metrics: AgriculturalMetrics = {
                        ...data,
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                        nextUpdate: data.nextUpdate?.toDate() || new Date(),
                        temperature: {
                            ...data.temperature,
                            history: data.temperature.history?.map((h: any) => ({
                                timestamp: h.timestamp?.toDate() || new Date(),
                                value: h.value
                            })) || []
                        }
                    } as AgriculturalMetrics;

                    set({ metrics });

                    console.log('📊 Métriques mises à jour en temps réel');
                }
            },
            (error) => {
                console.error('❌ Error listening to metrics:', error);
            }
        );

        return () => {
            if (unsubscribeListener) {
                unsubscribeListener();
                unsubscribeListener = null;
            }
        };
    },

    /**
     * Génère et sauvegarde de nouvelles métriques (simulation manuelle)
     */
    simulateUpdate: async () => {
        const currentMetrics = get().metrics;

        try {
            set({ isSimulating: true });

            // Génération des nouvelles métriques
            const newMetrics = generateMetricsSnapshot(currentMetrics || undefined);

            // Préparation pour Firestore (conversion Date -> Timestamp)
            const firestoreData = {
                ...newMetrics,
                updatedAt: Timestamp.fromDate(newMetrics.updatedAt),
                nextUpdate: Timestamp.fromDate(newMetrics.nextUpdate),
                temperature: {
                    ...newMetrics.temperature,
                    history: newMetrics.temperature.history.map(h => ({
                        timestamp: Timestamp.fromDate(h.timestamp),
                        value: h.value
                    }))
                }
            };

            // Sauvegarde dans Firestore
            const metricsRef = doc(db, 'metrics', METRICS_DOC_ID);
            await setDoc(metricsRef, firestoreData);

            console.log('✅ Métriques simulées et sauvegardées');

            set({ isSimulating: false });
        } catch (error) {
            console.error('❌ Error simulating metrics:', error);
            toast.error('Erreur lors de la simulation');
            set({ isSimulating: false });
        }
    },

    /**
     * Démarre la simulation automatique (toutes les 5 minutes)
     */
    startAutoSimulation: () => {
        // Nettoyer le timer existant
        if (simulationTimer) {
            clearInterval(simulationTimer);
        }

        console.log('🚀 Démarrage de la simulation automatique (5 min)');

        // Première simulation immédiate
        get().simulateUpdate();

        // Puis toutes les 5 minutes
        simulationTimer = setInterval(() => {
            console.log('⏰ Simulation automatique déclenchée');
            get().simulateUpdate();
        }, SIMULATION_INTERVAL);
    },

    /**
     * Arrête la simulation automatique
     */
    stopAutoSimulation: () => {
        if (simulationTimer) {
            clearInterval(simulationTimer);
            simulationTimer = null;
            console.log('🛑 Simulation automatique arrêtée');
        }
    },
}));
