
import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserIcon } from './icons/UserIcon';
import { CoinsIcon } from './icons/CoinsIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { SolarLinkService } from '../lib/solarLinkService'; // Service

interface OpportunityDetailProps {
  opportunity: any;
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
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    // Carregar histórico do chat para este lead
    const loadHistory = async () => {
        setLoadingChat(true);
        try {
            const history = await SolarLinkService.getChatHistory(opportunity.id);
            if (history) setChatHistory(history);
        } catch (error) {
            console.error("Erro ao carregar chat", error);
        } finally {
            setLoadingChat(false);
        }
    };
    loadHistory();
  }, [opportunity.id]);

  const handleUnlockClick = () => {
    // Simula desbloqueio local para o exemplo
    if (onUnlock(opportunity.credits)) {
        setUnlocked(true);
    } else {
        alert("Saldo insuficiente.");
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-20 bg-transparent text-white animate-fadeIn">
        <div className="container mx-auto px-6">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
                <ArrowLeftIcon className="w-4 h-4" /> Voltar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/70 border border-slate-700 p-8 rounded-2xl">
                         <h1 className="text-3xl font-bold mb-2">Lead em {opportunity.city}</h1>
                         <p className="text-gray-400">Captado via Portal do Consumidor</p>
                    </div>

                    {/* Histórico do Chat (IA) */}
                    <Card className="bg-slate-900/70 border-slate-700">
                        <h3 className="font-semibold text-lg mb-4 text-indigo-400">Interação com Solara (IA)</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-4 bg-slate-950/30 rounded-xl">
                            {loadingChat ? (
                                <p className="text-gray-500">Carregando conversa...</p>
                            ) : chatHistory.length === 0 ? (
                                <p className="text-gray-500">Nenhuma interação registrada ainda.</p>
                            ) : (
                                chatHistory.map((msg: any) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-xl max-w-[80%] text-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100' 
                                            : 'bg-slate-800 border border-slate-700 text-gray-300'
                                        }`}>
                                            <span className="text-[10px] font-bold block mb-1 opacity-70 uppercase">{msg.role === 'user' ? 'Cliente' : 'Solara'}</span>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
                         <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                             <UserIcon className="w-6 h-6 text-gray-300" />
                             <div><h3 className="font-bold text-white">Contato</h3></div>
                         </div>
                         
                         <div className={`space-y-4 mb-6 relative ${!unlocked ? 'filter blur-sm select-none' : ''}`}>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">Nome</p>
                                 <p className="text-white">{opportunity.rawName || 'Cliente'}</p>
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">WhatsApp</p>
                                 <p className="text-white">{opportunity.rawPhone || '(XX) XXXXX-XXXX'}</p>
                             </div>
                         </div>

                         {!unlocked ? (
                             <Button onClick={handleUnlockClick} className="w-full">
                                Desbloquear ({opportunity.credits} créditos)
                             </Button>
                         ) : (
                             <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => window.open(`https://wa.me/55${opportunity.rawPhone?.replace(/\D/g, '')}`)}>
                                <WhatsAppIcon className="w-4 h-4" /> Abrir WhatsApp
                             </Button>
                         )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default OpportunityDetail;
