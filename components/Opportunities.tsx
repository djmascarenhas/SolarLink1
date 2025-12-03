
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
import { TargetIcon } from './icons/TargetIcon';
import OpportunityDetail from './OpportunityDetail';

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
  {
    id: 7,
    type: 'Usina',
    city: 'Petrolina',
    uf: 'PE',
    lat: -9.39416,
    lng: -40.5096,
    billValue: 'R$ 8.500,00',
    avgConsumption: '10.000 kWh',
    roofType: 'Solo',
    date: '5 horas atrás',
    credits: 5,
    description: 'Projeto de irrigação. Alta irradiação solar. Cliente busca financiamento.',
    systemSize: '45 kWp',
    estimatedSavings: 'R$ 100.000 / ano'
  },
  {
    id: 8,
    type: 'Residencial',
    city: 'Porto Alegre',
    uf: 'RS',
    lat: -30.0346,
    lng: -51.2177,
    billValue: 'R$ 900,00',
    avgConsumption: '950 kWh',
    roofType: 'Telha de Concreto',
    date: '1 dia atrás',
    credits: 1,
    description: 'Casa antiga, telhado necessita reforço. Cliente ciente.',
    systemSize: '8.0 kWp',
    estimatedSavings: 'R$ 10.500 / ano'
  },
  {
    id: 9,
    type: 'Comercial',
    city: 'Manaus',
    uf: 'AM',
    lat: -3.1190,
    lng: -60.0217,
    billValue: 'R$ 5.400,00',
    avgConsumption: '6.000 kWh',
    roofType: 'Metálico',
    date: 'Hoje',
    credits: 3,
    description: 'Galpão logístico. Área de telhado muito grande disponível.',
    systemSize: '60 kWp',
    estimatedSavings: 'R$ 70.000 / ano'
  }
];

const brazilianStates = [
    { value: 'AC', label: 'Acre (AC)' },
    { value: 'AL', label: 'Alagoas (AL)' },
    { value: 'AP', label: 'Amapá (AP)' },
    { value: 'AM', label: 'Amazonas (AM)' },
    { value: 'BA', label: 'Bahia (BA)' },
    { value: 'CE', label: 'Ceará (CE)' },
    { value: 'DF', label: 'Distrito Federal (DF)' },
    { value: 'ES', label: 'Espírito Santo (ES)' },
    { value: 'GO', label: 'Goiás (GO)' },
    { value: 'MA', label: 'Maranhão (MA)' },
    { value: 'MT', label: 'Mato Grosso (MT)' },
    { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
    { value: 'MG', label: 'Minas Gerais (MG)' },
    { value: 'PA', label: 'Pará (PA)' },
    { value: 'PB', label: 'Paraíba (PB)' },
    { value: 'PR', label: 'Paraná (PR)' },
    { value: 'PE', label: 'Pernambuco (PE)' },
    { value: 'PI', label: 'Piauí (PI)' },
    { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
    { value: 'RN', label: 'Rio Grande do Norte (RN)' },
    { value: 'RS', label: 'Rio Grande do Sul (RS)' },
    { value: 'RO', label: 'Rondônia (RO)' },
    { value: 'RR', label: 'Roraima (RR)' },
    { value: 'SC', label: 'Santa Catarina (SC)' },
    { value: 'SP', label: 'São Paulo (SP)' },
    { value: 'SE', label: 'Sergipe (SE)' },
    { value: 'TO', label: 'Tocantins (TO)' },
];

interface OpportunitiesProps {
    onBack: () => void;
    onNavigate?: (view: 'home', hash?: string) => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ onBack, onNavigate }) => {
  const [filterType, setFilterType] = useState('Todos');
  const [filterState, setFilterState] = useState('Todos');
  const [maxDistance, setMaxDistance] = useState<number>(2000); // Slider value in km
  const [sortOption, setSortOption] = useState<'default' | 'distance'>('default');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedOpp, setSelectedOpp] = useState<typeof opportunitiesData[0] | null>(null);
  const [hoveredMapItem, setHoveredMapItem] = useState<number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState(50); // Mock user balance
  const [isLoading, setIsLoading] = useState(false);
  
  // User Location State
  const [userLocation, setUserLocation] = useState({ lat: -23.5505, lng: -46.6333, city: 'São Paulo', isReal: false });
  const [locationLoading, setLocationLoading] = useState(false);

  // Simulate loading when filters change
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filterType, filterState, maxDistance, sortOption, userLocation]);

  // Geolocation Handler
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'Minha Localização',
            isReal: true
          });
          setLocationLoading(false);
          setSortOption('distance'); // Auto-sort by distance
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationLoading(false);
          alert("Não foi possível obter sua localização. Verifique se você permitiu o acesso no navegador.");
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
    }
  };

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

  // Calculate coordinates on the Brazil map image for filtering logic
  const getMapPosition = (lat: number, lng: number) => {
      // Brazil Bounds approximation for the SVG map image
      // These values are tuned to fit the standard projection of the Brazil Blank Map
      const minLat = -33.8; // South
      const maxLat = 5.3;   // North
      const minLng = -74.0; // West
      const maxLng = -34.8; // East

      // Simple linear interpolation (Equirectangular approximation)
      // Note: CSS Top is 0 at the top (North), so we invert the lat logic
      const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
      const left = ((lng - minLng) / (maxLng - minLng)) * 100;
      
      return { top: `${top}%`, left: `${left}%` };
  };

  // Process data: Map -> Filter -> Sort
  const filteredData = opportunitiesData
    .map(item => ({
        ...item,
        distanceFromUser: calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
    }))
    .filter(item => {
        const typeMatch = filterType === 'Todos' || item.type === filterType;
        const stateMatch = filterState === 'Todos' || item.uf === filterState;
        const distanceMatch = item.distanceFromUser <= maxDistance;
        return typeMatch && stateMatch && distanceMatch;
    })
    .sort((a, b) => {
        if (sortOption === 'distance') {
            return a.distanceFromUser - b.distanceFromUser;
        }
        return 0; // Default (Mock data id/date order)
    });

  const getIcon = (type: string, className = "w-5 h-5") => {
    switch (type) {
      case 'Residencial': return <HomeIcon className={`${className} text-yellow-400`} />;
      case 'Comercial': return <BuildingIcon className={`${className} text-blue-400`} />;
      case 'Usina': return <FactoryIcon className={`${className} text-purple-400`} />;
      default: return <HomeIcon className={`${className} text-gray-400`} />;
    }
  };

  const handleBuyCredits = () => {
      if (onNavigate) {
          onNavigate('home', '#comprar');
      }
  };

  const handleUnlockContact = (cost: number) => {
      if (userBalance >= cost) {
          setUserBalance(prev => prev - cost);
          return true;
      }
      return false;
  };

  const handleMarkerClick = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setActiveMarkerId(prevId => prevId === id ? null : id);
  }

  // --- DETAIL VIEW ---
  if (selectedOpp) {
      return (
          <OpportunityDetail
              opportunity={selectedOpp}
              userBalance={userBalance}
              onBack={() => setSelectedOpp(null)}
              onBuyCredits={handleBuyCredits}
              onUnlock={handleUnlockContact}
          />
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
                {/* Credit Balance Indicator */}
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-1 border border-slate-700 flex justify-between items-center px-3 min-w-[180px] shadow-lg">
                    <span className="text-xs text-gray-400 uppercase font-bold mr-2">Seu Saldo:</span>
                    <span className="text-yellow-400 font-bold text-lg">{userBalance}</span>
                    <span className="text-[10px] text-gray-500 ml-1 uppercase">créditos</span>
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
                    
                    {/* UF Filter with All States */}
                    <select 
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:w-48 p-2.5 outline-none"
                    >
                        <option value="Todos">Todos os Estados</option>
                        {brazilianStates.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>

                    <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as 'default' | 'distance')}
                        className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:w-44 p-2.5 outline-none"
                    >
                        <option value="default">Mais Recentes</option>
                        <option value="distance">Menor Distância</option>
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

                {/* Geolocation Button */}
                <button 
                    onClick={getUserLocation}
                    disabled={locationLoading}
                    className={`text-xs border px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
                        userLocation.isReal 
                        ? 'bg-green-500/10 border-green-500 text-green-400'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-yellow-500'
                    }`}
                >
                    {locationLoading ? (
                        <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <MapPinIcon className="w-3 h-3" />
                    )}
                    {locationLoading ? 'Buscando...' : userLocation.isReal ? 'Localização Ativa' : 'Usar minha localização'}
                </button>

                <div className="flex items-center gap-3 w-full max-w-md">
                     <span className="text-xs font-mono text-gray-500">0km</span>
                     <input 
                        type="range" 
                        min="50" 
                        max="2000" 
                        step="50"
                        value={maxDistance} 
                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                     />
                     <span className="text-xs font-mono text-white font-bold min-w-[60px]">{maxDistance >= 2000 ? 'Brasil' : `${maxDistance}km`}</span>
                </div>
                <span className="text-xs text-gray-500 ml-auto hidden md:block">Filtrando {filteredData.length} resultados</span>
            </div>
        </Card>

        {isLoading ? (
            /* Skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                     <div key={i} className="bg-slate-900/40 border border-slate-700 rounded-xl p-6 h-[250px] animate-pulse">
                         <div className="h-6 w-24 bg-slate-800 rounded mb-4"></div>
                         <div className="h-4 w-40 bg-slate-800 rounded mb-6"></div>
                         <div className="space-y-3">
                             <div className="h-4 w-full bg-slate-800 rounded"></div>
                             <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                             <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
                         </div>
                     </div>
                ))}
            </div>
        ) : viewMode === 'list' ? (
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
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-slate-800/50 p-2 rounded flex flex-col justify-center">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <BoltIcon className="w-3.5 h-3.5 text-yellow-500" />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Consumo</span>
                                        </div>
                                        <span className="text-sm font-bold text-white leading-tight">{opp.avgConsumption}</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded flex flex-col justify-center">
                                        <div className="flex items-center gap-1.5 mb-1">
                                             <div className="text-green-400 font-bold text-xs">$</div>
                                             <span className="text-[10px] text-gray-400 uppercase font-bold">Conta</span>
                                        </div>
                                        <span className="text-sm font-bold text-white leading-tight">{opp.billValue}</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded flex flex-col justify-center">
                                         <div className="flex items-center gap-1.5 mb-1">
                                             <HomeIcon className="w-3.5 h-3.5 text-gray-400" />
                                             <span className="text-[10px] text-gray-400 uppercase font-bold">Telhado</span>
                                        </div>
                                        <span className="text-sm font-bold text-white leading-tight truncate">{opp.roofType}</span>
                                    </div>
                                    {sortOption === 'distance' && (
                                        <div className="bg-slate-800/50 p-2 rounded flex flex-col justify-center">
                                             <div className="flex items-center gap-1.5 mb-1">
                                                 <TargetIcon className="w-3.5 h-3.5 text-indigo-400" />
                                                 <span className="text-[10px] text-gray-400 uppercase font-bold">Distância</span>
                                            </div>
                                            <span className="text-sm font-bold text-white leading-tight">{Math.round(opp.distanceFromUser)} km</span>
                                        </div>
                                    )}
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
                {isLoading && (
                    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                             <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-white font-medium text-sm">Atualizando mapa...</span>
                        </div>
                    </div>
                )}
                
                <div 
                    className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-50"
                    style={{ 
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Brazil_Blank_Map.svg/2000px-Brazil_Blank_Map.svg.png')`,
                        filter: 'invert(1) opacity(0.5)'
                    }}
                ></div>
                
                {/* Map Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>

                {/* Show User Location on Map if Active */}
                {userLocation.isReal && (
                    <div 
                        className="absolute z-10"
                        style={getMapPosition(userLocation.lat, userLocation.lng)}
                    >
                         <div className="relative flex items-center justify-center w-12 h-12 -translate-x-1/2 -translate-y-1/2">
                             <div className="absolute w-full h-full border-2 border-indigo-500 rounded-full animate-ping opacity-50"></div>
                             <div className="relative w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg"></div>
                             {/* Optional: Show Radius visually? (Tricky on non-projected maps, but we can simulate a larger pulse) */}
                         </div>
                    </div>
                )}

                {filteredData.map(opp => {
                    const coords = getMapPosition(opp.lat, opp.lng);
                    const isActive = activeMarkerId === opp.id;
                    const isHovered = hoveredMapItem === opp.id;
                    const showCard = isActive || isHovered;

                    return (
                        <div 
                            key={opp.id}
                            className="absolute transition-all duration-500"
                            style={{ top: coords.top, left: coords.left }}
                        >
                            <button
                                onClick={(e) => handleMarkerClick(e, opp.id)}
                                onMouseEnter={() => setHoveredMapItem(opp.id)}
                                onMouseLeave={() => setHoveredMapItem(null)}
                                className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform focus:outline-none group"
                            >
                                <div className={`absolute w-full h-full rounded-full ${isActive ? '' : 'animate-ping'} opacity-75 ${
                                    opp.type === 'Residencial' ? 'bg-yellow-500' :
                                    opp.type === 'Comercial' ? 'bg-blue-500' : 'bg-purple-500'
                                }`}></div>
                                <div className={`relative w-4 h-4 rounded-full shadow-lg border-2 transition-all ${isActive ? 'border-white scale-125' : 'border-white group-hover:scale-110'} ${
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

                <div className="absolute bottom-6 right-6 bg-slate-900/90 p-4 rounded-lg border border-slate-700 text-xs text-gray-400 pointer-events-none z-10">
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
        
        {!isLoading && filteredData.length === 0 && (
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
