
import React, { useState } from 'react';
import Button from './common/Button';
import { Logo } from './Logo';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu, useful for when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      {/* Main header bar */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" aria-label="SolarLink Home">
          <Logo className="h-10 w-auto" />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#oportunidades" className="text-gray-300 hover:text-yellow-400 transition-colors">Oportunidades</a>
          <a href="#comprar" className="text-gray-300 hover:text-yellow-400 transition-colors">Comprar Créditos</a>
          <a href="#faq" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</a>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:block">
            <Button variant="primary" className="px-5 py-2">Cadastrar Grátis</Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none p-1"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu panel */}
      <div className={`transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
        <nav className="flex flex-col items-center gap-4 px-6 pt-2 pb-6">
          <a href="#oportunidades" onClick={handleLinkClick} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Oportunidades</a>
          <a href="#comprar" onClick={handleLinkClick} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Comprar Créditos</a>
          <a href="#faq" onClick={handleLinkClick} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">FAQ</a>
          <Button variant="primary" className="w-full mt-4" onClick={handleLinkClick}>Cadastrar Grátis</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
