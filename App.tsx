
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Faq from './components/Faq';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-gray-200">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <HowItWorks />
        <Features />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
