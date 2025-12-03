import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { adminService, AdminLead } from '../../lib/adminService';

const LeadsManager: React.FC = () => {
    const [leads, setLeads] = useState<AdminLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await adminService.getRecentLeads();
            setLeads(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="space-y-6 animate-fadeIn">
             <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestão de Leads</h1>
                    <p className="text-gray-400">Oportunidades geradas pelos consumidores.</p>
                </div>
            </header>

            <Card className="bg-slate-800 border-slate-700 p-0 overflow-hidden">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Cidade</th>
                            <th className="px-6 py-4">Conta (R$)</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                                <td className="px-6 py-4">{lead.city}</td>
                                <td className="px-6 py-4">R$ {lead.bill_value}</td>
                                <td className="px-6 py-4">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${lead.status === 'new' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${lead.status === 'distributed' ? 'bg-blue-500/20 text-blue-400' : ''}
                                        ${lead.status === 'qualified' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                    `}>
                                        {lead.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">Visualizar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default LeadsManager;
