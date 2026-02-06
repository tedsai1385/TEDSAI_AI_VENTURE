import { Metadata, Viewport } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tedsai.cm';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'TEDSAI Complex | L\'Algorithme Organique - Yaoundé',
        template: '%s | TEDSAI Complex'
    },
    description: 'Premier écosystème camerounais unissant IA, agriculture aquaponique et gastronomie traçable. Restaurant, boutique bio, solutions IA pour PME. Yaoundé.',
    keywords: ['tedsai', 'yaoundé', 'restaurant traçable', 'aquaponie cameroun', 'IA PME afrique', 'FoodTech', 'Cameroun', 'Intelligence Artificielle'],
    authors: [{ name: 'TEDSAI Team' }],
    creator: 'TEDSAI AI Venture',
    publisher: 'TEDSAI',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'fr_CM',
        url: baseUrl,
        title: 'TEDSAI - L\'Ecosystème FoodTech Camerounais',
        description: 'Découvrez viTEDia, SelecTED Garden et nos solutions IA. La technologie au service du goût et de la performance.',
        siteName: 'TEDSAI',
        images: [
            {
                url: '/images/og-tedsai-main.jpg', // Needs to be created
                width: 1200,
                height: 630,
                alt: 'TEDSAI Ecosystem',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TEDSAI - FoodTech Cameroon',
        description: 'Restaurant, SelecTED Garden & IA pour PME.',
        images: ['/images/og-tedsai-main.jpg'],
        creator: '@Tedsai1385',
    },
    icons: {
        icon: '/icon.webp',
        apple: '/apple-icon.png',
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    themeColor: '#7c3aed', // Purple-600
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};
