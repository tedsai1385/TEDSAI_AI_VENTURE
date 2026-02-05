'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthServiceStateChange, logoutUser } from '@/lib/firebase/auth-service';
import { UserWhitelist } from '@/types/user';

interface AuthContextType {
    user: FirebaseUser | null;
    whitelist: UserWhitelist | null;
    loading: boolean; // Kept as 'loading' for compatibility with existing code
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    // Legacy methods placeholders if needed, but better to remove or map to new service in components
    // We will clean up components to use direct service calls for login
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [whitelist, setWhitelist] = useState<UserWhitelist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthServiceStateChange((firebaseUser, userWhitelist) => {
            setUser(firebaseUser);
            setWhitelist(userWhitelist);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setUser(null);
        setWhitelist(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                whitelist,
                loading,
                isAuthenticated: !!user && !!whitelist,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
