import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog & Actualités | TEDSAI',
    description: 'Restez informé sur l\'agriculture de précision, l\'IA et le développement durable en Afrique.',
};

export const revalidate = 3600;

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
