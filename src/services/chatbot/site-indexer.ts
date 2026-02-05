import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';

/**
 * Site content structure for indexation
 */
export interface SiteContentPage {
    page_id: string;
    url: string;
    title: string;
    content: string;
    category: string;
    keywords: string[];
    last_indexed: any; // Timestamp
}

/**
 * Static site map - defines all pages to index
 * In a production environment, this could be automatically generated from Next.js routes
 */
export const SITE_MAP = [
    {
        page_id: 'home',
        url: '/',
        title: 'TEDSAI Complex - De la Data à l\'Assiette',
        category: 'général',
        keywords: ['accueil', 'tedsai', 'écosystème', 'innovation', 'agriculture', 'ia'],
    },
    {
        page_id: 'solutions-ia',
        url: '/solutions-ia',
        title: 'Solutions IA & Innovation',
        category: 'services',
        keywords: ['ia', 'intelligence artificielle', 'consulting', 'automation', 'data science'],
    },
    {
        page_id: 'vitedia',
        url: '/vitedia',
        title: 'Restaurant Vitédia',
        category: 'restaurant',
        keywords: ['restaurant', 'gastronomie', 'vitedia', 'menu', 'réservation', 'cuisine'],
    },
    {
        page_id: 'garden',
        url: '/Garden-selected',
        title: 'SelecTED Gardens - garden Biologique',
        category: 'agriculture',
        keywords: ['garden', 'agriculture', 'bio', 'produits', 'traçabilité', 'légumes'],
    },
    {
        page_id: 'epicerie',
        url: '/epicerie',
        title: 'Épicerie Fine TEDSAI',
        category: 'boutique',
        keywords: ['épicerie', 'boutique', 'produits locaux', 'artisanal', 'shop'],
    },
    {
        page_id: 'elevage',
        url: '/elevage',
        title: 'Élevage Responsable',
        category: 'agriculture',
        keywords: ['élevage', 'animaux', 'viande', 'responsable', 'durable'],
    },
    {
        page_id: 'observatoire',
        url: '/observatoire',
        title: 'Observatoire - Blog & Actualités',
        category: 'blog',
        keywords: ['blog', 'actualités', 'articles', 'innovation', 'agriculture'],
    },
    {
        page_id: 'contact',
        url: '/contact',
        title: 'Contact TEDSAI',
        category: 'contact',
        keywords: ['contact', 'formulaire', 'email', 'téléphone', 'adresse'],
    },
];

/**
 * Extract meaningful content from a page
 * This is a simplified version - in production, you'd crawl actual HTML
 */
export function extractPageContent(page: typeof SITE_MAP[0]): string {
    // Manually curated content for each page
    const contentMap: Record<string, string> = {
        home: `TEDSAI Complex est un écosystème innovant qui combine agriculture durable, gastronomie de qualité et solutions technologiques IA. 
        Nous proposons un restaurant gastronomique (Vitédia), un garden biologique avec traçabilité complète (SelecTED Gardens), 
        une épicerie fine de produits locaux, un élevage responsable, et des services de consulting en intelligence artificielle 
        pour entreprises. Notre mission est de connecter la data à l'assiette pour un avenir plus durable.`,

        'solutions-ia': `TEDSAI propose des solutions d'intelligence artificielle sur mesure pour les entreprises. 
        Services : Consulting IA, Automation des processus, Data Science & Analytics, Machine Learning, 
        Computer Vision, NLP (Traitement du langage naturel), Transformation digitale. 
        Nous accompagnons les PME et grandes entreprises dans leur transition vers l'IA avec des solutions concrètes et mesurables. 
        Précision de 99.8% sur nos modèles IA. Disponibilité 24/7. Économie de 70% du temps de traitement.`,

        vitedia: `Vitédia est notre restaurant gastronomique niché au cœur de TEDSAI Complex. 
        Cuisine raffinée utilisant des produits ultra-frais de notre garden biologique et de producteurs locaux. 
        Menu du jour renouvelé quotidiennement. Formules : Entrée + Plat + Dessert. 
        Réservations : Par téléphone ou formulaire en ligne. Ouvert du mardi au dimanche, midi et soir. 
        Capacité : 50 couverts. Chef : Cuisine créative et respectueuse des saisons. 
        Spécialités : Légumes du garden, viandes d'élevage responsable, desserts maison.`,

        garden: `SelecTED Gardens est notre garden biologique avec traçabilité complète de la graine à l'assiette. 
        Production : Légumes de saison, fruits, herbes aromatiques. Culture 100% biologique sans pesticides. 
        Traçabilité : QR codes sur chaque produit pour suivre l'historique complet (plantation, soins, récolte). 
        Approvisionnement : Restaurant Vitédia et épicerie TEDSAI. 
        Visites : Possibilité de visites guidées du garden sur réservation. 
        Technologies : Capteurs IoT pour optimisation irrigation et monitoring en temps réel.`,

        epicerie: `L'épicerie fine TEDSAI propose une sélection rigoureuse de produits locaux et artisanaux. 
        Catégories : Légumes du garden, viandes d'élevage, produits transformés (confitures, conserves), 
        huiles et condiments, miels locaux, fromages artisanaux. 
        Origine : Priorité aux producteurs dans un rayon de 50km. 
        Horaires : Mardi au samedi, 9h-19h. Commandes en ligne disponibles. 
        Livraison possible dans la région. Click & Collect gratuit.`,

        elevage: `Notre élevage responsable privilégie le bien-être animal et la qualité. 
        Animaux : Moutons, poules pondeuses, quelques bovins. Pâturages en plein air. 
        Alimentation : Herbe naturelle, compléments biologiques. Sans antibiotiques préventifs. 
        Production : Viande de qualité supérieure, œufs frais bio. 
        Traçabilité : Chaque animal suivi individuellement. 
        Approvisionnement : Restaurant Vitédia et épicerie. Vente directe sur demande.`,

        observatoire: `L'Observatoire TEDSAI est notre blog dédié à l'innovation agricole et technologique. 
        Thématiques : Agriculture durable, technologies IA, gastronomie responsable, 
        traçabilité alimentaire, innovations agritech. 
        Publications régulières d'articles, études de cas, retours d'expérience. 
        Possibilité de soumettre des contributions (validation par équipe éditoriale). 
        Newsletter mensuelle disponible.`,

        contact: `Contactez TEDSAI Complex : 
        Email : contact@tedsai.com 
        Téléphone : +33 (0)1 XX XX XX XX 
        Adresse : [Adresse à compléter]
        Formulaire de contact disponible sur le site. 
        Horaires d'ouverture : Du mardi au dimanche. 
        Réponse sous 24h en jours ouvrés. 
        Pour les réservations restaurant : formulaire dédié ou téléphone.`,
    };

    return contentMap[page.page_id] || `Page ${page.title} - Contenu à indexer`;
}

/**
 * Index all site pages to Firestore
 */
export async function indexSiteContent(): Promise<{
    success: boolean;
    indexed: number;
    errors: string[];
}> {
    const errors: string[] = [];
    let indexed = 0;

    try {
        console.log('🔍 Starting site indexation...');

        for (const page of SITE_MAP) {
            try {
                const content = extractPageContent(page);

                const pageData: SiteContentPage = {
                    page_id: page.page_id,
                    url: page.url,
                    title: page.title,
                    content: content,
                    category: page.category,
                    keywords: page.keywords,
                    last_indexed: serverTimestamp(),
                };

                // Store in Firestore
                const pageRef = doc(db, 'site_content', page.page_id);
                await setDoc(pageRef, pageData);

                console.log(`✅ Indexed: ${page.title}`);
                indexed++;
            } catch (error) {
                const errorMsg = `Failed to index ${page.page_id}: ${error}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }

        console.log(`✨ Indexation complete! ${indexed}/${SITE_MAP.length} pages indexed.`);

        return {
            success: errors.length === 0,
            indexed,
            errors,
        };
    } catch (error) {
        console.error('❌ Indexation failed:', error);
        return {
            success: false,
            indexed,
            errors: [`Global error: ${error}`],
        };
    }
}

/**
 * Search site content by keywords
 */
export async function searchSiteContent(keywords: string[]): Promise<SiteContentPage[]> {
    try {
        const siteContentRef = collection(db, 'site_content');
        const snapshot = await getDocs(siteContentRef);

        const allPages = snapshot.docs.map(doc => doc.data() as SiteContentPage);

        // Filter pages by keywords
        const relevantPages = allPages.filter(page => {
            const pageKeywords = page.keywords.map(k => k.toLowerCase());
            const searchKeywords = keywords.map(k => k.toLowerCase());

            return searchKeywords.some(searchKey =>
                pageKeywords.some(pageKey => pageKey.includes(searchKey))
            );
        });

        // Return top 5 most relevant
        return relevantPages.slice(0, 5);
    } catch (error) {
        console.error('Error searching site content:', error);
        return [];
    }
}

/**
 * Get all site content
 */
export async function getAllSiteContent(): Promise<SiteContentPage[]> {
    try {
        const siteContentRef = collection(db, 'site_content');
        const snapshot = await getDocs(siteContentRef);
        return snapshot.docs.map(doc => doc.data() as SiteContentPage);
    } catch (error) {
        console.error('Error fetching site content:', error);
        return [];
    }
}
