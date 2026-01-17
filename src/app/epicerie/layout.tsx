import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Épicerie Fine SelecTED | TEDSAI',
    description: 'Commandez nos produits frais, bio et locaux directement en ligne. Livraison rapide à domicile.',
};

export const revalidate = 3600;

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
