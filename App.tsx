
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import Opportunities from './components/Opportunities';
import BuyCredits from './components/BuyCredits';
import ConsumerPortal from './components/consumer/ConsumerPortal';
import PortalHub from './components/PortalHub';

type ViewState = 'portal' | 'home' | 'opportunities' | 'buy_credits' | 'consumer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('portal');
  const [oppFilter, setOppFilter] = useState<string | undefined>(undefined);

  const handleNavigate = (view: ViewState, param?: string) => {
    setCurrentView(view);
    
    // Check if param is a filter for opportunities
    if (view === 'opportunities' && param) {
        setOppFilter(param);
    } else {
        setOppFilter(undefined);
    }

    if (param && view === 'home' && param.startsWith('#')) {
        // Allow time for the home components to mount before scrolling
        setTimeout(() => {
            const element = document.getElementById(param.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 font-sans selection:bg-yellow-500/30">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop" 
            alt="Solar Plant Background" 
            className="w-full h-full object-cover"
         />
         {/* Global Dark Overlay for Readability */}
         <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
          <Header onNavigate={handleNavigate} currentView={currentView} />
          <main className="flex-grow">
            {currentView === 'portal' && (
                <PortalHub onNavigate={handleNavigate} />
            )}

            {currentView === 'home' && (
              <>
                <Hero />
                <WhyChooseUs />
                <HowItWorks />
                <Features />
                <Pricing onNavigate={handleNavigate} />
                <Faq />
                <CtaSection onNavigate={handleNavigate} />
              </>
            )}
            
            {currentView === 'opportunities' && (
              <Opportunities 
                onBack={() => handleNavigate('home')} 
                onNavigate={handleNavigate}
                initialFilter={oppFilter}
              />
            )}

            {currentView === 'buy_credits' && (
              <BuyCredits onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'consumer' && (
               <ConsumerPortal />
            )}
          </main>
          {currentView !== 'portal' && <Footer />}
      </div>
    </div>
  );
};

export default App;
