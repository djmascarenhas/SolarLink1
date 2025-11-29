
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { MapPinIcon } from './icons/MapPinIcon';
import { BoltIcon } from './icons/BoltIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { FactoryIcon } from './icons/FactoryIcon';
import { CoinsIcon } from './icons/CoinsIcon';

// Mock Data
const opportunitiesData = [
  {
    id: 1,
    type: 'Residencial',
    city: 'Campinas',
    uf: 'SP',
    billValue: 'R$ 450,00',
    roofType: 'Telha Cerâmica',
    date: 'Hoje',
    credits: 1,
  },
  {
    id: 2,
    type: 'Comercial',
    city: 'Belo Horizonte',
    uf: 'MG',
    billValue: 'R$ 3.200,00',
    roofType: 'Metálico',
    date: 'Ontem',
    credits: 3,
  },
  {
    id: 3,
    type: 'Residencial',
    city: 'Sorocaba',
    uf: 'SP',
    billValue: 'R$ 680,00',
    roofType: 'Fibrocimento',
    date: 'Hoje',
    credits: 1,
  },
  {
    id: 4,
    type: 'Usina',
    city: 'Cuiabá',
    uf: 'MT',
    billValue: 'R$ 15.000,00',
    roofType: 'Solo',
    date: '2 dias atrás',
    credits: 5,
  },
  {
    id: 5,
    type: 'Residencial',
    city: 'Curitiba',
    uf: 'PR',
    billValue: 'R$ 550,00',
    roofType: 'Shingle',
    date: '3 horas atrás',
    credits: 1,
  },
  {
    id: 6,
    type: 'Comercial',
    city: 'Ribeirão Preto',
    uf: 'SP',
    billValue: 'R$ 2.100,00',
    roofType: 'Laje Plana',
    date: 'Ontem',
    credits: 3,
  },
];

interface OpportunitiesProps {
    onBack: () => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ onBack }) => {
  const [filterType, setFilterType] = useState('Todos');
  const [filterState, setFilterState] = useState('Todos');

  const filteredData = opportunitiesData.filter(item => {
    const typeMatch = filterType === 'Todos' || item.type === filterType;
    const stateMatch = filterState === 'Todos' || item.uf === filterState;
    return typeMatch && stateMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'Residencial': return <HomeIcon className="w-5 h-5 text-yellow-400" />;
      case 'Comercial': return <BuildingIcon className="w-5 h-5 text-blue-400" />;
      case 'Usina': return <FactoryIcon className="w-5 h-5 text-purple-400" />;
      default: return <HomeIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-20 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <button 
                    onClick={onBack}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 transition-colors"
                >
                    ← Voltar para Home
                </button>
                <h1 className="text-3xl md:text-4xl font-bold">Oportunidades Disponíveis</h1>
                <p className="text-gray-400 mt-2">Encontre o próximo projeto para sua empresa.</p>
            </div>
            
            <div className="flex gap-3">
                <div className="bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <span className="text-xs text-gray-500 uppercase font-bold px-2">Créditos:</span>
                    <span className="text-yellow-400 font-bold px-2">0 disponíveis</span>
                </div>
            </div>
        </div>

        {/* Filtros */}
        <Card className="mb-10 !p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/80">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {['Todos', 'Residencial', 'Comercial', 'Usina'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filterType === type 
                            ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' 
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            
            <select 
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full md:w-40 p-2.5 outline-none"
            >
                <option value="Todos">Todos os Estados</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="MT">Mato Grosso (MT)</option>
            </select>
        </Card>

        {/* Grid de Oportunidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((opp) => (
                <div 
                    key={opp.id} 
                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 flex flex-col"
                >
                    <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 bg-slate-900/80 py-1.5 px-3 rounded-full border border-slate-700">
                                {getIcon(opp.type)}
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">{opp.type}</span>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{opp.date}</span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-200">
                                <MapPinIcon className="w-5 h-5 text-gray-500" />
                                <span className="font-medium">{opp.city} - {opp.uf}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-200">
                                <BoltIcon className="w-5 h-5 text-gray-500" />
                                <span>Conta: <span className="font-semibold text-white">{opp.billValue}</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-200">
                                <HomeIcon className="w-5 h-5 text-gray-500" />
                                <span>Telhado: {opp.roofType}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 border-t border-slate-700 flex justify-between items-center group-hover:bg-slate-900/80 transition-colors">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                            <CoinsIcon className="w-4 h-4" />
                            <span>{opp.credits} Crédito{opp.credits > 1 ? 's' : ''}</span>
                        </div>
                        <Button variant="primary" className="py-2 px-4 text-sm !shadow-none">
                            Desbloquear
                        </Button>
                    </div>
                </div>
            ))}
        </div>
        
        {filteredData.length === 0 && (
            <div className="text-center py-20 opacity-60">
                <p className="text-xl">Nenhuma oportunidade encontrada com os filtros selecionados.</p>
            </div>
        )}

      </div>
    </section>
  );
};

export default Opportunities;
