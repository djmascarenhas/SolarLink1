import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../lib/api';
import { httpClient } from '../lib/httpClient';

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
            try {
                const session = await authApi.getSession();
                if (session?.id) {
                    setUserSession(session);
                }
            } catch (error) {
                console.warn('Nenhuma sessão restaurada', error);
            } finally {
                setLoadingSession(false);
            }
        };

        const unsubscribeUnauthorized = httpClient.onUnauthorized(() => {
            setUserSession(null);
        });

        restoreSession();

        return () => {
            unsubscribeUnauthorized();
        };
    }, []);

    const logout = async () => {
        await authApi.logout();
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
