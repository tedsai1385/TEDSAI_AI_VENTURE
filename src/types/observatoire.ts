// Types for Observatoire Articles & Metrics

export type ArticleCategory =
    | 'agriculture-urbaine'
    | 'intelligence-artificielle'
    | 'economie-durable'
    | 'innovation'
    | 'etudes-de-cas';

export type ContentType = 'article' | 'infographie' | 'video' | 'etude-pdf';

export type ArticleStatus = 'draft' | 'pending-review' | 'published' | 'archived';

export interface Author {
    id: string;
    name: string;
    role: string;
    bio: string;
    avatar: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
    };
    articlesCount: number;
}

export interface Media {
    url: string;
    type: 'image' | 'video';
    alt: string;
}

export interface ArticleWorkflow {
    createdBy: string;
    createdAt: Date;
    submittedAt?: Date;
    reviewedBy?: string;
    publishedAt?: Date;
    lastModified: Date;
}

export interface ArticleStats {
    views: number;
    downloads: number;
    avgReadTime: number;
}

export interface ArticleSEO {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
}

export interface Article {
    id: string;

    // Content
    title: string;
    subtitle: string;
    excerpt: string;
    content: string; // Rich text content (HTML or Markdown)
    slug: string;

    // Classification
    category: ArticleCategory;
    contentType: ContentType;
    heroMedia: Media;

    // Authors
    authors: Author[];

    // Workflow
    status: ArticleStatus;
    workflow: ArticleWorkflow;

    // Engagement
    stats: ArticleStats;

    // SEO
    seo: ArticleSEO;
}

// Agricultural Metrics Types

export type TrendDirection = 'up' | 'down' | 'stable';
export type PHStatus = 'optimal' | 'acidic' | 'alkaline';
export type Zone = 'A' | 'B' | 'C';

export interface DataPoint {
    timestamp: Date;
    value: number;
}

export interface TemperatureMetric {
    current: number;
    optimal: [number, number];
    trend: TrendDirection;
    history: DataPoint[];
}

export interface HumidityMetric {
    current: number;
    zone: Zone;
    alert: boolean;
}

export interface PHMetric {
    current: number;
    status: PHStatus;
}

export interface YieldMetric {
    current: number;
    forecast: number;
    comparisonLastMonth: number;
}

export interface WaterMetric {
    today: number;
    thisMonth: number;
    savedVsTraditional: number;
}

export interface CO2Metric {
    totalKg: number;
    equivalentTrees: number;
    thisWeek: number;
}

export interface EnergyMetric {
    kwhPerKg: number;
    renewablePercent: number;
    costIndex: number;
}

export interface AgriculturalMetrics {
    temperature: TemperatureMetric;
    soilHumidity: HumidityMetric;
    soilPH: PHMetric;
    yieldIndex: YieldMetric;
    waterRecycled: WaterMetric;
    co2Saved: CO2Metric;
    energyEfficiency: EnergyMetric;

    updatedAt: Date;
    nextUpdate: Date;
}

// Newsletter Types

export type NewsletterInterest = 'agriculture' | 'ia' | 'business';

export interface NewsletterSubscriber {
    email: string;
    interests: NewsletterInterest[];
    subscribedAt: Date;
    verified: boolean;
}
