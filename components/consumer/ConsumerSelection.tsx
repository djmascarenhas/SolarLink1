import React from 'react';
import { HomeIcon } from '../icons/HomeIcon';
import { BuildingIcon } from '../icons/BuildingIcon';
import { FactoryIcon } from '../icons/FactoryIcon';

interface ConsumerSelectionProps {
    userName: string;
    onSelect: (type: string) => void;
}

const ConsumerSelection: React.FC<ConsumerSelectionProps> = ({ userName, onSelect }) => {
    return (
        <div className="p-8 md:p-12 flex flex-col justify-center h-full animate-fadeIn">
            <h2 className="text-3xl font-bold text-white mb-2">Olá, {userName}!</h2>
            <p className="text-gray-400 mb-8 text-lg">
                Para nossa IA te ajudar melhor, qual é o tipo do seu imóvel ou necessidade?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                <button 
                    onClick={() => onSelect('Residencial')}
                    className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                    <div className="w-12 h-12 bg-slate-700 group-hover:bg-indigo-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                        <HomeIcon className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Residencial</h3>
                    <p className="text-sm text-gray-400">Casas, sobrados ou condomínios.</p>
                </button>

                <button 
                    onClick={() => onSelect('Comercial')}
                    className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                    <div className="w-12 h-12 bg-slate-700 group-hover:bg-indigo-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                        <BuildingIcon className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Comercial</h3>
                    <p className="text-sm text-gray-400">Empresas, lojas ou galpões.</p>
                </button>

                <button 
                    onClick={() => onSelect('Rural/Usina')}
                    className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                    <div className="w-12 h-12 bg-slate-700 group-hover:bg-indigo-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                        <FactoryIcon className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Rural / Usina</h3>
                    <p className="text-sm text-gray-400">Sítios, fazendas ou investimento.</p>
                </button>

                 <button 
                    onClick={() => onSelect('Consultoria Geral')}
                    className="group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                    <div className="w-12 h-12 bg-slate-700 group-hover:bg-indigo-500 rounded-lg flex items-center justify-center mb-4 transition-colors">
                        <span className="text-2xl">💡</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Ainda não sei</h3>
                    <p className="text-sm text-gray-400">Quero tirar dúvidas gerais.</p>
                </button>
            </div>
        </div>
    );
};

export default ConsumerSelection;