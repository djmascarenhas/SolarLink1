
import React, { useState } from 'react';
import Button from '../common/Button';
import { leadsApi } from '../../lib/api';

export interface ConsumerData {
    id?: string; // ID gerado pelo Supabase
    name: string;
    whatsapp: string;
    city: string;
    uf: string;
}

interface ConsumerFormProps {
    onSubmit: (data: ConsumerData) => void;
}

const ConsumerForm: React.FC<ConsumerFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<ConsumerData>({
        name: '',
        whatsapp: '',
        city: '',
        uf: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.name && formData.whatsapp && formData.city && formData.uf) {
            setIsLoading(true);
            try {
                const lead = await leadsApi.createLead({
                    name: formData.name,
                    whatsapp: formData.whatsapp,
                    city: formData.city,
                    uf: formData.uf,
                });

                if (lead?.id) {
                    onSubmit({ ...formData, id: lead.id });
                } else {
                    onSubmit({ ...formData, id: 'temp-' + Date.now() });
                }
            } catch (err) {
                 console.error("Erro conexão:", err);
                 onSubmit({ ...formData, id: 'temp-' + Date.now() });
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };

    return (
        <div className="p-8 md:p-12 flex flex-col justify-center h-full animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Vamos começar?</h2>
            <p className="text-gray-400 mb-8">Precisamos de poucos dados para a Solara (nossa IA) personalizar seu atendimento.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Seu Nome</label>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Ex: Maria Souza"
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
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="(00) 00000-0000"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                        <input 
                            type="text" 
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="São Paulo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">UF</label>
                        <input 
                            type="text" 
                            name="uf"
                            required
                            maxLength={2}
                            value={formData.uf}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                            placeholder="SP"
                        />
                    </div>
                </div>

                <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-lg shadow-indigo-900/50 flex justify-center"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Iniciar Chat Inteligente'}
                </Button>
            </form>
        </div>
    );
};

export default ConsumerForm;
