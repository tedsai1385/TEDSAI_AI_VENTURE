import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SelecTED Garden - Agriculture 4.0 | TEDSAI',
    description: 'Explorez le SelecTED Garden : agriculture aquaponique urbaine, produits ultra-frais et traçabilité totale pilotée par l\'IA.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
