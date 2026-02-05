import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'L\'Écosystème TEDSAI - Synergie Innovation & Agriculture',
    description: 'Comprendre comment le restaurant, le garden et l\'IA interagissent pour créer un modèle de développement durable unique en Afrique.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
