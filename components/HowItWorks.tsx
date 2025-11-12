
import React from 'react';
import Card from './common/Card';
import Tooltip from './common/Tooltip';

const steps = [
  {
    number: '01',
    title: 'Cadastre-se e complete o perfil',
    description: 'Cadastre-se gratuitamente e complete o perfil da sua empresa.',
  },
  {
    number: '02',
    title: 'Navegue e encontre oportunidades',
    description: (
      <>
        Navegue pelas oportunidades e use{' '}
        <Tooltip text="Créditos são a moeda da plataforma, usados para acessar os detalhes de contato de um cliente. Você pode comprar pacotes de créditos.">
          <span className="text-yellow-400 underline decoration-dotted cursor-help">
            créditos
          </span>
        </Tooltip>{' '}
        para obter os dados de contato dos clientes interessados.
      </>
    ),
  },
  {
    number: '03',
    title: 'Negocie e feche o negócio',
    description: 'Responda, negocie e feche — 100% do valor do serviço fica com você.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Como funciona</h2>
           <p className="text-lg text-gray-400 mt-2">Em 3 passos simples, sua empresa está conectada a novos clientes.</p>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                 <div className="relative mb-4 inline-block">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-700 rounded-full border-4 border-slate-900">
                        <span className="text-3xl font-bold text-yellow-400">{step.number}</span>
                    </div>
                 </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
