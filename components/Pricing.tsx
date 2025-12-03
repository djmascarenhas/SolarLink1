
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CheckIcon } from './icons/CheckIcon';
import { CoinsIcon } from './icons/CoinsIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { FactoryIcon } from './icons/FactoryIcon';

const consumptionModel = [
  {
    title: 'Residencial',
    description: 'Casas e pequenos comércios (até 10kWp).',
    cost: 1,
    icon: <HomeIcon className="w-8 h-8 text-yellow-400" />,
  },
  {
    title: 'Comercial',
    description: 'Empresas, prédios e mercados (até 75kWp).',
    cost: 3,
    icon: <BuildingIcon className="w-8 h-8 text-blue-400" />,
  },
  {
    title: 'Usinas / Grandes Projetos',
    description: 'Projetos de solo, indústrias e alta tensão.',
    cost: 5,
    icon: <FactoryIcon className="w-8 h-8 text-purple-400" />,
  },
];

const plans = [
  {
    name: 'Iniciante',
    credits: 10,
    price: '49,90',
    features: ['R$ 4,99 por crédito', 'Sem validade de uso', 'Suporte básico'],
    highlight: false,
  },
  {
    name: 'Profissional',
    credits: 50,
    price: '199,90',
    features: ['R$ 3,99 por crédito', 'Economia de 20%', 'Sem validade de uso', 'Suporte prioritário'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    credits: 200,
    price: '699,90',
    features: ['R$ 3,49 por crédito', 'Economia de 30%', 'Sem validade de uso', 'Gerente de conta'],
    highlight: false,
  },
];

interface PricingProps {
  onNavigate?: (view: 'home' | 'opportunities' | 'buy_credits', hash?: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const handleBuyClick = () => {
    if (onNavigate) {
      onNavigate('buy_credits');
      window.scrollTo(0, 0);
    }
  };

  return (
    <section id="comprar" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quanto custa cada oportunidade?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Nosso modelo é justo: o investimento em créditos é proporcional ao potencial de lucro do projeto.
          </p>
          <div className="mt-6 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        </div>

        {/* Consumption Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {consumptionModel.map((item, index) => (
            <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 flex items-center gap-4 transition-transform hover:scale-105">
              <div className="p-3 bg-slate-900 rounded-full border border-slate-700 shadow-inner">
                {item.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                <div className="text-yellow-400 font-bold flex items-center gap-1">
                  <CoinsIcon className="w-4 h-4" />
                  {item.cost} Crédito{item.cost > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Plans Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pacotes de Créditos</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
             Compre créditos e desbloqueie os contatos.
          </p>
        </div>

        {/* Pricing Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex flex-col p-8 transition-transform duration-300 hover:-translate-y-2 ${
                plan.highlight 
                  ? 'border-yellow-500 shadow-yellow-500/20 shadow-xl bg-slate-800' 
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Mais Popular
                </div>
              )}
              
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{plan.name}</h3>
                <div className="flex justify-center items-baseline gap-1 text-white">
                  <span className="text-sm text-gray-400">R$</span>
                  <span className="text-5xl font-bold">{plan.price}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 bg-slate-700/50 py-2 rounded-lg">
                  <CoinsIcon className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-white">{plan.credits} Créditos</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <CheckIcon className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full">
                  <Button 
                    onClick={handleBuyClick}
                    variant={plan.highlight ? 'primary' : 'outline'} 
                    className="w-full justify-center"
                  >
                    Comprar Agora
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
