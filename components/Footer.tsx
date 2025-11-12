import React from 'react';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700">
      <div className="container mx-auto px-6 py-8 text-center text-gray-400">
        <div className="flex justify-center mb-4">
          <Logo className="h-10 w-auto" />
        </div>
        <p>&copy; {new Date().getFullYear()} SolarLink. Todos os direitos reservados.</p>
        <p>Conectando o futuro da energia solar.</p>
      </div>
    </footer>
  );
};

export default Footer;
