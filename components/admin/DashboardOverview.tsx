import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { adminService, DashboardStats, AdminLead } from '../../lib/adminService';

const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<AdminLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const statsData = await adminService.getDashboardStats();
            const leadsData = await adminService.getRecentLeads();
            setStats(statsData);
            setRecentLeads(leadsData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="text-white">Carregando dados...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
                <p className="text-gray-400">Acompanhamento em tempo real da plataforma SolarLink.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Receita Total"
                    value={`R$ ${stats?.totalRevenue.toLocaleString('pt-BR')}`}
                    trend="+12%"
                    color="text-green-400"
                />
                <StatsCard
                    label="Leads Gerados"
                    value={stats?.totalLeads.toString() || '0'}
                    trend="+5%"
                    color="text-blue-400"
                />
                <StatsCard
                    label="Leads Hoje"
                    value={stats?.leadsToday.toString() || '0'}
                    trend="Normal"
                    color="text-yellow-400"
                />
                <StatsCard
                    label="Empresas Ativas"
                    value={stats?.activeCompanies.toString() || '0'}
                    trend="+2"
                    color="text-indigo-400"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <div className="lg:col-span-2">
                    <Card className="bg-slate-800 border-slate-700 h-full">
                        <h3 className="text-xl font-semibold text-white mb-6">Últimos Leads</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Cidade</th>
                                        <th className="px-4 py-3">Valor Conta</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {recentLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                                            <td className="px-4 py-3">{lead.city}</td>
                                            <td className="px-4 py-3">R$ {lead.bill_value}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                    ${lead.status === 'new' ? 'bg-green-500/20 text-green-400' : ''}
                                                    ${lead.status === 'distributed' ? 'bg-blue-500/20 text-blue-400' : ''}
                                                    ${lead.status === 'qualified' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                                `}>
                                                    {lead.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* System Alerts / Quick Actions */}
                <div className="lg:col-span-1">
                    <Card className="bg-slate-800 border-slate-700 h-full">
                        <h3 className="text-xl font-semibold text-white mb-6">Ações Rápidas</h3>
                        <div className="space-y-4">
                            <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium">
                                Aprovar Novas Empresas (2)
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                Configurar Preço do Lead
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                Exportar Relatórios
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700">
                             <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase">Status do Sistema</h4>
                             <div className="flex items-center gap-3 mb-2">
                                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                 <span className="text-gray-300 text-sm">Banco de Dados: Operacional</span>
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                 <span className="text-gray-300 text-sm">IA Agent: Online</span>
                             </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ label, value, trend, color }: any) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-all">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className={`text-sm font-medium ${trend === 'Normal' ? 'text-gray-500' : 'text-green-400'}`}>
                {trend}
            </span>
        </div>
    </div>
);

export default DashboardOverview;
