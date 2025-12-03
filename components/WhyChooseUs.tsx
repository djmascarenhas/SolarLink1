
import React from 'react';
import Card from './common/Card';
import { RocketIcon } from './icons/RocketIcon';
import { TargetIcon } from './icons/TargetIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';

const features = [
  {
    icon: <RocketIcon className="w-10 h-10 text-yellow-400 mb-4" />,
    title: 'Simples',
    description: 'Cadastro rápido e interface pensada para integradores e instaladores.',
  },
  {
    icon: <TargetIcon className="w-10 h-10 text-yellow-400 mb-4" />,
    title: 'Eficiente',
    description: 'Trazemos leads através de ações de marketing e garantimos o contato do comprador.',
  },
  {
    icon: <DollarSignIcon className="w-10 h-10 text-yellow-400 mb-4" />,
    title: 'Acessível',
    description: 'Sem mensalidade. Você só paga pelos créditos que usar para responder às oportunidades — nada de comissão.',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="vantagens" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Por que escolher a SolarLink?</h2>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
              {feature.icon}
              <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
