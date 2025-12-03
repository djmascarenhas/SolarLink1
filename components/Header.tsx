
import React, { useState } from 'react';
import Button from './common/Button';
import { Logo } from './Logo';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    onNavigate: (view: 'home' | 'opportunities' | 'buy_credits') => void;
    currentView: 'home' | 'opportunities' | 'buy_credits';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle navigation links
  const handleNavClick = (target: string) => {
    setIsMenuOpen(false);
    
    if (target === 'oportunidades') {
        onNavigate('opportunities');
        window.scrollTo(0, 0);
    } else if (target === 'comprar') {
        onNavigate('buy_credits');
        window.scrollTo(0, 0);
    } else {
        // For standard anchors, if we are not on home, go home first
        if (currentView !== 'home') {
            onNavigate('home');
            // Allow time for render then scroll
            setTimeout(() => {
                const element = document.getElementById(target);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // If already on home, just scroll
             const element = document.getElementById(target);
             if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      {/* Main header bar */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="focus:outline-none" aria-label="SolarLink Home">
          <Logo className="h-10 w-auto" />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => handleNavClick('oportunidades')} className={`text-gray-300 hover:text-yellow-400 transition-colors ${currentView === 'opportunities' ? 'text-yellow-400 font-semibold' : ''}`}>
              Oportunidades
          </button>
          <button onClick={() => handleNavClick('comprar')} className={`text-gray-300 hover:text-yellow-400 transition-colors ${currentView === 'buy_credits' ? 'text-yellow-400 font-semibold' : ''}`}>
              Comprar Créditos
          </button>
          <button onClick={() => handleNavClick('faq')} className="text-gray-300 hover:text-yellow-400 transition-colors">
              FAQ
          </button>
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
          <button onClick={() => handleNavClick('oportunidades')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Oportunidades</button>
          <button onClick={() => handleNavClick('comprar')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Comprar Créditos</button>
          <button onClick={() => handleNavClick('faq')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">FAQ</button>
          <Button variant="primary" className="w-full mt-4" onClick={() => setIsMenuOpen(false)}>Cadastrar Grátis</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
