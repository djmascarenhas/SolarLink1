
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import SolkarlinkExperience from './components/consumer/SolkarlinkExperience';
import PortalHub from './components/PortalHub';
import UserStatusBar from './components/UserStatusBar';
import UserRegistration from './components/company/UserRegistration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SidebarMenu from './components/SidebarMenu';

const ScrollToAnchor = () => {
    const { hash } = useLocation();
    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [hash]);
    return null;
}

const Home = () => {
    const { userSession, setUserSession } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (view: string, param?: string) => {
        if (view === 'opportunities') navigate('/opportunities');
        else if (view === 'buy_credits') navigate('/buy_credits');
        else if (view === 'consumer') navigate('/consumer');
        else if (view === 'user_registration') navigate('/register');
        else if (param && param.startsWith('#')) {
             const element = document.getElementById(param.replace('#', ''));
             if (element) {
                 element.scrollIntoView({ behavior: 'smooth' });
             }
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="flex flex-col gap-10 lg:flex-row">
                <SidebarMenu />
                <div className="flex-1 space-y-16">
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
                </div>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { userSession, loadingSession, logout } = useAuth();
    const navigate = useNavigate();

    if (loadingSession) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando SolarLink...</div>;
    }

    const handleHeaderNavigate = (view: string, param?: string) => {
        if (view === 'portal') navigate('/');
        else if (view === 'home') navigate('/business');
        else if (view === 'opportunities') navigate('/opportunities');
        else if (view === 'buy_credits') navigate('/buy_credits');
        else if (view === 'consumer') navigate('/consumer');
        else if (view === 'solkarlink') navigate('/solkarlink');
        else if (view === 'user_registration') navigate('/register');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
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
                <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header onNavigate={handleHeaderNavigate} currentView={'home'} /> {/* currentView prop might need adjustment or removal in Header */}

                {userSession && (
                    <div className="relative z-50">
                        <UserStatusBar user={userSession} onLogout={handleLogout} />
                    </div>
                )}

                <main className="flex-grow">
                    <ScrollToAnchor />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PortalHub
                                    onNavigate={(view) => {
                                        if (view === 'consumer') navigate('/consumer');
                                        else if (view === 'solkarlink') navigate('/solkarlink');
                                        else navigate('/business');
                                    }}
                                />
                            }
                        />
                        <Route path="/business" element={<Home />} />
                        <Route path="/consumer" element={<ConsumerWrapper />} />
                        <Route path="/solkarlink" element={<SolkarlinkWrapper />} />
                        <Route path="/opportunities" element={<OpportunitiesWrapper />} />
                        <Route path="/buy_credits" element={<BuyCredits onBack={() => navigate('/business')} />} />
                        <Route path="/register" element={<UserRegistration userSession={userSession} onBack={() => navigate('/business')} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
};

// Wrappers to handle specific prop requirements if needed
const ConsumerWrapper = () => {
    const { userSession, setUserSession } = useAuth();
    return <ConsumerPortal userSession={userSession} setUserSession={setUserSession} />;
}

const SolkarlinkWrapper = () => {
    const { userSession, setUserSession } = useAuth();
    return <SolkarlinkExperience userSession={userSession} setUserSession={setUserSession} />;
}

const OpportunitiesWrapper = () => {
    const navigate = useNavigate();
    // Logic for filter from URL params could go here
    return <Opportunities onBack={() => navigate('/business')} onNavigate={(view, param) => {
         if (view === 'buy_credits') navigate('/buy_credits');
    }} initialFilter={undefined} />;
}


const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <AppContent />
        </Router>
    </AuthProvider>
  );
};

export default App;
