import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid } from '@/components/epicerie/ProductGrid';

// Mock the useCart hook
jest.mock('@/context/CartContext', () => ({
    useCart: () => ({
        addItem: jest.fn(),
    }),
}));

// Mock the toast function
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
    },
}));

describe('ProductGrid', () => {
    it('renders the product grid with products', () => {
        render(<ProductGrid />);
        
        expect(screen.getByText('Nos Trésors')).toBeInTheDocument();
        expect(screen.getByText('Poivre de Penja (IGP) - Blanc')).toBeInTheDocument();
        expect(screen.getByText('Miel Blanc d\'Oku (IGP)')).toBeInTheDocument();
        expect(screen.getByText('Poudre de Moringa Bio')).toBeInTheDocument();
    });

    it('filters products by category', () => {
        render(<ProductGrid />);
        
        const spiceFilter = screen.getByText('Épices');
        fireEvent.click(spiceFilter);
        
        expect(spiceFilter).toHaveClass('bg-[var(--color-primary)]');
    });

    it('adds product to cart', () => {
        const { addItem } = require('@/context/CartContext');
        render(<ProductGrid />);
        
        const addToCartButtons = screen.getAllByText('Ajouter');
        fireEvent.click(addToCartButtons[0]);
        
        expect(addItem).toHaveBeenCalled();
    });
});