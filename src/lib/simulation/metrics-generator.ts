import {
    AgriculturalMetrics,
    TemperatureMetric,
    HumidityMetric,
    PHMetric,
    YieldMetric,
    WaterMetric,
    CO2Metric,
    EnergyMetric,
    DataPoint,
    TrendDirection,
    PHStatus
} from '@/types/observatoire';

/**
 * Générateur de données agricoles réalistes
 * Simulation haute-fidélité pour l'Observatoire TEDSAI
 */

// Configuration
const CONFIG = {
    TEMP_BASE: 24,           // °C base
    TEMP_VARIATION: 4,       // Amplitude jour/nuit
    HUMIDITY_BASE: 65,       // % base
    PH_BASE: 6.75,          // pH optimal
    HISTORY_LENGTH: 96,      // 48h de données (1 point / 30min)
};

/**
 * Génère une température réaliste avec cycle jour/nuit
 */
const generateTemperature = (historyData: DataPoint[] = []): TemperatureMetric => {
    const now = new Date();
    const hour = now.getHours();

    // Sinusoïde pour cycle jour/nuit (pic à 14h, creux à 4h)
    const dailyVariation = Math.sin((hour - 6) * Math.PI / 12) * CONFIG.TEMP_VARIATION;

    // Bruit réaliste
    const noise = (Math.random() - 0.5) * 1.5;

    const current = Number((CONFIG.TEMP_BASE + dailyVariation + noise).toFixed(1));

    // Détection de tendance
    let trend: TrendDirection = 'stable';
    if (historyData.length > 0) {
        const lastValue = historyData[historyData.length - 1].value;
        if (current > lastValue + 0.5) trend = 'up';
        else if (current < lastValue - 0.5) trend = 'down';
    }

    // Ajout à l'historique
    const newHistory = [
        ...historyData,
        { timestamp: now, value: current }
    ].slice(-CONFIG.HISTORY_LENGTH);

    return {
        current,
        optimal: [22, 26],
        trend,
        history: newHistory
    };
};

/**
 * Génère l'humidité du sol (anti-corrélée avec température)
 */
const generateHumidity = (temperature: number): HumidityMetric => {
    // Plus il fait chaud, moins d'humidité
    const tempEffect = (temperature - CONFIG.TEMP_BASE) * -3;
    const noise = (Math.random() - 0.5) * 8;

    const current = Number(Math.max(30, Math.min(90, CONFIG.HUMIDITY_BASE + tempEffect + noise)).toFixed(1));

    // Détermination de la zone (simulation multi-zone)
    const zones: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    const zone = zones[Math.floor(Math.random() * 3)];

    // Alerte si hors plage optimale
    const alert = current < 30 || current > 80;

    return {
        current,
        zone,
        alert
    };
};

/**
 * Génère le pH du sol (random walk contraint)
 */
const generatePH = (previousPH?: number): PHMetric => {
    const base = previousPH || CONFIG.PH_BASE;

    // Random walk avec contrainte de retour à la moyenne
    const drift = (CONFIG.PH_BASE - base) * 0.1; // Force de rappel
    const randomWalk = (Math.random() - 0.5) * 0.3;

    const current = Number(Math.max(5.5, Math.min(8.0, base + drift + randomWalk)).toFixed(2));

    // Détermination du statut
    let status: PHStatus = 'optimal';
    if (current < 6.3) status = 'acidic';
    else if (current > 7.2) status = 'alkaline';

    return {
        current,
        status
    };
};

/**
 * Calcule l'indice de rendement IA basé sur les conditions
 * Algorithme : Yield = f(température, humidité, pH)
 */
const calculateYieldIA = (
    temp: number,
    humidity: number,
    ph: number,
    previousYield?: number
): YieldMetric => {
    // Score température (optimal 22-26°C)
    const tempScore = temp >= 22 && temp <= 26
        ? 100
        : 100 - Math.abs(temp - 24) * 5;

    // Score humidité (optimal 60-70%)
    const humidityScore = humidity >= 60 && humidity <= 70
        ? 100
        : 100 - Math.abs(humidity - 65) * 2;

    // Score pH (optimal 6.5-7.0)
    const phScore = ph >= 6.5 && ph <= 7.0
        ? 100
        : 100 - Math.abs(ph - 6.75) * 40;

    // Weighted average (température 40%, humidité 35%, pH 25%)
    const current = Math.round(
        Math.max(0, Math.min(100,
            tempScore * 0.4 + humidityScore * 0.35 + phScore * 0.25
        ))
    );

    // Prévision à 7 jours (légère variation aléatoire)
    const forecast = Math.round(Math.max(0, Math.min(100, current + (Math.random() - 0.5) * 10)));

    // Comparaison avec le mois dernier
    const comparisonLastMonth = previousYield
        ? Number(((current - previousYield) / previousYield * 100).toFixed(1))
        : 0;

    return {
        current,
        forecast,
        comparisonLastMonth
    };
};

/**
 * Calcule l'eau recyclée (cumul journalier)
 */
const calculateWater = (previousData?: WaterMetric): WaterMetric => {
    const now = new Date();
    const hour = now.getHours();

    // Reset à minuit
    const isNewDay = hour === 0;
    const today = isNewDay ? 0 : (previousData?.today || 0) + (Math.random() * 20 + 40);

    const thisMonth = (previousData?.thisMonth || 0) + (Math.random() * 20 + 40);

    // Économie vs agriculture traditionnelle (aquaponie = 90% d'eau en moins)
    const savedVsTraditional = 90;

    return {
        today: Number(today.toFixed(1)),
        thisMonth: Number(thisMonth.toFixed(1)),
        savedVsTraditional
    };
};

/**
 * Calcule le CO2 économisé
 */
const calculateCO2 = (previousData?: CO2Metric): CO2Metric => {
    const increment = Math.random() * 2 + 4; // 4-6 kg par cycle

    const totalKg = (previousData?.totalKg || 5000) + increment;

    // 1 arbre absorbe ~20kg CO2/an
    const equivalentTrees = Math.round(totalKg / 20);

    const thisWeek = (previousData?.thisWeek || 0) + increment;

    return {
        totalKg: Number(totalKg.toFixed(1)),
        equivalentTrees,
        thisWeek: Number(thisWeek.toFixed(1))
    };
};

/**
 * Calcule l'efficacité énergétique
 */
const calculateEnergy = (temperature: number): EnergyMetric => {
    // Plus il fait chaud dehors, moins besoin de chauffage
    const externalTemp = temperature - 5 + (Math.random() - 0.5) * 3;

    // kWh par kg de production (optimisé = 0.5-1.2)
    const kwhPerKg = Number((0.7 + (24 - externalTemp) * 0.02).toFixed(2));

    // % d'énergie renouvelable (solaire principalement)
    const renewablePercent = Math.round(75 + (Math.random() - 0.5) * 10);

    // Index de coût (100 = optimal, 0 = mauvais)
    const costIndex = Math.round(100 - (kwhPerKg - 0.5) * 50);

    return {
        kwhPerKg,
        renewablePercent,
        costIndex: Math.max(0, Math.min(100, costIndex))
    };
};

/**
 * Génère un snapshot complet de métriques agricoles
 */
export const generateMetricsSnapshot = (
    previousMetrics?: AgriculturalMetrics
): AgriculturalMetrics => {
    const now = new Date();

    // Génération séquentielle (chaque métrique peut dépendre des précédentes)
    const temperature = generateTemperature(previousMetrics?.temperature.history);
    const soilHumidity = generateHumidity(temperature.current);
    const soilPH = generatePH(previousMetrics?.soilPH.current);
    const yieldIndex = calculateYieldIA(
        temperature.current,
        soilHumidity.current,
        soilPH.current,
        previousMetrics?.yieldIndex.current
    );
    const waterRecycled = calculateWater(previousMetrics?.waterRecycled);
    const co2Saved = calculateCO2(previousMetrics?.co2Saved);
    const energyEfficiency = calculateEnergy(temperature.current);

    return {
        temperature,
        soilHumidity,
        soilPH,
        yieldIndex,
        waterRecycled,
        co2Saved,
        energyEfficiency,
        updatedAt: now,
        nextUpdate: new Date(now.getTime() + 5 * 60 * 1000) // +5 minutes
    };
};

/**
 * Génère des métriques initiales réalistes
 */
export const generateInitialMetrics = (): AgriculturalMetrics => {
    return generateMetricsSnapshot();
};
