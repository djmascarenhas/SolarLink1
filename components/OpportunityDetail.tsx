
import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { BoltIcon } from './icons/BoltIcon';
import { SunIcon } from './icons/SunIcon';
import { UserIcon } from './icons/UserIcon';
import { CoinsIcon } from './icons/CoinsIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { FactoryIcon } from './icons/FactoryIcon';

interface Opportunity {
  id: number;
  type: string;
  city: string;
  uf: string;
  lat: number;
  lng: number;
  billValue: string;
  avgConsumption: string;
  roofType: string;
  date: string;
  credits: number;
  description: string;
  systemSize: string;
  estimatedSavings: string;
  distanceFromUser?: number;
}

interface OpportunityDetailProps {
  opportunity: Opportunity;
  userBalance: number;
  onBack: () => void;
  onBuyCredits: () => void;
  onUnlock: (cost: number) => boolean;
}

const OpportunityDetail: React.FC<OpportunityDetailProps> = ({
  opportunity,
  userBalance,
  onBack,
  onBuyCredits,
  onUnlock,
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reset local state when opportunity changes
  useEffect(() => {
    setUnlocked(false);
    setShowConfirmModal(false);
    window.scrollTo(0, 0);
  }, [opportunity.id]);

  const getIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case 'Residencial': return <HomeIcon className={`${className} text-yellow-400`} />;
      case 'Comercial': return <BuildingIcon className={`${className} text-blue-400`} />;
      case 'Usina': return <FactoryIcon className={`${className} text-purple-400`} />;
      default: return <HomeIcon className={`${className} text-gray-400`} />;
    }
  };

  const handleUnlockClick = () => {
    setShowConfirmModal(true);
  };

  const confirmUnlockAction = () => {
    const success = onUnlock(opportunity.credits);
    if (success) {
      setUnlocked(true);
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
      // Optional: Trigger a toast or alert for insufficient funds if not handled by parent
      alert("Saldo insuficiente para desbloquear este contato.");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `☀️ *Oportunidade SolarLink Encontrada!*\n\n` +
                 `🏢 *Tipo:* ${opportunity.type}\n` +
                 `📍 *Local:* ${opportunity.city} - ${opportunity.uf}\n` +
                 `⚡ *Sistema Est:* ${opportunity.systemSize}\n` +
                 `💰 *Conta Atual:* ${opportunity.billValue}\n\n` +
                 `Veja mais detalhes na plataforma!`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="min-h-screen pt-24 pb-20 bg-transparent text-white animate-fadeIn relative">
        {/* Confirmation Modal */}
        {showConfirmModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full relative z-10 shadow-2xl animate-scaleIn">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CoinsIcon className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar Desbloqueio</h3>
                        <p className="text-gray-300">
                            Você está prestes a utilizar <span className="text-yellow-400 font-bold">{opportunity.credits} créditos</span> para visualizar os dados deste contato.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button variant="primary" onClick={confirmUnlockAction} className="w-full justify-center">
                            Confirmar e Desbloquear
                        </Button>
                        <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="w-full justify-center border-slate-600 text-gray-400 hover:text-white hover:border-white">
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        )}

        <div className="container mx-auto px-6">
            {/* Nav Back */}
            <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 bg-slate-900/50 p-2 rounded-lg inline-flex"
            >
                <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-slate-700 border border-slate-700 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Voltar para a lista</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 p-8 rounded-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            {getIcon(opportunity.type, "w-64 h-64")}
                         </div>
                         
                         <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-700 border border-slate-600 text-gray-300">
                                    ID: #{opportunity.id.toString().padStart(4, '0')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    opportunity.type === 'Residencial' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    opportunity.type === 'Comercial' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                }`}>
                                    {opportunity.type}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Projeto Solar {opportunity.type}</h1>
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPinIcon className="w-5 h-5" />
                                <span>{opportunity.city} - {opportunity.uf}</span>
                                <span className="mx-2">•</span>
                                <span>Publicado {opportunity.date}</span>
                            </div>
                         </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900/70 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <BoltIcon className="w-6 h-6 text-yellow-400" />
                                </div>
                                <h3 className="font-semibold text-lg">Dados de Consumo</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                    <span className="text-gray-400">Valor da Conta:</span>
                                    <span className="font-bold text-white">{opportunity.billValue}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                    <span className="text-gray-400">Consumo Médio:</span>
                                    <span className="font-bold text-white">{opportunity.avgConsumption}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Tensão:</span>
                                    <span className="font-bold text-white">Bifásico 220V</span>
                                </li>
                            </ul>
                        </Card>

                        <Card className="bg-slate-900/70 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <SunIcon className="w-6 h-6 text-orange-400" />
                                </div>
                                <h3 className="font-semibold text-lg">Potencial Técnico</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                    <span className="text-gray-400">Tipo de Telhado:</span>
                                    <span className="font-bold text-white">{opportunity.roofType}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                    <span className="text-gray-400">Sistema Estimado:</span>
                                    <span className="font-bold text-white">{opportunity.systemSize}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-400">Economia Estimada:</span>
                                    <span className="font-bold text-green-400">{opportunity.estimatedSavings}</span>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    {/* Description */}
                    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6 min-h-[150px]">
                        <h3 className="font-semibold text-lg mb-3 text-white border-b border-slate-700 pb-2 inline-block">Sobre o Projeto</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {opportunity.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar / Action Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                                <div className="p-3 bg-slate-700 rounded-full">
                                    <UserIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Dados do Cliente</h3>
                                    <p className="text-xs text-gray-400">Acesso exclusivo</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 relative">
                                {/* Locked Overlay */}
                                {!unlocked && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4 rounded-lg border border-slate-700/50">
                                        <div className="bg-slate-800 p-3 rounded-full mb-3 shadow-lg">
                                            <CoinsIcon className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-medium">Use {opportunity.credits} créditos para visualizar</p>
                                    </div>
                                )}

                                {/* Content (Blurred if locked) */}
                                <div className={!unlocked ? 'filter blur-sm select-none' : ''}>
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Nome</p>
                                        <p className="text-white font-medium">{unlocked ? 'Roberto Almeida' : 'Roberto A******'}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                                        <p className="text-white font-medium">{unlocked ? '(19) 99876-5432' : '(19) 9****-****'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                                        <p className="text-white font-medium">{unlocked ? 'roberto.almeida@email.com' : 'r******@email.com'}</p>
                                    </div>
                                </div>
                            </div>

                            {!unlocked ? (
                                <Button 
                                    variant="primary" 
                                    className="w-full py-4 text-base shadow-lg shadow-yellow-500/20"
                                    onClick={handleUnlockClick}
                                >
                                    Desbloquear Contato
                                </Button>
                            ) : (
                                <Button 
                                    variant="secondary" 
                                    className="w-full py-4 text-base flex items-center justify-center gap-2"
                                    onClick={() => window.location.href = `https://wa.me/5519998765432`}
                                >
                                    <CheckIcon className="w-5 h-5" />
                                    Chamar no WhatsApp
                                </Button>
                            )}
                            
                            <p className="text-xs text-center text-gray-500 mt-4">
                                Ao desbloquear, você concorda com nossos termos de uso. Garantia de contato válido.
                            </p>
                        </div>
                        
                        {/* Summary Box */}
                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Custo desta oportunidade:</span>
                                <span className="text-yellow-400 font-bold">{opportunity.credits} Créditos</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Seu saldo atual:</span>
                                <span className="text-white font-bold">{userBalance} Créditos</span>
                            </div>
                            <button onClick={onBuyCredits} className="block w-full mt-3 text-center text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
                                Comprar mais créditos
                            </button>
                            
                            {/* Share Button */}
                            <button 
                                onClick={handleShareWhatsApp}
                                className="w-full mt-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                                Compartilhar Oportunidade
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default OpportunityDetail;
