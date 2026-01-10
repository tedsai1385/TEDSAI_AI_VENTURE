'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const { user, signInWithGoogle, logout } = useAuth();
    const router = useRouter();

    // Handle existing session
    useEffect(() => {
        if (user && !welcomeMessage) {
            // Check DB immediately if already logged in (persistence)
            checkUserInDb(user);
        }
    }, [user]);

    const checkUserInDb = async (firebaseUser: any) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const name = userData.displayName || firebaseUser.email;
                setWelcomeMessage(`Bienvenue, ${name} !`);

                // Delay redirect slightly to show welcome message
                setTimeout(() => {
                    router.push('/admin');
                }, 1500);
            } else {
                setError("Désolé, vous n'avez pas accès au tableau de bord. (Identifiant non reconnu dans la base)");
                await auth.signOut();
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de vérification du compte.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Authenticate with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;

            // 2. Check Database Presence
            await checkUserInDb(loggedInUser);

        } catch (err: any) {
            console.error('Login Error:', err);
            // Translate common Firebase errors
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Trop de tentatives. Veuillez réessayer plus tard.");
            } else {
                setError(`Erreur de connexion : ${err.message}`);
            }
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await signInWithGoogle();
            // The useEffect will catch the user update and trigger checkUserInDb
        } catch (err: any) {
            setError("Erreur Google : " + err.message);
        }
    };

    if (welcomeMessage) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.glassCard} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div className="animate-bounce" style={{ fontSize: '4rem', color: '#4ade80', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h1 className={styles.title} style={{ color: 'white' }}>{welcomeMessage}</h1>
                    <p className={styles.subtitle}>Redirection en cours...</p>
                    <div className="loader" style={{ margin: '2rem auto' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginPage}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className={styles.glassCard}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className={styles.iconWrapper}>
                        <div className={styles.iconGlow}></div>
                        <i className={`fa-solid fa-cube ${styles.icon}`}></i>
                    </div>
                    <h1 className={styles.title}>TEDSAI Admin</h1>
                    <p className={styles.subtitle}>Portail de gestion unifié pour l'écosystème.</p>
                </div>

                {error && (
                    <div className={`${styles.errorAlert} fade-in`}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <div style={{ marginLeft: '12px' }}>
                            <strong>Accès Refusé</strong>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="votre@email.com"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                                Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <span style={{ padding: '0 10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>OU</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className={styles.googleBtn}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
                        Continuer avec Google
                    </button>
                </form>
            </div>
        </div>
    );
}
