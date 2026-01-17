import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Observatoire de Données | TEDSAI',
    description: 'Visualisez les données en temps réel de nos fermes et de notre impact écologique.',
};

export const revalidate = 3600;

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
