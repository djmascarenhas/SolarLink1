
import React, { useState } from 'react';
import Button from './common/Button';
import { Logo } from './Logo';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    onNavigate: (view: 'portal' | 'home' | 'opportunities' | 'buy_credits' | 'consumer', param?: string) => void;
    currentView: 'portal' | 'home' | 'opportunities' | 'buy_credits' | 'consumer';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle navigation links
  const handleNavClick = (view: 'portal' | 'home' | 'opportunities' | 'buy_credits' | 'consumer', param?: string) => {
    setIsMenuOpen(false);
    onNavigate(view, param);
    if (view !== 'home' || !param) {
        window.scrollTo(0, 0);
    }
  };

  const isBusinessView = currentView === 'home' || currentView === 'opportunities' || currentView === 'buy_credits';
  const isConsumerView = currentView === 'consumer';

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      {/* Main header bar */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => handleNavClick('portal')} className="focus:outline-none" aria-label="SolarLink Home">
          <Logo className="h-10 w-auto" />
        </button>

        {/* Desktop navigation - Context Aware */}
        <nav className="hidden md:flex items-center gap-6">
          
          {/* Business Links - Standard Landing Page Navigation */}
          {isBusinessView && (
              <>
                <button 
                    onClick={() => handleNavClick('home', '#como-funciona')} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                    Como funciona
                </button>
                <button 
                    onClick={() => handleNavClick('home', '#vantagens')} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                    Vantagens
                </button>
                <button 
                    onClick={() => handleNavClick('home', '#comprar')} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                    Planos
                </button>
                <button 
                    onClick={() => handleNavClick('home', '#faq')} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                    Dúvidas
                </button>
                <button 
                    onClick={() => handleNavClick('opportunities')} 
                    className={`text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium ${currentView === 'opportunities' ? 'text-yellow-500' : ''}`}
                >
                    Oportunidades
                </button>
                
                {/* Switch to Consumer */}
                <button 
                    onClick={() => handleNavClick('consumer')} 
                    className={`text-indigo-400 hover:text-indigo-300 font-medium transition-colors border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 text-xs ml-2`}
                >
                    Sou Consumidor
                </button>
              </>
          )}

          {/* Consumer Links - Only show if in Consumer Context */}
          {isConsumerView && (
               <button 
                onClick={() => handleNavClick('home')} 
                className={`text-yellow-400 hover:text-yellow-300 font-medium transition-colors border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 rounded-full hover:bg-yellow-500/20 text-xs`}
            >
                Sou Integrador / Empresa
            </button>
          )}

        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:block">
            {isBusinessView && (
                 <Button variant="primary" className="px-5 py-2" onClick={() => handleNavClick('home')}>Cadastrar Grátis</Button>
            )}
        </div>

        {/* Mobile menu button (Only if not in Portal, or if we want to allow nav from portal) */}
        {currentView !== 'portal' && (
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
        )}
      </div>

      {/* Mobile navigation menu panel */}
      <div className={`transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
        <nav className="flex flex-col items-center gap-4 px-6 pt-2 pb-6">
          {isBusinessView && (
            <>
                <button onClick={() => handleNavClick('home', '#como-funciona')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Como funciona</button>
                <button onClick={() => handleNavClick('home', '#vantagens')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Vantagens</button>
                <button onClick={() => handleNavClick('home', '#comprar')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Planos</button>
                <button onClick={() => handleNavClick('home', '#faq')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Dúvidas</button>
                <button onClick={() => handleNavClick('opportunities')} className="text-gray-300 hover:text-yellow-400 transition-colors py-2">Oportunidades</button>
                <button onClick={() => handleNavClick('consumer')} className="text-indigo-400 hover:text-indigo-300 font-bold py-2 border-t border-slate-700 w-full text-center mt-2 pt-4">Sou Consumidor</button>
                <Button variant="primary" className="w-full mt-2" onClick={() => handleNavClick('home')}>Cadastrar Grátis</Button>
            </>
          )}
          {isConsumerView && (
              <button onClick={() => handleNavClick('home')} className="text-yellow-400 hover:text-yellow-300 font-bold py-2">Sou Integrador</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
