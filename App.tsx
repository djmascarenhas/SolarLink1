
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

type ViewState = 'home' | 'opportunities';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const handleNavigate = (view: ViewState, hash?: string) => {
    setCurrentView(view);
    
    if (hash && view === 'home') {
        // Allow time for the home components to mount before scrolling
        setTimeout(() => {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-gray-200 font-sans selection:bg-yellow-500/30">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {currentView === 'home' ? (
          <>
            <Hero />
            <WhyChooseUs />
            <HowItWorks />
            <Features />
            <Pricing />
            <Faq />
            <CtaSection onNavigate={handleNavigate} />
          </>
        ) : (
          <Opportunities 
            onBack={() => handleNavigate('home')} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
