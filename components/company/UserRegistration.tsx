
import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { supabase } from '../../lib/supabaseClient';
import { UserSession } from '../../contexts/AuthContext';

interface UserRegistrationProps {
    userSession: UserSession | null;
    onBack: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ userSession, onBack }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        whatsapp: '',
        role: 'vendedor',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage(null);

        try {
            if (!userSession?.details?.companyId) {
                alert("Erro: Sessão de empresa não identificada.");
                setIsLoading(false);
                return;
            }

            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    }
                }
            });

            if (authError) {
                if (authError.message.includes("already registered")) {
                    alert("Este e-mail já possui uma conta no sistema.");
                    setIsLoading(false);
                    return;
                }
                throw authError;
            }

            const newUserId = authData.user?.id;
            
            if (newUserId) {
                // 2. Create Profile linked to Company
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: newUserId,
                        company_id: userSession.details.companyId,
                        full_name: formData.fullName,
                        email: formData.email,
                        whatsapp: formData.whatsapp,
                        role: formData.role
                    }]);

                if (profileError) throw profileError;

                // 3. Log action
                await supabase.from('audit_logs').insert({
                    company_id: userSession.details.companyId,
                    user_id: userSession.id,
                    action: 'create_user',
                    details: { 
                        created_user_email: formData.email,
                        role: formData.role
                    }
                });

                setSuccessMessage(`Usuário ${formData.fullName} cadastrado com sucesso!`);
                setFormData({ fullName: '', email: '', whatsapp: '', role: 'vendedor', password: '' });
            } else {
                throw new Error("Falha ao criar ID de usuário.");
            }

        } catch (error: any) {
            console.error("Erro ao cadastrar usuário", error);
            alert(`Erro ao cadastrar usuário: ${error.message || "Tente novamente."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen pt-24 pb-20 bg-transparent animate-fadeIn">
            <div className="container mx-auto px-6 max-w-2xl">
                <button 
                    onClick={onBack}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Voltar para Home
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Gestão de Equipe</h1>
                    <p className="text-gray-400">Cadastre novos usuários para acessarem o painel da sua empresa.</p>
                </div>

                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <BriefcaseIcon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Novo Usuário</h2>
                            <p className="text-xs text-gray-400">Empresa: {userSession?.details?.companyName}</p>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3 text-green-400 animate-fadeIn">
                            <CheckIcon className="w-5 h-5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                        placeholder="Ex: Ana Souza"
                                    />
                                    <UserCircleIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Função / Cargo</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="tecnico">Técnico</option>
                                    <option value="financeiro">Financeiro</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">E-mail Profissional</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                    placeholder="ana@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp</label>
                                <input 
                                    type="tel" 
                                    name="whatsapp"
                                    required
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Senha de Acesso</label>
                            <input 
                                type="password" 
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">O usuário receberá instruções para primeiro acesso.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                            <Button variant="primary" type="submit" disabled={isLoading} className="min-w-[150px]">
                                {isLoading ? 'Salvando...' : 'Cadastrar Usuário'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </section>
    );
};

export default UserRegistration;
