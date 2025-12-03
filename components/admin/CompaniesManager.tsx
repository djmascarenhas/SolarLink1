import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { adminService, AdminCompany } from '../../lib/adminService';

const CompaniesManager: React.FC = () => {
    const [companies, setCompanies] = useState<AdminCompany[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await adminService.getCompanies();
            setCompanies(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleApprove = async (id: string) => {
        await adminService.approveCompany(id);
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Empresas</h1>
                    <p className="text-gray-400">Integradores solares cadastrados na plataforma.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
                    Adicionar Manualmente
                </button>
            </header>

            <Card className="bg-slate-800 border-slate-700 p-0 overflow-hidden">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4">Cidade</th>
                            <th className="px-6 py-4">Créditos</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                                <td className="px-6 py-4">{company.city}</td>
                                <td className="px-6 py-4 text-yellow-400 font-bold">{company.credits}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${company.status === 'active' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${company.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : ''}
                                        ${company.status === 'suspended' ? 'bg-red-500/20 text-red-400' : ''}
                                    `}>
                                        {company.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {company.status === 'pending' && (
                                        <button
                                            onClick={() => handleApprove(company.id)}
                                            className="text-green-400 hover:text-green-300 font-medium text-sm"
                                        >
                                            Aprovar
                                        </button>
                                    )}
                                    <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default CompaniesManager;
