import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { HeroSection, StatItem, ServiceCard, EcosystemPillar, EcosystemService, SynergyItem, ImpactItem, MenuItem, GardenProduct, IAService, BlogPost } from '@/types';

// Fetch homepage hero content
export const fetchHeroContent = async (): Promise<HeroSection | null> => {
  try {
    const q = query(
      collection(db, 'homepage_content'),
      where('section', '==', 'hero'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    if (doc) {
      return doc.data().content as HeroSection;
    }
    return null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
};

// Fetch homepage stats
export const fetchStats = async (): Promise<StatItem[]> => {
  try {
    const q = query(
      collection(db, 'stats_items'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StatItem));
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};

// Fetch homepage services
export const fetchServices = async (): Promise<ServiceCard[]> => {
  try {
    const q = query(
      collection(db, 'service_cards'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceCard));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// Fetch ecosystem pillars
export const fetchEcosystemPillars = async (): Promise<EcosystemPillar[]> => {
  try {
    const q = query(
      collection(db, 'ecosystem_pillars'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EcosystemPillar));
  } catch (error) {
    console.error('Error fetching ecosystem pillars:', error);
    return [];
  }
};

// Fetch ecosystem services
export const fetchEcosystemServices = async (): Promise<EcosystemService[]> => {
  try {
    const q = query(
      collection(db, 'ecosystem_services'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EcosystemService));
  } catch (error) {
    console.error('Error fetching ecosystem services:', error);
    return [];
  }
};

// Fetch synergies
export const fetchSynergies = async (): Promise<SynergyItem[]> => {
  try {
    const q = query(
      collection(db, 'synergy_items'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SynergyItem));
  } catch (error) {
    console.error('Error fetching synergies:', error);
    return [];
  }
};

// Fetch impacts
export const fetchImpacts = async (): Promise<ImpactItem[]> => {
  try {
    const q = query(
      collection(db, 'impact_items'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImpactItem));
  } catch (error) {
    console.error('Error fetching impacts:', error);
    return [];
  }
};

// Fetch menu items
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const q = query(
      collection(db, 'menu_items'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// Fetch garden products
export const fetchGardenProducts = async (): Promise<GardenProduct[]> => {
  try {
    const q = query(
      collection(db, 'garden_products'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GardenProduct));
  } catch (error) {
    console.error('Error fetching garden products:', error);
    return [];
  }
};

// Fetch IA services
export const fetchIAService = async (): Promise<IAService[]> => {
  try {
    const q = query(
      collection(db, 'ia_services'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IAService));
  } catch (error) {
    console.error('Error fetching IA services:', error);
    return [];
  }
};

// Fetch blog posts
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};