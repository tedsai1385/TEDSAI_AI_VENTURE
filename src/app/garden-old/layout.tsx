import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'garden SelecTED - Agriculture Urbaine 4.0 | TEDSAI',
    description: 'Explorez nos gardens urbains connectés. Des produits ultra-frais, cultivés avec passion et optimisés par l\'IA pour une qualité exceptionnelle.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
