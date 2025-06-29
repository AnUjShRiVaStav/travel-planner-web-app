import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '@/components/Navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/'),
}));

describe('Navigation Component', () => {
    it('renders desktop navigation', () => {
        render(<Navigation />);
        expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThan(0);
    });

    it('renders mobile navigation', () => {
        render(<Navigation />);
        expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
        const mobileMenuContainer = screen.getByRole('navigation').querySelector('.md\\:hidden.transition-all');
        expect(mobileMenuContainer).toBeInTheDocument();
    });
});
