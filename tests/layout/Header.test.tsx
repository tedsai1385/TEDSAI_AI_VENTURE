import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

// Mock the next/router
jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/',
        asPath: '/',
        query: {},
        push: jest.fn(),
    }),
}));

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Header', () => {
    it('renders the header with logo and navigation', () => {
        render(<Header />);
        
        expect(screen.getByAltText('TEDSAI Logo')).toBeInTheDocument();
        expect(screen.getByText('Accueil')).toBeInTheDocument();
        expect(screen.getByText('À Propos')).toBeInTheDocument();
        expect(screen.getByText('Solutions IA')).toBeInTheDocument();
        expect(screen.getByText('viTEDia')).toBeInTheDocument();
        expect(screen.getByText('SelecTED Gardens')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('toggles mobile menu', () => {
        render(<Header />);
        
        const mobileMenuButton = screen.getByLabelText('Ouvrir le menu');
        fireEvent.click(mobileMenuButton);
        
        expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('highlights active page', () => {
        render(<Header />);
        
        const homeLink = screen.getByText('Accueil');
        expect(homeLink).toHaveClass('bg-[var(--color-primary)]');
    });
});