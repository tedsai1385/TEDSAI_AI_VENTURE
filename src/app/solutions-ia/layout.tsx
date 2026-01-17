import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Solutions IA & Innovation - Consulting | TEDSAI',
    description: 'Boostez votre entreprise avec nos solutions d\'intelligence artificielle sur mesure. De l\'analyse de données à l\'automatisation intelligente.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
