
import React, { useState, useEffect } from 'react';
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
import UserStatusBar from './components/UserStatusBar';
import UserRegistration from './components/company/UserRegistration';
import { supabase } from './lib/supabaseClient';

type ViewState = 'portal' | 'home' | 'opportunities' | 'buy_credits' | 'consumer' | 'user_registration';

export interface UserSession {
    name: string;
    type: 'consumer' | 'business';
    id: string;
    details?: any;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('portal');
  const [oppFilter, setOppFilter] = useState<string | undefined>(undefined);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Restore Session on Load
  useEffect(() => {
    const restoreSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            // Check if user is a business profile
            const { data: profile } = await supabase
                .from('profiles')
                .select(`
                    *,
                    companies (
                        id,
                        name,
                        credits
                    )
                `)
                .eq('id', session.user.id)
                .single();

            if (profile && profile.companies) {
                // It's a business user
                setUserSession({
                    name: profile.full_name || 'Usuário',
                    type: 'business',
                    id: session.user.id,
                    details: {
                        companyName: profile.companies.name,
                        credits: profile.companies.credits,
                        companyId: profile.companies.id,
                        role: profile.role
                    }
                });
                // If on portal, redirect to home dashboard
                setCurrentView('home');
            } else {
                // Could be a consumer if we implemented auth for them, 
                // but currently consumers are lead-based (cookie/localstorage usually)
                // For now, we just handle business auth persistence.
            }
        }
        setLoadingSession(false);
    };

    restoreSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            setUserSession(null);
            setCurrentView('portal');
        }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUserSession(null);
      setCurrentView('portal');
  };

  if (loadingSession) {
      return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando SolarLink...</div>;
  }

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
          
          {/* User Status Bar - Rendered explicitly here */}
          {userSession && currentView !== 'portal' && (
              <div className="relative z-50">
                   <UserStatusBar user={userSession} onLogout={handleLogout} />
              </div>
          )}

          <main className="flex-grow">
            {currentView === 'portal' && (
                <PortalHub onNavigate={handleNavigate} />
            )}

            {currentView === 'home' && (
              <>
                <Hero 
                    userSession={userSession} 
                    setUserSession={setUserSession} 
                    onNavigate={handleNavigate}
                />
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
               <ConsumerPortal 
                    userSession={userSession}
                    setUserSession={setUserSession}
               />
            )}

            {currentView === 'user_registration' && (
                <UserRegistration 
                    userSession={userSession}
                    onBack={() => handleNavigate('home')}
                />
            )}
          </main>
          {currentView !== 'portal' && <Footer />}
      </div>
    </div>
  );
};

export default App;
