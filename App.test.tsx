import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Header from './components/Header';
import '@testing-library/jest-dom';

describe('Header Component', () => {
    it('renders the logo alt text', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        const logoImage = screen.getByAltText(/SolarLink Logo/i);
        expect(logoImage).toBeInTheDocument();
    });

    it('renders fallback text if image fails', () => {
         render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        const logoImage = screen.getByAltText(/SolarLink Logo/i);
        fireEvent.error(logoImage);
        expect(screen.getByText(/SOLAR/i)).toBeInTheDocument();
        expect(screen.getByText(/LINK/i)).toBeInTheDocument();
    });

    it('shows business links when on business route', () => {
        render(
            <MemoryRouter initialEntries={['/business']}>
                <Header />
            </MemoryRouter>
        );
        // getAllByText returns an array, we check if at least one exists and is visible (though jsdom doesn't fully simulate visibility, existence is checked)
        expect(screen.getAllByText('Como funciona')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Sou Consumidor')[0]).toBeInTheDocument();
        expect(screen.queryByText('Sou Integrador / Empresa')).not.toBeInTheDocument();
    });

    it('shows consumer links when on consumer route', () => {
         render(
            <MemoryRouter initialEntries={['/consumer']}>
                <Header />
            </MemoryRouter>
        );
        expect(screen.getAllByText('Sou Integrador / Empresa')[0]).toBeInTheDocument();
        expect(screen.queryByText('Como funciona')).not.toBeInTheDocument();
    });
});
