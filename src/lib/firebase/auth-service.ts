import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    User
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc } from 'firebase/firestore';

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export const loginWithEmailPassword = async (email: string, pass: string): Promise<User> => {
    if (!auth) throw new AuthError('Firebase Auth non initialisé');
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    } catch (error: any) {
        console.error('Login error:', error);
        let message = 'Échec de l\'authentification';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            message = 'Identifiants incorrects';
        } else if (error.code === 'auth/user-not-found') {
            message = 'Utilisateur inconnu';
        } else if (error.code === 'auth/too-many-requests') {
            message = 'Trop de tentatives, réessayez plus tard';
        }
        throw new AuthError(message);
    }
};

export const loginWithGoogle = async (): Promise<{ user: User; isNewUser: boolean }> => {
    if (!auth) throw new AuthError('Firebase Auth non initialisé');
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        let isNewUser = false;
        if (db) {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            isNewUser = !userSnap.exists();
        }

        return { user, isNewUser };
    } catch (error: any) {
        console.error('Google login error:', error);
        throw new AuthError('Échec de la connexion Google');
    }
};
