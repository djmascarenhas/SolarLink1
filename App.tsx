
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

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
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
          <Opportunities onBack={() => handleNavigate('home')} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
