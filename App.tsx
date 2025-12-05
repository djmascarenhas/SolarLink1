import React from 'react';

interface LocationCard {
  id: string;
  title: string;
  description: string;
  image: string;
  position: string;
}

const locations: LocationCard[] = [
  {
    id: 'vila-casca',
    title: 'Vila do Casca 3',
    description: 'Comunidade local que cresceu ao redor da usina e mantém o cotidiano ribeirinho.',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&q=80',
    position: 'top-[5%] left-[4%]'
  },
  {
    id: 'ruinas-historicas',
    title: 'Ruínas Históricas (Chalé dos Governadores)',
    description: 'Remanescentes de uma das construções mais simbólicas da região.',
    image: 'https://images.unsplash.com/photo-1465311530779-5241f5a29892?auto=format&fit=crop&w=600&q=80',
    position: 'top-[7%] right-[6%]'
  },
  {
    id: 'infraestrutura-eletrica',
    title: 'Infraestrutura Elétrica – Casca 3',
    description: 'Rede de transmissão que sustenta a operação da usina.',
    image: 'https://images.unsplash.com/photo-1521165942284-68bbe828ecd1?auto=format&fit=crop&w=600&q=80',
    position: 'top-[32%] left-[9%]'
  },
  {
    id: 'chale-governadores',
    title: 'Chalé dos Governadores',
    description: 'Memória arquitetônica visitada pelo grupo, marcando o meio do trajeto.',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
    position: 'top-[37%] left-[43%]'
  },
  {
    id: 'fecho-morro',
    title: 'Fecho do Morro',
    description: 'Referência geográfica que orienta a navegação pelo rio.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    position: 'top-[32%] right-[10%]'
  },
  {
    id: 'usina',
    title: 'Barragem / Usina Casca 3',
    description: 'Ponto de partida para a jornada de visitação técnica.',
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=600&q=80',
    position: 'top-[63%] left-[38%]'
  },
  {
    id: 'cachoeira',
    title: 'Cachoeira Pedra Furada',
    description: 'Queda d’água que encerra a visita com almoço e roda de conversa.',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
    position: 'bottom-[7%] left-[5%]'
  },
  {
    id: 'poco',
    title: 'Poço do Pacu',
    description: 'Espaço de interesse para futuras paradas interpretativas.',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
    position: 'bottom-[7%] left-[40%]'
  },
  {
    id: 'brejao',
    title: 'Brejão – Área Úmida',
    description: 'Áreas alagadas que sustentam a biodiversidade local.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    position: 'bottom-[10%] right-[4%]'
  }
];

const legendItems = [
  'Barragem / Usina Casca 3 – ponto de partida da jornada.',
  'Chalé dos Governadores – memória histórica e arquitetura.',
  'Vila do Casca 3 – cotidiano e modos de viver locais.',
  'Brejão – paisagem natural e biodiversidade.',
  'Fecho do Morro – referência geográfica e simbólica.',
  'Cachoeira Pedra Furada – parada final com almoço e roda de conversa.',
  'Poço do Pacu – ponto de interesse futuro.'
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8efd5] text-[#3d2a15]">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        <header className="text-center space-y-3">
          <p className="text-sm font-semibold tracking-[0.28em] uppercase text-[#8b5e3c]">🗺️ Mapa Ilustrado do Roteiro – Visita da UFMT ao Rio da Casca</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#2f1f0f]">Roteiro Turístico: Explorando a Natureza e a Engenharia Local</h1>
          <p className="text-base max-w-3xl mx-auto text-[#5f3b1f]">
            Mapa em estilo de papel antigo para facilitar a edição no Canva. Os títulos já estão atribuídos a cada cena,
            preservando o ar de aventura pedagógica com bússola e setas pontilhadas.
          </p>
        </header>

        <section className="relative w-full overflow-hidden rounded-[32px] border-4 border-[#c4a574] bg-[#f9f1d6] shadow-[0_20px_60px_rgba(61,42,21,0.2)]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=60')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9f1d6]/90 via-[#f9f1d6]/80 to-[#f6e7c7]/92" />

          {/* Decorative compass */}
          <div className="absolute right-4 bottom-4 w-28 h-28 text-[#8b5e3c]">
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
              <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 8" />
              <polygon points="60,10 70,60 60,110 50,60" fill="none" stroke="currentColor" strokeWidth="3" />
              <text x="58" y="22" fontSize="12" fontWeight="700" fill="currentColor">N</text>
              <text x="92" y="64" fontSize="12" fontWeight="700" fill="currentColor">L</text>
              <text x="58" y="104" fontSize="12" fontWeight="700" fill="currentColor">S</text>
              <text x="24" y="64" fontSize="12" fontWeight="700" fill="currentColor">O</text>
            </svg>
          </div>

          {/* Dotted route */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
            <path
              d="M16 80 C 120 40, 220 40, 300 90 C 410 150, 520 140, 620 110"
              fill="none"
              stroke="#8b5e3c"
              strokeWidth="3"
              strokeDasharray="6 10"
            />
            <path
              d="M140 170 C 230 210, 360 210, 470 180"
              fill="none"
              stroke="#8b5e3c"
              strokeWidth="3"
              strokeDasharray="6 10"
            />
          </svg>

          {/* Location cards */}
          <div className="relative min-h-[800px]">
            {locations.map((location) => (
              <figure
                key={location.id}
                className={`absolute ${location.position} w-[180px] md:w-[200px] bg-[#fdf6e3] border-2 border-[#c4a574] shadow-[0_10px_30px_rgba(61,42,21,0.18)] rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
              >
                <img src={location.image} alt={location.title} className="h-32 w-full object-cover" />
                <figcaption className="p-3 text-center">
                  <p className="text-sm font-semibold text-[#2f1f0f]">{location.title}</p>
                  <p className="text-xs mt-1 text-[#5f3b1f] leading-relaxed">{location.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="bg-[#fffaf0] border border-[#e3cfa3] rounded-2xl px-6 py-6 shadow-[0_12px_30px_rgba(61,42,21,0.12)]">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">📌</span>
            <div>
              <p className="text-lg font-bold text-[#2f1f0f]">Legenda do percurso sugerido</p>
              <p className="text-sm text-[#5f3b1f]">Ordem pensada para orientar a edição rápida no Canva:</p>
            </div>
          </div>
          <ol className="space-y-2 list-decimal list-inside text-[#3d2a15]">
            {legendItems.map((item, index) => (
              <li key={index} className="text-sm leading-relaxed">{item}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default App;
