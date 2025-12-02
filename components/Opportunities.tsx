
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { MapPinIcon } from './icons/MapPinIcon';
import { BoltIcon } from './icons/BoltIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { FactoryIcon } from './icons/FactoryIcon';
import { CoinsIcon } from './icons/CoinsIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserIcon } from './icons/UserIcon';
import { SunIcon } from './icons/SunIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TargetIcon } from './icons/TargetIcon';

// Mock Data Expanded with Lat/Lng
const opportunitiesData = [
  {
    id: 1,
    type: 'Residencial',
    city: 'Campinas',
    uf: 'SP',
    lat: -22.9099,
    lng: -47.0626,
    billValue: 'R$ 450,00',
    avgConsumption: '500 kWh',
    roofType: 'Telha Cerâmica',
    date: 'Hoje',
    credits: 1,
    description: 'Residência térrea, fácil acesso ao telhado. Cliente busca reduzir a conta de luz e valorizar o imóvel. Possui espaço para cerca de 8 painéis.',
    systemSize: '4.2 kWp',
    estimatedSavings: 'R$ 5.400 / ano'
  },
  {
    id: 2,
    type: 'Comercial',
    city: 'Belo Horizonte',
    uf: 'MG',
    lat: -19.9167,
    lng: -43.9345,
    billValue: 'R$ 3.200,00',
    avgConsumption: '3.500 kWh',
    roofType: 'Metálico',
    date: 'Ontem',
    credits: 3,
    description: 'Pequena fábrica de móveis. Telhado metálico trapezoidal novo. Necessidade de expansão de carga futura.',
    systemSize: '35 kWp',
    estimatedSavings: 'R$ 38.000 / ano'
  },
  {
    id: 3,
    type: 'Residencial',
    city: 'Sorocaba',
    uf: 'SP',
    lat: -23.5015,
    lng: -47.4521,
    billValue: 'R$ 680,00',
    avgConsumption: '750 kWh',
    roofType: 'Fibrocimento',
    date: 'Hoje',
    credits: 1,
    description: 'Casa em condomínio fechado. Telhado com boa orientação Norte. Cliente já possui projeto elétrico da casa.',
    systemSize: '6.0 kWp',
    estimatedSavings: 'R$ 8.100 / ano'
  },
  {
    id: 4,
    type: 'Usina',
    city: 'Cuiabá',
    uf: 'MT',
    lat: -15.6014,
    lng: -56.0979,
    billValue: 'R$ 15.000,00',
    avgConsumption: '18.000 kWh',
    roofType: 'Solo',
    date: '2 dias atrás',
    credits: 5,
    description: 'Investidor procura integrador para obra de usina de solo de 75kW. Terreno plano e limpo, padrão de entrada já adequado.',
    systemSize: '75 kWp',
    estimatedSavings: 'R$ 180.000 / ano'
  },
  {
    id: 5,
    type: 'Residencial',
    city: 'Curitiba',
    uf: 'PR',
    lat: -25.4284,
    lng: -49.2733,
    billValue: 'R$ 550,00',
    avgConsumption: '600 kWh',
    roofType: 'Shingle',
    date: '3 horas atrás',
    credits: 1,
    description: 'Sobrado com telhado Shingle. Cliente exigente com estética. Necessário microinversores.',
    systemSize: '5.0 kWp',
    estimatedSavings: 'R$ 6.600 / ano'
  },
  {
    id: 6,
    type: 'Comercial',
    city: 'Ribeirão Preto',
    uf: 'SP',
    lat: -21.1704,
    lng: -47.8103,
    billValue: 'R$ 2.100,00',
    avgConsumption: '2.300 kWh',
    roofType: 'Laje Plana',
    date: 'Ontem',
    credits: 3,
    description: 'Academia de ginástica. Laje plana com impermeabilização recente. Alta incidência solar.',
    systemSize: '20 kWp',
    estimatedSavings: 'R$ 25.000 / ano'
  },
];

interface OpportunitiesProps {
    onBack: () => void;
    onNavigate?: (view: 'home', hash?: string) => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ onBack, onNavigate }) => {
  const [filterType, setFilterType] = useState('Todos');
  const [filterState, setFilterState] = useState('Todos');
  const [maxDistance, setMaxDistance] = useState<number>(2000); // Slider value in km
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedOpp, setSelectedOpp] = useState<typeof opportunitiesData[0] | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [hoveredMapItem, setHoveredMapItem] = useState<number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Simulated User Location (São Paulo Capital)
  const userLocation = { lat: -23.5505, lng: -46.6333, city: 'São Paulo' };

  // Reset unlocked state when changing opportunities
  React.useEffect(() => {
      setUnlocked(false);
      setShowConfirmModal(false);
  }, [selectedOpp]);

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const filteredData = opportunitiesData.filter(item => {
    const typeMatch = filterType === 'Todos' || item.type === filterType;
    const stateMatch = filterState === 'Todos' || item.uf === filterState;
    
    const distance = calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
    const distanceMatch = distance <= maxDistance;

    return typeMatch && stateMatch && distanceMatch;
  });

  const getIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case 'Residencial': return <HomeIcon className={`${className} text-yellow-400`} />;
      case 'Comercial': return <BuildingIcon className={`${className} text-blue-400`} />;
      case 'Usina': return <FactoryIcon className={`${className} text-purple-400`} />;
      default: return <HomeIcon className={`${className} text-gray-400`} />;
    }
  };

  // Helper to approximate coordinates on a Brazil map background
  const getStateCoordinates = (uf: string) => {
    const coords: Record<string, { top: string; left: string }> = {
        'SP': { top: '72%', left: '60%' },
        'MG': { top: '62%', left: '68%' },
        'PR': { top: '78%', left: '55%' },
        'MT': { top: '50%', left: '40%' },
        'RJ': { top: '74%', left: '72%' },
        'RS': { top: '88%', left: '52%' },
        'BA': { top: '45%', left: '75%' },
        'GO': { top: '58%', left: '55%' },
    };
    return coords[uf] || { top: '50%', left: '50%' }; // Default center
  };

  const handleUnlockClick = () => {
      setShowConfirmModal(true);
  };

  const confirmUnlockAction = () => {
      setUnlocked(true);
      setShowConfirmModal(false);
  };

  const handleBuyCredits = () => {
      if (onNavigate) {
          onNavigate('home', '#comprar');
      }
  };

  const handleMarkerClick = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setActiveMarkerId(prevId => prevId === id ? null : id);
  }

  // --- DETAIL VIEW ---
  if (selectedOpp) {
      return (
        <section className="min-h-screen pt-24 pb-20 bg-transparent text-white animate-fadeIn relative">
            {/* Modal de Confirmação */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full relative z-10 shadow-2xl animate-scaleIn">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CoinsIcon className="w-8 h-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmar Desbloqueio</h3>
                            <p className="text-gray-300">
                                Você está prestes a utilizar <span className="text-yellow-400 font-bold">{selectedOpp.credits} créditos</span> para visualizar os dados deste contato.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button variant="primary" onClick={confirmUnlockAction} className="w-full justify-center">
                                Confirmar e Desbloquear
                            </Button>
                            <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="w-full justify-center border-slate-600 text-gray-400 hover:text-white hover:border-white">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6">
                {/* Nav Back */}
                <button 
                    onClick={() => setSelectedOpp(null)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 bg-slate-900/50 p-2 rounded-lg inline-flex"
                >
                    <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-slate-700 border border-slate-700 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Voltar para a lista</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 p-8 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                {getIcon(selectedOpp.type, "w-64 h-64")}
                             </div>
                             
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-700 border border-slate-600 text-gray-300">
                                        ID: #{selectedOpp.id.toString().padStart(4, '0')}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        selectedOpp.type === 'Residencial' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        selectedOpp.type === 'Comercial' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    }`}>
                                        {selectedOpp.type}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">Projeto Solar {selectedOpp.type}</h1>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPinIcon className="w-5 h-5" />
                                    <span>{selectedOpp.city} - {selectedOpp.uf}</span>
                                    <span className="mx-2">•</span>
                                    <span>Publicado {selectedOpp.date}</span>
                                </div>
                             </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/70 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-slate-700/50 rounded-lg">
                                        <BoltIcon className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Dados de Consumo</h3>
                                </div>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                        <span className="text-gray-400">Valor da Conta:</span>
                                        <span className="font-bold text-white">{selectedOpp.billValue}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                        <span className="text-gray-400">Consumo Médio:</span>
                                        <span className="font-bold text-white">{selectedOpp.avgConsumption}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">Tensão:</span>
                                        <span className="font-bold text-white">Bifásico 220V</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card className="bg-slate-900/70 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-slate-700/50 rounded-lg">
                                        <SunIcon className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Potencial Técnico</h3>
                                </div>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                        <span className="text-gray-400">Tipo de Telhado:</span>
                                        <span className="font-bold text-white">{selectedOpp.roofType}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                                        <span className="text-gray-400">Sistema Estimado:</span>
                                        <span className="font-bold text-white">{selectedOpp.systemSize}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">Economia Estimada:</span>
                                        <span className="font-bold text-green-400">{selectedOpp.estimatedSavings}</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>

                        {/* Description */}
                        <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-3 text-white">Sobre o Projeto</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {selectedOpp.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / Action Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Card */}
                            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                                    <div className="p-3 bg-slate-700 rounded-full">
                                        <UserIcon className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Dados do Cliente</h3>
                                        <p className="text-xs text-gray-400">Acesso exclusivo</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 relative">
                                    {/* Locked Overlay */}
                                    {!unlocked && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4 rounded-lg border border-slate-700/50">
                                            <div className="bg-slate-800 p-3 rounded-full mb-3 shadow-lg">
                                                <CoinsIcon className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium">Use {selectedOpp.credits} créditos para visualizar</p>
                                        </div>
                                    )}

                                    {/* Content (Blurred if locked) */}
                                    <div className={!unlocked ? 'filter blur-sm select-none' : ''}>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Nome</p>
                                            <p className="text-white font-medium">{unlocked ? 'Roberto Almeida' : 'Roberto A******'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                                            <p className="text-white font-medium">{unlocked ? '(19) 99876-5432' : '(19) 9****-****'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                                            <p className="text-white font-medium">{unlocked ? 'roberto.almeida@email.com' : 'r******@email.com'}</p>
                                        </div>
                                    </div>
                                </div>

                                {!unlocked ? (
                                    <Button 
                                        variant="primary" 
                                        className="w-full py-4 text-base shadow-lg shadow-yellow-500/20"
                                        onClick={handleUnlockClick}
                                    >
                                        Desbloquear Contato
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="secondary" 
                                        className="w-full py-4 text-base flex items-center justify-center gap-2"
                                        onClick={() => window.location.href = `https://wa.me/5519998765432`}
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                        Chamar no WhatsApp
                                    </Button>
                                )}
                                
                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Ao desbloquear, você concorda com nossos termos de uso. Garantia de contato válido.
                                </p>
                            </div>
                            
                            {/* Summary Box */}
                            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Custo desta oportunidade:</span>
                                    <span className="text-yellow-400 font-bold">{selectedOpp.credits} Créditos</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Seu saldo atual:</span>
                                    <span className="text-white font-bold">0 Créditos</span>
                                </div>
                                <button onClick={handleBuyCredits} className="block w-full mt-3 text-center text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
                                    Comprar mais créditos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      );
  }

  // --- LIST/MAP VIEW (Default) ---
  return (
    <section className="min-h-screen pt-24 pb-20 bg-transparent text-white animate-fadeIn">
      <div className="container mx-auto px-6">
        
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <button 
                    onClick={onBack}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 transition-colors bg-slate-900/50 px-3 py-1 rounded-full"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Voltar para Home
                </button>
                <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">Oportunidades Disponíveis</h1>
                <p className="text-gray-300 mt-2 font-medium shadow-black drop-shadow-sm">Encontre o próximo projeto para sua empresa.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-1 border border-slate-700 flex justify-between items-center px-3">
                    <span className="text-xs text-gray-400 uppercase font-bold mr-2">Créditos:</span>
                    <span className="text-yellow-400 font-bold">0 disponíveis</span>
                </div>
                <Button variant="outline" className="px-4 py-2 text-sm bg-slate-900/50 hover:bg-slate-800" onClick={handleBuyCredits}>
                    Comprar Créditos
                </Button>
            </div>
        </div>

        {/* Filtros e Toggle */}
        <Card className="mb-10 !p-4 bg-slate-900/80 backdrop-blur-md border-slate-700 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="flex flex-wrap gap-2">
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
                        className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:w-40 p-2.5 outline-none"
                    >
                        <option value="Todos">Todos os Estados</option>
                        <option value="SP">São Paulo (SP)</option>
                        <option value="MG">Minas Gerais (MG)</option>
                        <option value="PR">Paraná (PR)</option>
                        <option value="MT">Mato Grosso (MT)</option>
                    </select>
                </div>

                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-600">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-slate-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-slate-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Mapa
                    </button>
                </div>
            </div>
            
            {/* Radius Slider - Visible for both views but emphasized for map */}
            <div className="border-t border-slate-700 pt-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="text-sm text-gray-400 flex items-center gap-2 min-w-fit">
                    <TargetIcon className="w-4 h-4 text-indigo-400" />
                    <span>Raio de Distância de <strong>{userLocation.city}</strong>:</span>
                </div>
                <div className="flex items-center gap-3 w-full max-w-md">
                     <span className="text-xs font-mono text-gray-500">0km</span>
                     <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        step="50"
                        value={maxDistance} 
                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                     />
                     <span className="text-xs font-mono text-white font-bold min-w-[60px]">{maxDistance === 2000 ? '2000+' : maxDistance}km</span>
                </div>
                <span className="text-xs text-gray-500 ml-auto hidden md:block">Filtrando {filteredData.length} resultados</span>
            </div>
        </Card>

        {viewMode === 'list' ? (
            /* Grid de Oportunidades (Lista) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {filteredData.map((opp) => (
                    <div 
                        key={opp.id} 
                        onClick={() => { setSelectedOpp(opp); window.scrollTo(0, 0); }}
                        className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-yellow-500/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 bg-slate-800 py-1.5 px-3 rounded-full border border-slate-700">
                                    {getIcon(opp.type)}
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">{opp.type}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{opp.date}</span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">{opp.city} - {opp.uf}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <BoltIcon className="w-5 h-5 text-gray-500" />
                                    <span>Conta: <span className="font-semibold text-white">{opp.billValue}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <HomeIcon className="w-5 h-5 text-gray-500" />
                                    <span>Telhado: {opp.roofType}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center group-hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                                <CoinsIcon className="w-4 h-4" />
                                <span>{opp.credits} Crédito{opp.credits > 1 ? 's' : ''}</span>
                            </div>
                            <span className="text-sm font-semibold text-yellow-400 group-hover:underline">
                                Ver detalhes →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            /* Visualização Mapa Interativo */
            <div 
                className="w-full h-[600px] bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 relative overflow-hidden animate-fadeIn"
                onClick={() => setActiveMarkerId(null)}
            >
                <div 
                    className="absolute inset-0 opacity-40 bg-no-repeat bg-center bg-contain"
                    style={{ 
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Brazil_Blank_Map.svg/2000px-Brazil_Blank_Map.svg.png')`,
                        filter: 'invert(1) opacity(0.5)'
                    }}
                ></div>
                
                {/* Map Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>

                {filteredData.map(opp => {
                    const coords = getStateCoordinates(opp.uf);
                    const isActive = activeMarkerId === opp.id;
                    const isHovered = hoveredMapItem === opp.id;
                    const showCard = isActive || isHovered;

                    return (
                        <div 
                            key={opp.id}
                            className="absolute"
                            style={{ top: coords.top, left: coords.left }}
                        >
                            <button
                                onClick={(e) => handleMarkerClick(e, opp.id)}
                                onMouseEnter={() => setHoveredMapItem(opp.id)}
                                onMouseLeave={() => setHoveredMapItem(null)}
                                className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform focus:outline-none"
                            >
                                <div className={`absolute w-full h-full rounded-full ${isActive ? '' : 'animate-ping'} opacity-75 ${
                                    opp.type === 'Residencial' ? 'bg-yellow-500' :
                                    opp.type === 'Comercial' ? 'bg-blue-500' : 'bg-purple-500'
                                }`}></div>
                                <div className={`relative w-4 h-4 rounded-full shadow-lg border-2 ${isActive ? 'border-white scale-110' : 'border-white'} ${
                                    opp.type === 'Residencial' ? 'bg-yellow-500' :
                                    opp.type === 'Comercial' ? 'bg-blue-500' : 'bg-purple-500'
                                }`}></div>
                            </button>

                            {/* Tooltip Card */}
                            {showCard && (
                                <div 
                                    onClick={(e) => {
                                        if (isActive) {
                                            e.stopPropagation();
                                            setSelectedOpp(opp);
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4 animate-fadeIn ${isActive ? 'z-50 cursor-pointer pointer-events-auto hover:bg-slate-800/90' : 'z-40 pointer-events-none'}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-slate-700 rounded-full">
                                            {getIcon(opp.type, "w-3 h-3")}
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase">{opp.type}</span>
                                        {isActive && <span className="ml-auto text-[10px] text-green-400 font-bold tracking-wider">SELECIONADO</span>}
                                    </div>
                                    <p className="text-white font-semibold text-sm mb-1">{opp.city} - {opp.uf}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>Conta: {opp.billValue}</span>
                                        <span className="text-yellow-400 font-bold">{opp.credits} Créditos</span>
                                    </div>
                                    {isActive && (
                                        <div className="mt-3 pt-2 border-t border-slate-700 text-center flex flex-col gap-2">
                                            <span className="text-xs text-yellow-400 font-bold underline decoration-yellow-400/30">
                                                Clique para ver detalhes
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(onNavigate) onNavigate('home', '#como-funciona');
                                                }}
                                                className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 px-3 rounded transition-colors mt-1 font-medium"
                                            >
                                                Saiba Mais
                                            </button>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-slate-800 border-r border-b border-slate-700 transform rotate-45"></div>
                                </div>
                            )}
                        </div>
                    )
                })}

                <div className="absolute bottom-6 right-6 bg-slate-900/90 p-4 rounded-lg border border-slate-700 text-xs text-gray-400 pointer-events-none">
                    <p className="font-bold text-white mb-2">Legenda:</p>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Residencial</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Comercial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>Usina / Grande Porte</span>
                    </div>
                </div>
            </div>
        )}
        
        {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-70 animate-fadeIn">
                <TargetIcon className="w-16 h-16 mb-4 text-gray-600" />
                <p className="text-xl font-medium">Nenhuma oportunidade encontrada com os filtros selecionados.</p>
                <p className="text-sm mt-2">Tente aumentar o raio de distância ou selecionar outro estado.</p>
            </div>
        )}

      </div>
    </section>
  );
};

export default Opportunities;
