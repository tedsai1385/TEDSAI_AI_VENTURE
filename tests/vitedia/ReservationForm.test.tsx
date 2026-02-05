import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from '@/components/vitedia/ReservationForm';

describe('ReservationForm', () => {
    it('renders the reservation form correctly', () => {
        render(<ReservationForm />);
        
        expect(screen.getByText('Réserver votre Table')).toBeInTheDocument();
        expect(screen.getByLabelText(/Date/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Heure/)).toBeInTheDocument();
        expect(screen.getByText('Nombre de personnes')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Votre nom')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('6XX XX XX XX')).toBeInTheDocument();
    });

    it('allows user to fill in reservation details', () => {
        render(<ReservationForm />);
        
        const nameInput = screen.getByPlaceholderText('Votre nom');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(nameInput).toHaveValue('John Doe');
        
        const phoneInput = screen.getByPlaceholderText('6XX XX XX XX');
        fireEvent.change(phoneInput, { target: { value: '612345678' } });
        expect(phoneInput).toHaveValue('612345678');
    });

    it('allows guest selection', () => {
        render(<ReservationForm />);
        
        const guestButtons = screen.getAllByRole('button', { name: /\d|\d\+/ });
        fireEvent.click(guestButtons[3]); // Select 4 guests
        
        expect(guestButtons[3]).toHaveClass('bg-[var(--color-primary)]');
    });
});