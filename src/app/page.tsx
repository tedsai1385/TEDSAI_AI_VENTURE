import { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';

export const metadata: Metadata = {
    title: "TEDSAI Complex - Intelligence Artificielle & Gastronomie Durable",
    description: "Découvrez l'écosystème TEDSAI : une fusion unique entre IA, agriculture urbaine (SelecTED Gardens) et gastronomie traçable (viTEDia) au Cameroun.",
    openGraph: {
        title: "TEDSAI Complex - L'Innovation au service de l'Afrique",
        description: "Intelligence Artificielle, Agriculture et Gastronomie réunies dans un écosystème durable.",
        images: ['/assets/images/hero_bg.webp'],
    }
};

export default function HomePage() {
    return <HomePageClient />;
}
