import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'viTEDia - Restaurant Gastronomique & Intelligent | TEDSAI',
    description: 'Découvrez viTEDia, le restaurant où la haute gastronomie rencontre l\'intelligence artificielle. Traçabilité complète et cuisine fusion africaine.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
