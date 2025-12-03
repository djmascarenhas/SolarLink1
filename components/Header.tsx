
import React, { useState } from 'react';
import Button from './common/Button';
import { Logo } from './Logo';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    onNavigate: (view: 'home' | 'opportunities' | 'buy_credits' | 'consumer', param?: string) => void;
    currentView: 'home' | 'opportunities' | 'buy_credits' | 'consumer';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle navigation links
  const handleNavClick = (view: 'home' | 'opportunities' | 'buy_credits' | 'consumer', param?: string) => {
    setIsMenuOpen(false);
    onNavigate(view, param);
    window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      {/* Main header bar */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => handleNavClick('home')} className="focus:outline-none" aria-label="SolarLink Home">
          <Logo className="h-10 w-auto" />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => handleNavClick('opportunities', 'Residencial')} 
            className={`text-gray-300 hover:text-yellow-400 transition-colors ${currentView === 'opportunities' ? '' : ''}`}
          >
              Residencial
          </button>
          <button 
            onClick={() => handleNavClick('opportunities', 'Comercial')} 
            className={`text-gray-300 hover:text-yellow-400 transition-colors ${currentView === 'opportunities' ? '' : ''}`}
          >
              Comercial/industrial
          </button>
          <button 
            onClick={() => handleNavClick('opportunities', 'Usina')} 
            className={`text-gray-300 hover:text-yellow-400 transition-colors ${currentView === 'opportunities' ? '' : ''}`}
          >
              Usinas
          </button>
          <button 
            onClick={() => handleNavClick('consumer')} 
            className={`text-indigo-400 hover:text-indigo-300 font-medium transition-colors border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500/20`}
          >
              Quero uma consultoria
          </button>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:block">
            <Button variant="primary" className="px-5 py-2" onClick={() => handleNavClick('home')}>Cadastrar Grátis</Button>
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
          <button onClick={() => handleNavClick('opportunities', 'Residencial')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Residencial</button>
          <button onClick={() => handleNavClick('opportunities', 'Comercial')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Comercial/Industrial</button>
          <button onClick={() => handleNavClick('opportunities', 'Usina')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Usinas</button>
          <button onClick={() => handleNavClick('consumer')} className="text-indigo-400 hover:text-indigo-300 font-bold py-2">Quero uma consultoria</button>
          <Button variant="primary" className="w-full mt-4" onClick={() => handleNavClick('home')}>Cadastrar Grátis</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
