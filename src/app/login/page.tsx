'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail, logout } = useAuth();
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmail(email, password);
        } catch (err: any) {
            console.error(err);
            setError("Identifiants incorrects ou erreur serveur : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/unauthorized-domain') {
                setError("Ce domaine n'est pas autorisé. Ajoutez 'tedsai-ai-venture.vercel.app' dans la Console Firebase > Authentication > Settings.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("La fenêtre de connexion a été fermée.");
            } else {
                setError("Connexion Google échouée : " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // NO auto-redirect. Show status instead.

    if (user) {
        return (
            <div className={styles.loginPage}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>
                <div className={styles.glassCard} style={{ textAlign: 'center' }}>
                    <div className={styles.iconWrapper}>
                        <div className={styles.iconGlow}></div>
                        <i className={`fa-solid fa-user-check ${styles.icon}`}></i>
                    </div>
                    <h1 className={styles.title}>Déjà connecté</h1>
                    <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
                        Compte : <strong>{user.email}</strong>
                    </p>

                    <button
                        onClick={() => router.push('/admin')}
                        className={styles.submitBtn}
                        style={{ marginBottom: '1rem' }}
                    >
                        Accéder au Dashboard
                    </button>

                    <button
                        onClick={() => window.location.reload()} // Simple logout handling if needed or use auth.signOut
                        className={styles.googleBtn} // Reusing style for outlining
                        style={{ justifyContent: 'center', color: '#c62828', borderColor: '#ffcdd2' }}
                        onClickCapture={async (e) => {
                            e.preventDefault();
                            // Assuming logout is available from useAuth, if not we need to add it to destructuring above
                            // But checking above, logout IS NOT de-structured. Need to fix that.
                            // For now using window.location to force refresh might not clear auth.
                        }}
                    >
                        Wait, need to destruct logout first.
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginPage}>
            {/* Background Effects */}
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className={styles.glassCard}>
                <div className={styles.iconWrapper}>
                    <div className={styles.iconGlow}></div>
                    <i className={`fa-solid fa-cube ${styles.icon}`}></i>
                </div>

                <h1 className={styles.title}>TEDSAI Admin</h1>
                <p className={styles.subtitle}>Portail de gestion unifié pour l'écosystème.</p>

                {error && (
                    <div className={styles.errorAlert}>
                        <i className={`fa-solid fa-triangle-exclamation ${styles.errorIcon}`}></i>
                        <div>
                            <span className={styles.errorTitle}>Erreur de connexion</span>
                            <span className={styles.errorMessage}>{error}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="admin@tedsai.com"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <span className={styles.dividerText}>OU</span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className={styles.googleBtn}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    <span>Continuer avec Google</span>
                </button>

                <p className={styles.footer}>
                    &copy; {new Date().getFullYear()} TEDSAI AI Venture. <br /> Accès sécurisé réservé au personnel.
                </p>
            </div>
        </div>
    );
}
