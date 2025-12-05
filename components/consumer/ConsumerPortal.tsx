import React, { useState, useEffect } from 'react';
import ConsumerForm, { ConsumerData } from './ConsumerForm';
import ConsumerSelection from './ConsumerSelection';
import ConsumerChat from './ConsumerChat';
import Card from '../common/Card';
import { SparklesIcon } from '../icons/SparklesIcon';
import { UserSession } from '../../contexts/AuthContext';

interface ConsumerPortalProps {
    userSession: UserSession | null;
    setUserSession: (session: UserSession) => void;
    showIntro?: boolean;
}

const ConsumerPortal: React.FC<ConsumerPortalProps> = ({ userSession, setUserSession, showIntro = true }) => {
    const [step, setStep] = useState<'form' | 'selection' | 'chat'>('form');
    const [userData, setUserData] = useState<ConsumerData | null>(null);
    const [selectedContext, setSelectedContext] = useState<string>('');

    // Auto-login consumer if session exists
    useEffect(() => {
        if (userSession && userSession.type === 'consumer') {
            setUserData({
                id: userSession.id,
                name: userSession.name,
                whatsapp: userSession.details?.whatsapp || '',
                city: userSession.details?.city || '',
                uf: userSession.details?.uf || ''
            });
            // If returning, go to selection to reaffirm intent
            setStep('selection'); 
        }
    }, [userSession]);

    const handleFormSubmit = (data: ConsumerData) => {
        setUserData(data);
        
        // Update global session state
        setUserSession({
            id: data.id || 'temp',
            name: data.name,
            type: 'consumer',
            details: {
                whatsapp: data.whatsapp,
                city: data.city,
                uf: data.uf
            }
        });

        setStep('selection');
    };

    const handleSelection = (context: string) => {
        setSelectedContext(context);
        setStep('chat');
    };

    return (
        <section className="min-h-screen pt-24 pb-20 bg-transparent animate-fadeIn">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {showIntro && (
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium text-sm mb-4">
                                <SparklesIcon className="w-4 h-4" />
                                <span>Consultoria Gratuita com IA</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Descubra o potencial solar da sua casa
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Use nossa inteligência artificial para entender quanto você pode economizar e tire todas as suas dúvidas sobre energia solar.
                            </p>
                        </div>
                    )}

                    <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700 shadow-2xl p-0 overflow-hidden min-h-[500px] flex flex-col relative">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 flex-grow flex flex-col">
                            {step === 'form' && (
                                <ConsumerForm onSubmit={handleFormSubmit} />
                            )}
                            
                            {step === 'selection' && userData && (
                                <ConsumerSelection 
                                    userName={userData.name.split(' ')[0]} 
                                    onSelect={handleSelection} 
                                />
                            )}

                            {step === 'chat' && userData && (
                                <ConsumerChat 
                                    userData={userData} 
                                    initialContext={selectedContext}
                                />
                            )}
                        </div>
                    </Card>
                    
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        <p>Seus dados são usados apenas para personalizar sua experiência. <br/>Não compartilhamos com terceiros sem sua permissão.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsumerPortal;