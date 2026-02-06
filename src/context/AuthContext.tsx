'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Role } from '@/lib/dashboard/roles';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: Role | 'user';
    createdAt: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContext provides a central place to manage user authentication and profile synchronization.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setUser(firebaseUser);

                if (firebaseUser) {
                    // Real-time sync with Firestore profile
                    const profileRef = doc(db, 'users', firebaseUser.uid);
                    unsubscribeProfile = onSnapshot(profileRef, (doc) => {
                        if (doc.exists()) {
                            setProfile(doc.data() as UserProfile);
                        } else {
                            setProfile(null);
                        }
                        setLoading(false);
                    }, (error) => {
                        console.error('Profile snapshot error:', error);
                        setProfile(null);
                        setLoading(false);
                    });
                } else {
                    if (unsubscribeProfile) unsubscribeProfile();
                    setProfile(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        }
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error('Error signing in with Google', error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            console.error('Error signing in with Email', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error('Error signing out', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithEmail, logout }}>
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
