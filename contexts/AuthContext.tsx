import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface UserSession {
    name: string;
    type: 'consumer' | 'business';
    id: string;
    details?: any;
}

interface AuthContextType {
    userSession: UserSession | null;
    loadingSession: boolean;
    setUserSession: (session: UserSession | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userSession, setUserSession] = useState<UserSession | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);

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
                } else {
                    // Consumer logic can be added here
                }
            }
            setLoadingSession(false);
        };

        restoreSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setUserSession(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUserSession(null);
    };

    return (
        <AuthContext.Provider value={{ userSession, loadingSession, setUserSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
