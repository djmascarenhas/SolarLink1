
import React, { useState, useEffect } from 'react';
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
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import OpportunityDetail from './OpportunityDetail';
import { SolarLinkService } from '../lib/solarLinkService'; // Service

// Lista de Estados (Mantida)
const brazilianStates = [
    { value: 'AC', label: 'Acre (AC)' },
    { value: 'SP', label: 'São Paulo (SP)' },
    // ... (restante dos estados podem ser mantidos ou simplificados)
    { value: 'MG', label: 'Minas Gerais (MG)' },
    { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
    { value: 'RS', label: 'Rio Grande do Sul (RS)' }
];

interface OpportunitiesProps {
    onBack: () => void;
    onNavigate?: (view: 'home', hash?: string) => void;
    initialFilter?: string;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ onBack, onNavigate, initialFilter }) => {
  const [filterType, setFilterType] = useState('Todos');
  const [filterState, setFilterState] = useState('Todos');
  const [maxDistance, setMaxDistance] = useState<number>(2000);
  const [sortOption, setSortOption] = useState<'default' | 'distance'>('default');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // State for Real Data
  const [opportunitiesData, setOpportunitiesData] = useState<any[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  
  const [hoveredMapItem, setHoveredMapItem] = useState<number | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  
  const [userLocation, setUserLocation] = useState({ lat: -23.5505, lng: -46.6333, city: 'São Paulo', isReal: false });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilter) setFilterType(initialFilter);
    fetchLeads();
  }, [initialFilter]);

  // Função para buscar leads reais
  const fetchLeads = async () => {
      setIsLoading(true);
      try {
          const leads = await SolarLinkService.getOpportunities();
          
          if (leads && leads.length > 0) {
              // Mapeia os dados do BD para o formato da UI
              const mappedLeads = leads.map((lead: any) => ({
                  id: lead.id,
                  type: 'Residencial', // Default, já que não temos isso no BD leads simples
                  city: lead.city,
                  uf: lead.uf,
                  lat: -23.55 + (Math.random() - 0.5), // Mock coords se não tiver
                  lng: -46.63 + (Math.random() - 0.5), 
                  billValue: 'A consultar', // Dados que viriam do Chat
                  avgConsumption: 'Calculando...', 
                  roofType: 'Não informado',
                  date: new Date(lead.created_at).toLocaleDateString(),
                  credits: 1,
                  description: `Lead captado em ${lead.city}. Interaja para ver detalhes técnicos.`,
                  systemSize: 'N/A',
                  estimatedSavings: 'N/A',
                  // Dados reais para contato
                  rawName: lead.name,
                  rawPhone: lead.whatsapp
              }));
              setOpportunitiesData(mappedLeads);
          } else {
              // Se vazio, mantém mock para demo ou array vazio
              setOpportunitiesData([]); 
          }
      } catch (err) {
          console.error("Erro ao buscar leads", err);
      } finally {
          setIsLoading(false);
      }
  };

  const getUserLocation = () => {
    setLocationError(null);
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
          setSortOption('distance');
        },
        (error) => {
            setLocationLoading(false);
            setLocationError("Erro ao obter localização.");
            setTimeout(() => setLocationError(null), 5000);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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
        if (sortOption === 'distance') return a.distanceFromUser - b.distanceFromUser;
        return 0;
    });

  const getIcon = (type: string, className = "w-5 h-5") => {
    return <HomeIcon className={`${className} text-yellow-400`} />;
  };

  const handleBuyCredits = () => { if (onNavigate) onNavigate('home', '#comprar'); };

  const handleUnlockContact = (cost: number) => {
      // Aqui integrariamos com o service.unlockLead
      if (userBalance >= cost) {
          setUserBalance(prev => prev - cost);
          return true;
      }
      return false;
  };

  const getMapPosition = (lat: number, lng: number) => {
      const minLat = -33.8; const maxLat = 5.3;
      const minLng = -74.0; const maxLng = -34.8;
      const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
      const left = ((lng - minLng) / (maxLng - minLng)) * 100;
      return { top: `${top}%`, left: `${left}%` };
  };

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

  return (
    <section className="min-h-screen pt-24 pb-20 bg-transparent text-white animate-fadeIn">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2 bg-slate-900/50 px-3 py-1 rounded-full">
                    <ArrowLeftIcon className="w-4 h-4" /> Voltar
                </button>
                <h1 className="text-3xl md:text-4xl font-bold">Oportunidades Reais</h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-slate-900/80 rounded-lg p-1 border border-slate-700 px-3">
                    <span className="text-yellow-400 font-bold text-lg">{userBalance}</span>
                    <span className="text-xs text-gray-500 uppercase ml-1">créditos</span>
                </div>
                <Button variant="outline" onClick={handleBuyCredits}>Comprar</Button>
            </div>
        </div>

        {/* Filters */}
        <Card className="mb-10 !p-4 bg-slate-900/80 backdrop-blur-md border-slate-700 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                 <div className="flex gap-2">
                     <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded ${viewMode === 'list' ? 'bg-slate-600' : ''}`}>Lista</button>
                     <button onClick={() => setViewMode('map')} className={`px-4 py-1.5 rounded ${viewMode === 'map' ? 'bg-slate-600' : ''}`}>Mapa</button>
                 </div>
                 <button onClick={getUserLocation} className="text-xs border px-3 py-1 rounded bg-slate-800 border-slate-600">
                    {locationLoading ? '...' : 'Minha Localização'}
                 </button>
            </div>
        </Card>

        {isLoading ? (
            <div className="text-center py-20 text-gray-400">Carregando oportunidades do banco de dados...</div>
        ) : filteredData.length === 0 ? (
             <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
                 <p className="text-gray-400">Nenhuma oportunidade encontrada. Aguarde novos leads!</p>
             </div>
        ) : viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {filteredData.map((opp) => (
                    <div 
                        key={opp.id} 
                        onClick={() => { setSelectedOpp(opp); window.scrollTo(0, 0); }}
                        className="group relative bg-slate-900/70 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-yellow-500"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold uppercase bg-slate-800 px-2 py-1 rounded text-gray-300">{opp.type}</span>
                            <span className="text-xs text-gray-400">{opp.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-gray-200">
                             <MapPinIcon className="w-5 h-5 text-gray-500" />
                             <span>{opp.city} - {opp.uf}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                             <div className="flex items-center gap-1 text-yellow-400 font-bold">
                                 <CoinsIcon className="w-4 h-4" /> {opp.credits} Créditos
                             </div>
                             <span className="text-sm font-semibold text-yellow-400">Ver detalhes →</span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="w-full h-[600px] bg-slate-900/80 rounded-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-50" style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Brazil_Blank_Map.svg/2000px-Brazil_Blank_Map.svg.png')`, filter: 'invert(1) opacity(0.5)' }}></div>
                {filteredData.map(opp => {
                    const coords = getMapPosition(opp.lat, opp.lng);
                    return (
                        <div key={opp.id} className="absolute w-4 h-4 bg-yellow-500 rounded-full border-2 border-slate-900 hover:scale-150 cursor-pointer" style={{ top: coords.top, left: coords.left }} onClick={() => setSelectedOpp(opp)}></div>
                    );
                })}
            </div>
        )}
      </div>
    </section>
  );
};

export default Opportunities;
