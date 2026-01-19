export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_resto' | 'admin_garden' | 'admin_ia' | 'user';
  createdAt: string;
  lastLogin?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entree' | 'plat' | 'dessert' | 'boisson';
  available: boolean;
  image?: string;
}

export interface GardenProduct {
  id: string;
  name: string;
  variety?: string;
  description: string;
  price: number;
  unit?: 'kg' | 'piece' | 'botte' | 'unité';
  stock: number;
  inStock: boolean;
  category: 'Légumes' | 'Fruits' | 'Épices' | 'Aromates' | 'Élevage' | 'Épicerie Fine' | 'Autre' | string;
  image?: string;
}

export interface IAService {
  id: string;
  name: string;
  description: string;
  category: 'automatisation' | 'chatbot' | 'monitoring' | 'integration';
  pricing: string;
  active: boolean;
  features: string[];
}

export interface Reservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    type: 'resto' | 'garden';
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  paymentId?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variety?: string;
  category: 'menu' | 'garden' | 'ia_service';
  options?: {
    cooking?: string;
    sides?: string[];
    extras?: string[];
    instructions?: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  promoCode?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

// Content Management Schemas
import { Timestamp } from 'firebase/firestore';

// Schema for homepage content
export interface HomepageContent {
  id: string;
  section: 'hero' | 'stats' | 'services' | 'ecosystem' | 'observatory';
  content: any; // Flexible content structure depending on section
  order?: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for hero section
export interface HeroSection {
  id: string;
  title: string;
  slogan: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  backgroundImageUrl: string;
  statusBadge: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for stats section
export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string; // Icon name from lucide-react
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for service cards
export interface ServiceCard {
  id: string;
  icon: string; // Icon name from lucide-react
  title: string;
  description: string;
  features: string[]; // List of features
  link: string; // Link to detailed page
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for ecosystem pillars
export interface EcosystemPillar {
  id: string;
  icon: string; // Icon name from lucide-react
  name: string;
  color: string; // Tailwind gradient class
  description: string;
  features: string[]; // List of features
  link: string; // Link to detailed page
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for ecosystem services
export interface EcosystemService {
  id: string;
  icon: string; // Icon name from lucide-react
  name: string;
  color: string; // Tailwind gradient class
  description: string;
  features: string[]; // List of features
  link: string; // Link to detailed page
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for synergies
export interface SynergyItem {
  id: string;
  from: string; // Source pillar/service
  to: string; // Target pillar/service
  description: string;
  icon: string; // Emoji or icon representing the synergy
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for impacts
export interface ImpactItem {
  id: string;
  value: string;
  label: string;
  icon: string; // Icon name from lucide-react
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for menu items (restaurant)
export interface MenuItemCMS extends MenuItem {
  traceability: TraceabilityInfo[]; // Information about ingredients sources
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for traceability information
export interface TraceabilityInfo {
  ingredient: string;
  source: string;
  verified: boolean;
}

// Schema for gallery items
export interface GalleryItem {
  id: string;
  imageUrl: string;
  altText: string;
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for products (garden/epicerie)
export interface ProductCMS extends GardenProduct {
  traceability: ProductTraceability;
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for product traceability
export interface ProductTraceability {
  plot: string;
  planted?: string; // Date string
  harvest?: string; // Date string
  collected?: string; // Date string
  raised?: string; // Date string for livestock
  ready?: string; // Date string for livestock
  certifications: string[]; // List of certifications
}

// Schema for IA services
export interface IAServiceCMS extends IAService {
  icon: string; // Icon name from lucide-react
  title: string;
  description: string;
  features: string[]; // List of features
  stats: {
    value: string;
    label: string;
  };
  color: string; // Tailwind gradient class
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for use cases
export interface UseCase {
  id: string;
  title: string;
  company: string;
  result: string;
  description: string;
  icon: string; // Emoji or icon
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for pricing plans
export interface PricingPlan {
  id: string;
  name: string;
  price: number | null; // null for custom pricing
  period: string; // 'mois' | 'année' | 'sur devis'
  description: string;
  features: string[]; // List of features
  popular: boolean;
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for contact information
export interface ContactInfo {
  id: string;
  type: 'address' | 'email' | 'phone' | 'hours';
  label: string;
  value: string;
  icon: string; // Icon name from lucide-react
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for contact form interests
export interface ContactInterest {
  id: string;
  value: string; // Value for the option
  label: string; // Display text for the option
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for blog posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: Timestamp;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Schema for pages
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML content or markdown
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
