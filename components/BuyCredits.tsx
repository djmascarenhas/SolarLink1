
import React, { useState } from 'react';
import Button from './common/Button';
import Card from './common/Card';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { CheckIcon } from './icons/CheckIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PixIcon } from './icons/PixIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface BuyCreditsProps {
  onBack: () => void;
}

const plans = [
  {
    id: 1,
    name: 'Iniciante',
    credits: 10,
    price: 49.90,
    features: ['R$ 4,99 por crédito', 'Sem validade de uso', 'Suporte básico'],
  },
  {
    id: 2,
    name: 'Profissional',
    credits: 50,
    price: 199.90,
    features: ['R$ 3,99 por crédito', 'Economia de 20%', 'Sem validade de uso'],
    recommended: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    credits: 200,
    price: 699.90,
    features: ['R$ 3,49 por crédito', 'Economia de 30%', 'Gerente de conta'],
  },
];

const BuyCredits: React.FC<BuyCreditsProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(2); // Default to Profissional
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  const handleNextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleFinish = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <section className="min-h-screen pt-24 pb-20 bg-transparent animate-fadeIn flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="text-center p-12 bg-slate-900/80 border-green-500/50 shadow-2xl shadow-green-900/20">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
            <p className="text-gray-300 text-lg mb-8">
              Seus <span className="text-yellow-400 font-bold">{selectedPlan.credits} créditos</span> já foram adicionados à sua conta.
              <br />Você receberá o comprovante por e-mail.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
               <Button onClick={onBack} variant="secondary" className="px-8">
                  Voltar para Home
               </Button>
               <Button onClick={onBack} variant="outline" className="px-8">
                  Ver Oportunidades
               </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-20 bg-transparent animate-fadeIn">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Cancelar e Voltar
          </button>
          <h1 className="text-3xl font-bold text-white">Comprar Créditos</h1>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-6 mb-8 max-w-3xl">
             <div className={`flex items-center gap-2 ${step >= 1 ? 'text-yellow-400' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600'}`}>1</div>
                <span className="hidden sm:inline font-medium">Planos</span>
             </div>
             <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
             <div className={`flex items-center gap-2 ${step >= 2 ? 'text-yellow-400' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600'}`}>2</div>
                <span className="hidden sm:inline font-medium">Identificação</span>
             </div>
             <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
             <div className={`flex items-center gap-2 ${step >= 3 ? 'text-yellow-400' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 3 ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600'}`}>3</div>
                <span className="hidden sm:inline font-medium">Pagamento</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
                
                {/* STEP 1: SELECT PLAN */}
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-4 animate-slideIn">
                        {plans.map(plan => (
                             <div 
                                key={plan.id}
                                onClick={() => setSelectedPlanId(plan.id)}
                                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                                    selectedPlanId === plan.id 
                                    ? 'bg-slate-800/80 border-yellow-500 shadow-lg shadow-yellow-500/10' 
                                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                                }`}
                             >
                                {plan.recommended && (
                                    <span className="absolute -top-3 left-6 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Recomendado</span>
                                )}
                                <div>
                                    <h3 className={`font-bold text-lg ${selectedPlanId === plan.id ? 'text-white' : 'text-gray-300'}`}>{plan.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-400 font-bold">{plan.credits} Créditos</span>
                                        <span className="text-gray-500 text-sm">•</span>
                                        <span className="text-gray-400 text-sm">{plan.features[0]}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">R$ {plan.price.toFixed(2).replace('.', ',')}</div>
                                    <div className={`w-5 h-5 rounded-full border-2 ml-auto mt-2 flex items-center justify-center ${selectedPlanId === plan.id ? 'border-yellow-500' : 'border-gray-500'}`}>
                                        {selectedPlanId === plan.id && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                                    </div>
                                </div>
                             </div>
                        ))}
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleNextStep}>Continuar para Identificação</Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: IDENTIFICATION */}
                {step === 2 && (
                    <Card className="animate-slideIn">
                        <h3 className="text-xl font-bold text-white mb-6">Identificação</h3>
                        
                        {/* Mock Login Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
                                <input type="email" defaultValue="usuario@exemplo.com" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
                                <input type="password" defaultValue="password" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                            </div>
                            
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-start gap-3 mt-4">
                                <LockClosedIcon className="w-5 h-5 text-indigo-400 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-bold text-indigo-300 mb-1">Ambiente Seguro</p>
                                    <p>Seus dados são protegidos com criptografia de ponta a ponta.</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button onClick={handlePrevStep} className="text-gray-400 hover:text-white transition-colors">Voltar</button>
                                <Button onClick={handleNextStep}>Continuar para Pagamento</Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 3 && (
                    <div className="space-y-6 animate-slideIn">
                        <Card>
                             <h3 className="text-xl font-bold text-white mb-6">Forma de Pagamento</h3>
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                 <button 
                                    onClick={() => setPaymentMethod('credit_card')}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                        paymentMethod === 'credit_card' 
                                        ? 'bg-slate-700 border-yellow-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700'
                                    }`}
                                 >
                                     <CreditCardIcon className="w-8 h-8" />
                                     <span className="font-medium">Cartão de Crédito</span>
                                 </button>
                                 <button 
                                    onClick={() => setPaymentMethod('pix')}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                        paymentMethod === 'pix' 
                                        ? 'bg-slate-700 border-green-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700'
                                    }`}
                                 >
                                     <PixIcon className="w-8 h-8" />
                                     <span className="font-medium">Pix (Aprovação Imediata)</span>
                                 </button>
                             </div>

                             {paymentMethod === 'credit_card' && (
                                 <div className="space-y-4 animate-fadeIn">
                                     <div>
                                         <label className="block text-xs text-gray-400 mb-1">Número do Cartão</label>
                                         <div className="relative">
                                             <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500 pl-10" />
                                             <CreditCardIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div>
                                             <label className="block text-xs text-gray-400 mb-1">Validade</label>
                                             <input type="text" placeholder="MM/AA" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500" />
                                         </div>
                                         <div>
                                             <label className="block text-xs text-gray-400 mb-1">CVV</label>
                                             <input type="text" placeholder="123" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500" />
                                         </div>
                                     </div>
                                     <div>
                                         <label className="block text-xs text-gray-400 mb-1">Nome no Cartão</label>
                                         <input type="text" placeholder="COMO NO CARTAO" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500" />
                                     </div>
                                 </div>
                             )}

                             {paymentMethod === 'pix' && (
                                 <div className="bg-slate-900 p-6 rounded-lg text-center animate-fadeIn border border-slate-700">
                                     <div className="w-48 h-48 bg-white mx-auto mb-4 p-2">
                                         <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SolarLinkPaymentExample" alt="QR Code Pix" className="w-full h-full" />
                                     </div>
                                     <p className="text-sm text-gray-400 mb-2">Escaneie o QR Code acima com seu app de banco.</p>
                                     <p className="text-xs text-yellow-500">O pagamento será confirmado automaticamente.</p>
                                 </div>
                             )}
                        </Card>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={handlePrevStep} className="text-gray-400 hover:text-white transition-colors">Voltar</button>
                            <Button 
                                onClick={handleFinish} 
                                disabled={isProcessing}
                                variant={paymentMethod === 'pix' ? 'secondary' : 'primary'}
                                className="w-full md:w-auto min-w-[200px]"
                            >
                                {isProcessing ? 'Processando...' : `Pagar R$ ${selectedPlan.price.toFixed(2).replace('.', ',')}`}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar: Order Summary */}
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-600">
                        <h3 className="font-bold text-white mb-4 pb-4 border-b border-slate-700">Resumo do Pedido</h3>
                        
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Pacote</span>
                            <span className="text-white font-medium">{selectedPlan.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Qtd. Créditos</span>
                            <span className="text-yellow-400 font-bold">{selectedPlan.credits}</span>
                        </div>
                        <div className="flex justify-between mb-4 pb-4 border-b border-slate-700">
                            <span className="text-gray-400">Preço Unit.</span>
                            <span className="text-gray-300">R$ {(selectedPlan.price / selectedPlan.credits).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-gray-300 font-bold">Total</span>
                            <span className="text-2xl font-bold text-white">R$ {selectedPlan.price.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                                <span>Garantia de 7 dias</span>
                            </div>
                             <div className="flex items-center gap-2 text-xs text-gray-400">
                                <LockClosedIcon className="w-4 h-4 text-green-500" />
                                <span>Pagamento 100% Seguro (SSL)</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BuyCredits;
