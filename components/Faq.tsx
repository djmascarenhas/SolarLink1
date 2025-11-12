
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const faqData = [
  {
    question: 'Preciso pagar mensalidade ou comissão?',
    answer: 'Não. A SolarLink não cobra mensalidade nem comissão sobre os serviços fechados. Você só utiliza créditos para acessar os contatos das oportunidades que te interessam.',
  },
  {
    question: 'Como os créditos funcionam?',
    answer: 'Você adquire pacotes de créditos e os utiliza para desbloquear os dados de contato de clientes que publicaram uma oportunidade. Oportunidades diferentes podem ter custos de créditos diferentes.',
  },
  {
    question: 'O que acontece se eu não conseguir contatar o cliente?',
    answer: 'Nós garantimos a qualidade do contato. Se você encontrar um número de telefone inválido, e-mail que não existe ou qualquer outro problema que impeça o primeiro contato, pode solicitar a devolução dos seus créditos para usá-los em outra oportunidade.',
  },
  {
    question: 'Como a SolarLink atrai clientes para a plataforma?',
    answer: 'Investimos em diversas estratégias de marketing digital, como anúncios, SEO (otimização para buscadores) e parcerias para atrair pessoas e empresas que buscam ativamente por serviços de energia solar.',
  },
];

interface FaqItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-700">
      <button
        onClick={onClick}
        className="w-full text-left flex justify-between items-center py-5 px-2"
      >
        <h3 className="text-lg font-medium text-white">{item.question}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-yellow-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="text-gray-400 pb-5 px-2">{item.answer}</p>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Perguntas Frequentes</h2>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
