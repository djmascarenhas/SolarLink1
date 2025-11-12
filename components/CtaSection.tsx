
import React from 'react';
import Button from './common/Button';

const CtaSection: React.FC = () => {
  return (
    <section id="oportunidades" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para encontrar seus próximos clientes?</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Veja as oportunidades abertas agora mesmo e dê o próximo passo para o crescimento da sua empresa.
        </p>
        <Button variant="secondary" className="text-lg py-4 px-8">
          Ver oportunidades agora
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
