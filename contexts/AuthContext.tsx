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
    supabaseSession: Session | null;
    loadingSession: boolean;
    setUserSession: (session: UserSession | null) => void;
    getAuthHeaders: () => Record<string, string>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'solarlink:user_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userSession, setUserSession] = useState<UserSession | null>(null);
    const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);

    const persistUserSession = (session: UserSession | null) => {
        if (session) {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
    };

    const loadCachedSession = () => {
        const cached = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!cached) return null;
        try {
            return JSON.parse(cached) as UserSession;
        } catch (e) {
            console.warn('Erro ao restaurar sessão cacheada', e);
            return null;
        }
    };

    useEffect(() => {
        const mapSessionToProfile = async (session: Session | null) => {
            if (!session?.user) {
                setUserSession(loadCachedSession());
                setSupabaseSession(null);
                return;
            }

            setSupabaseSession(session);

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
                const derivedSession: UserSession = {
                    name: profile.full_name || 'Usuário',
                    type: 'business',
                    id: session.user.id,
                    details: {
                        companyName: profile.companies.name,
                        credits: profile.companies.credits,
                        companyId: profile.companies.id,
                        role: profile.role
                    }
                };
                setUserSession(derivedSession);
                persistUserSession(derivedSession);
            } else {
                setUserSession(loadCachedSession());
            }
        };

        const restoreSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await mapSessionToProfile(session);
            setLoadingSession(false);
        };

        restoreSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            mapSessionToProfile(session);
            if (!session) {
                setUserSession(null);
                persistUserSession(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        persistUserSession(userSession);
    }, [userSession]);

    const getAuthHeaders = () => {
        if (supabaseSession?.access_token) {
            return { Authorization: `Bearer ${supabaseSession.access_token}` };
        }
        return {};
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUserSession(null);
        setSupabaseSession(null);
        persistUserSession(null);
    };

    return (
        <AuthContext.Provider value={{ userSession, supabaseSession, loadingSession, setUserSession, getAuthHeaders, logout }}>
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
