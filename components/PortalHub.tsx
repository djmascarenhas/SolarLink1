
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { SunIcon } from './icons/SunIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon'; // Assuming you have an arrow icon, or use simple text

interface PortalHubProps {
    onNavigate: (view: 'home' | 'consumer' | 'solkarlink') => void;
}

const PortalHub: React.FC<PortalHubProps> = ({ onNavigate }) => {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden animate-fadeIn py-20 px-6">
            
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight">
                        O Futuro da Energia Solar <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Começa Aqui
                        </span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                        A plataforma completa que conecta quem deseja economizar com quem entende de instalação. Qual é o seu objetivo hoje?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Card Consumidor */}
                    <div
                        onClick={() => onNavigate('consumer')}
                        className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col items-center text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        
                        <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-indigo-500/30">
                            <SunIcon className="w-12 h-12 text-indigo-300" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white mb-3">Para sua Casa ou Negócio</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Quer reduzir sua conta de luz em até 95%? Receba uma consultoria gratuita com nossa IA e descubra seu potencial de economia.
                        </p>
                        
                        <Button variant="primary" className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white border-none w-full md:w-auto px-8 py-4 text-lg shadow-lg shadow-indigo-900/50">
                            Quero Economizar Energia
                        </Button>
                    </div>

                    {/* Card Empresas/Integradores */}
                    <div
                        onClick={() => onNavigate('home')}
                        className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col items-center text-center"
                    >
                         <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-yellow-500/30">
                            <BuildingIcon className="w-12 h-12 text-yellow-400" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white mb-3">Para Integradores</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Encontre clientes qualificados (leads) na sua região. Cadastre sua empresa, compre créditos e feche mais negócios.
                        </p>
                        
                        <Button variant="primary" className="mt-auto w-full md:w-auto px-8 py-4 text-lg">
                            Acessar Portal de Empresas
                        </Button>
                    </div>

                    {/* Card App dedicado */}
                    <div
                        onClick={() => onNavigate('solkarlink')}
                        className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-slate-900/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/20 flex flex-col items-center text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                        <div className="w-24 h-24 bg-sky-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-sky-500/30">
                            <ArrowRightIcon className="w-12 h-12 text-sky-300" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">App SolarLink</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Abra a jornada completa de consumidor em um app dedicado, pronto para ser embutido em campanhas e outras páginas.
                        </p>

                        <Button variant="secondary" className="mt-auto w-full md:w-auto px-8 py-4 text-lg border-sky-400/50 text-sky-200 hover:bg-sky-500/10">
                            Explorar o App
                        </Button>
                    </div>
                </div>

                <div className="mt-16 text-center animate-pulse">
                    <p className="text-sm text-gray-400 uppercase tracking-widest">Tecnologia SolarLink © 2025</p>
                </div>
            </div>
        </section>
    );
};

export default PortalHub;
