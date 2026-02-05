// Global type declarations for TEDSAI Admin

/**
 * User types
 */
export type UserRole =
    | 'super_admin'
    | 'restaurant_manager'
    | 'garden_operator'
    | 'content_editor'
    | 'viewer';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    totpEnabled: boolean;
    createdAt: Date;
    lastLogin?: Date;
}

/**
 * Product types (Garden & Shop)
 */
export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unit: 'kg' | 'units' | 'L';
    costPrice?: number;
    sellPrice?: number;
    alertThreshold?: number;
    quality?: 'A' | 'B' | 'C';
    harvestDate?: Date;
    expiryDate?: Date;
    imageUrl?: string;
    status: 'available' | 'low_stock' | 'out_of_stock';
}

/**
 * Order types (Restaurant & Shop)
 */
export type OrderStatus =
    | 'pending'
    | 'payment_pending'
    | 'paid'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'in_delivery'
    | 'delivered'
    | 'completed'
    | 'cancelled';

export interface Order {
    id: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod?: 'momo_mtn' | 'momo_orange' | 'cash' | 'card';
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
    deliveryAddress?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

/**
 * Blog/Article types
 */
export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    author: string;
    status: ArticleStatus;
    publishedAt?: Date;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    viewCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * AI Copilot types
 */
export interface CopilotAction {
    type: 'generate_description' | 'predict_stock' | 'create_promo' | 'generate_article';
    parameters: Record<string, any>;
}

export interface CopilotResponse {
    success: boolean;
    data?: any;
    error?: string;
    suggestions?: string[];
}

/**
 * Analytics types
 */
export interface KPI {
    label: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    unit?: string;
}

export interface Alert {
    id: string;
    type: 'stock_low' | 'order_pending' | 'system' | 'security';
    severity: 'info' | 'warning' | 'danger';
    title: string;
    description: string;
    actionUrl?: string;
    actionLabel?: string;
    createdAt: Date;
    read: boolean;
}
