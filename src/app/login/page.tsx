'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase/config';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Direct use for granular error handling
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(''); // Info (e.g. "Creating account...")
    const [welcomeMessage, setWelcomeMessage] = useState(''); // Success (e.g. "Welcome!")

    // We use low-level auth here for precise control, but we sync with context
    const { user, signInWithGoogle, logout } = useAuth();
    const router = useRouter();

    // 1. Force cleanup on mount to ensure clean state
    useEffect(() => {
        if (user && !welcomeMessage) {
            // Check persistence immediately
            verifyAndRedirect(user);
        }
    }, [user]);

    // Core verification logic
    const verifyAndRedirect = async (firebaseUser: any) => {
        try {
            setStatusMessage("Vérification du profil...");
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                // User exists -> Access Granted
                const userData = userDoc.data();
                const name = userData.displayName || firebaseUser.email;
                setWelcomeMessage(`Bienvenue, ${name} !`);
                setStatusMessage(''); // Clear info
                setTimeout(() => router.push('/admin'), 1500);
            } else {
                // User doesn't exist -> AUTO-PROVISION (Restored Request)
                setStatusMessage("Premier accès détecté : Création du profil Admin...");

                const newProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'Admin User',
                    photoURL: firebaseUser.photoURL || null,
                    role: 'super_admin', // Default to super_admin as requested ("acces a tout")
                    createdAt: serverTimestamp(),
                };

                await setDoc(userRef, newProfile);

                setWelcomeMessage("Compte Admin activé ! Bienvenue.");
                setStatusMessage('');
                setTimeout(() => router.push('/admin'), 1500);
            }
        } catch (err: any) {
            console.error("Verification Error:", err);

            // STRICT REQUEST: "Je veux que chaque administrateur ai acces a tout sans restriction"
            // If we get a permission error (Firestore Rules), we ignore it and let the user in because they are Authenticated.
            // If we get a permission error, it usually means the user is not an admin (cannot read users collection)
            // So we treat it as an Access Denied.
            if (err.code === 'permission-denied' || err.message.includes('permission')) {
                console.warn("Permission denied for user:", firebaseUser.email);
            }

            // Default Error Handling for all cases (including permission denied)
            setError("Accès refusé : Impossible de vérifier le profil (Permissions insuffisantes ou Erreur technique).");
            setStatusMessage('');
            setLoading(false);
            await auth.signOut();
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');
        setLoading(true);

        try {
            // Step 1: Auth
            setStatusMessage("Authentification...");
            const creds = await signInWithEmailAndPassword(auth, email, password);

            // Step 2: Verification (Handled by verifyAndRedirect)
            await verifyAndRedirect(creds.user);

        } catch (err: any) {
            console.error("Login Error:", err);
            setLoading(false);
            setStatusMessage('');

            // User-friendly error mapping
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError("Email ou mot de passe incorrect.");
                    break;
                case 'auth/too-many-requests':
                    setError("Comptes bloqué temporairement (trop d'essais). Réessayez plus tard.");
                    break;
                case 'auth/operation-not-allowed':
                    setError("ERREUR CONFIGURATION : L'authentification Email/Password n'est pas activée dans la Console Firebase.");
                    break;
                default:
                    setError(`Erreur technique : ${err.message}`);
            }
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        setStatusMessage("Connexion avec Google...");
        try {
            await signInWithGoogle();
            // The useEffect hook will catch 'user' change and trigger verifyAndRedirect
        } catch (err: any) {
            setLoading(false);
            setStatusMessage('');
            setError("Erreur Google : " + err.message);
        }
    };

    // Render Success View
    if (welcomeMessage) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.glassCard} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div className="animate-bounce" style={{ fontSize: '4rem', color: '#4ade80', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h1 className={styles.title} style={{ color: 'white' }}>Accès Autorisé</h1>
                    <p className={styles.subtitle} style={{ color: '#dcfce7' }}>{welcomeMessage}</p>
                    <div className="loader" style={{ margin: '2rem auto' }}></div>
                </div>
            </div>
        );
    }

    // Render Logic Form
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
                    <p className={styles.subtitle}>Espace sécurisé</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className={`${styles.errorAlert} fade-in`}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span style={{ marginLeft: '10px' }}>{error}</span>
                    </div>
                )}

                {/* Status Message (Loading feedback) */}
                {statusMessage && !error && (
                    <div className={styles.statusMessage}>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span style={{ marginLeft: '10px' }}>{statusMessage}</span>
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
                            placeholder="admin@example.com"
                            className={styles.input}
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? 'Traitement...' : 'Se connecter'}
                    </button>

                    <div className={styles.divider}>
                        <span>OU</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className={styles.googleBtn}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
                        Continuer avec Google
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                    &copy; TEDSAI Ventures
                </div>
            </div>
        </div>
    );
}
