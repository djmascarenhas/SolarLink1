
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { CoinsIcon } from './icons/CoinsIcon';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card className="flex flex-col items-start text-left">
            <CoinsIcon className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Transparência nos Custos</h3>
            <p className="text-gray-400 mb-6">
              Você compra pacotes de créditos conforme sua necessidade; pacotes maiores saem com desconto. Ver as oportunidades é 100% gratuito — só gasta créditos quando quiser acessar o contato e responder.
            </p>
            <a href="#comprar" className="inline-block">
                <Button variant="outline">Comprar créditos</Button>
            </a>
          </Card>
          <Card className="flex flex-col items-start text-left">
            <ShieldCheckIcon className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Segurança no Contato</h3>
            <p className="text-gray-400">
              Se houver qualquer problema na obtenção do contato, você pode solicitar a devolução dos créditos utilizados e reutilizá-los em outra oportunidade. Sua tranquilidade é nossa prioridade.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
