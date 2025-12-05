import React from 'react';
import ConsumerPortal from './ConsumerPortal';
import Card from '../common/Card';
import { SparklesIcon } from '../icons/SparklesIcon';
import { MessageCircleIcon } from '../icons/MessageCircleIcon';
import { BoltIcon } from '../icons/BoltIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { UserSession } from '../../contexts/AuthContext';

interface SolkarlinkExperienceProps {
    userSession: UserSession | null;
    setUserSession: (session: UserSession) => void;
}

const benefits = [
    {
        title: 'Onboarding guiado',
        description: 'Fluxo pronto para captar dados do consumidor e direcionar o atendimento.',
        icon: <SparklesIcon className="w-5 h-5 text-indigo-300" />,
    },
    {
        title: 'Camada conversacional',
        description: 'Chat conectado ao agente da SolarLink com fallback automático para modo offline.',
        icon: <MessageCircleIcon className="w-5 h-5 text-blue-300" />,
    },
    {
        title: 'Pronto para escalar',
        description: 'Componentes desacoplados para embedar a experiência em outras páginas ou apps.',
        icon: <BoltIcon className="w-5 h-5 text-amber-300" />,
    },
    {
        title: 'Proteção de dados',
        description: 'Avisos de consentimento e armazenamento restrito aos fins da jornada.',
        icon: <ShieldCheckIcon className="w-5 h-5 text-emerald-300" />,
    },
];

const SolkarlinkExperience: React.FC<SolkarlinkExperienceProps> = ({ userSession, setUserSession }) => {
    return (
        <section className="relative min-h-screen pt-24 pb-20 px-6 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_35%)]" aria-hidden></div>
            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 font-medium text-sm">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Portal SolarLink • Nova experiência</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                            Recrie e amplie o app de consultoria solar
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl">
                            Utilize a base do portal SolarLink para lançar um app dedicado à jornada do consumidor. Estruture a captura de dados, mantenha a conversa com IA e reutilize as integrações já prontas.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {benefits.map((item) => (
                                <Card key={item.title} className="bg-slate-900/60 border-slate-800 p-4 flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-white/5">{item.icon}</div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-100 text-sm p-4 max-w-xl">
                            <p className="font-semibold">Como usar</p>
                            <p>Abra este fluxo pronto na sua rota dedicada ou incorpore o componente <code>ConsumerPortal</code> em outros pontos do site com a prop <code>showIntro</code> para controlar o cabeçalho.</p>
                        </div>
                    </div>

                    <div id="app-solkarlink" className="lg:sticky lg:top-24">
                        <ConsumerPortal userSession={userSession} setUserSession={setUserSession} showIntro={false} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolkarlinkExperience;
