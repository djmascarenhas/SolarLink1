
import React from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface UserSession {
    name: string;
    type: 'consumer' | 'business';
    id: string;
    details?: any; // Objeto flexível para guardar créditos, nome da empresa, etc.
}

interface UserStatusBarProps {
    user: UserSession;
    onLogout: () => void;
}

const UserStatusBar: React.FC<UserStatusBarProps> = ({ user, onLogout }) => {
    return (
        <div className="bg-slate-900 border-b border-slate-700 py-3 animate-fadeIn w-full shadow-lg">
            <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                
                {/* Lado Esquerdo: Identificação */}
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.type === 'business' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {user.type === 'business' ? <BuildingIcon className="w-5 h-5" /> : <UserCircleIcon className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium leading-none flex items-center gap-1">
                            Olá, 
                            <button 
                                onClick={() => alert("Perfil do usuário em breve!")} 
                                className="font-bold hover:text-yellow-400 transition-colors underline decoration-dotted decoration-gray-500 hover:decoration-yellow-400 cursor-pointer"
                                title="Ver Perfil"
                            >
                                {user.name}
                            </button>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {user.type === 'business' ? user.details?.companyName : 'Consumidor Final'}
                        </p>
                    </div>
                </div>

                {/* Centro: Status do Processo */}
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                    {user.type === 'business' ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-gray-300">
                                Conta Verificada • <span className="text-yellow-400 font-bold">{user.details?.credits || 0} Créditos</span> disponíveis
                            </span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-xs text-gray-300">
                                Consultoria com Solara: <span className="text-indigo-300 font-medium">Ativa</span>
                            </span>
                        </>
                    )}
                </div>

                {/* Lado Direito: Ações */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onLogout}
                        className="text-xs font-medium text-red-400 hover:text-red-300 hover:underline transition-colors"
                    >
                        Sair / Trocar Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserStatusBar;
