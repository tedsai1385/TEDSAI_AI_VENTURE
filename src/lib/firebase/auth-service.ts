import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    setDoc,
    Timestamp
} from 'firebase/firestore';
import app, { db } from './config';
import { UserWhitelist } from '@/types/user';

const auth = getAuth(app);

// Provider Google configuré
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ═══════════════════════════════════════════════════════════════════════
// CLASSE ERREUR PERSONNALISÉE
// ═══════════════════════════════════════════════════════════════════════

export class AuthError extends Error {
    constructor(
        message: string,
        public code: string,
        public technicalDetails?: string
    ) {
        super(message);
        this.name = 'AuthError';
    }
}

// ═══════════════════════════════════════════════════════════════════════
// MAPPING ERREURS FIREBASE → MESSAGES UTILISATEUR
// ═══════════════════════════════════════════════════════════════════════

function handleFirebaseError(error: any): AuthError {
    console.error('[AuthService] Firebase error:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
    });

    const errorMessages: Record<string, { message: string; action: string }> = {
        'auth/api-key-not-valid': {
            message: 'Configuration système invalide. Contactez l\'administrateur.',
            action: 'Vérifier NEXT_PUBLIC_FIREBASE_API_KEY dans .env.local',
        },
        'auth/invalid-api-key': {
            message: 'Clé API invalide. Vérifiez votre configuration.',
            action: 'Regénérer la clé dans Firebase Console',
        },
        'auth/user-not-found': {
            message: 'Aucun compte trouvé avec cet email.',
            action: 'Vérifier l\'orthographe ou créer un compte',
        },
        'auth/wrong-password': {
            message: 'Mot de passe incorrect.',
            action: 'Vérifier le mot de passe ou utiliser la réinitialisation',
        },
        'auth/invalid-credential': {
            message: 'Identifiants incorrects.',
            action: 'Vérifier email et mot de passe',
        },
        'auth/too-many-requests': {
            message: 'Trop de tentatives. Compte temporairement verrouillé.',
            action: 'Réessayer dans 15 minutes ou réinitialiser le mot de passe',
        },
        'auth/network-request-failed': {
            message: 'Problème de connexion internet.',
            action: 'Vérifier votre connexion réseau',
        },
        'auth/popup-closed-by-user': {
            message: 'Connexion Google annulée.',
            action: 'Réessayer',
        },
        'auth/popup-blocked': {
            message: 'Popup bloqué par le navigateur.',
            action: 'Autoriser les popups pour ce site',
        },
    };

    const knownError = errorMessages[error.code];

    if (knownError) {
        return new AuthError(knownError.message, error.code, knownError.action);
    }

    // Erreur inconnue
    return new AuthError(
        'Erreur de connexion. Réessayez.',
        error.code || 'unknown',
        error.message
    );
}

// ═══════════════════════════════════════════════════════════════════════
// CONNEXION EMAIL/PASSWORD
// ═══════════════════════════════════════════════════════════════════════

export async function loginWithEmailPassword(
    email: string,
    password: string
): Promise<{ user: FirebaseUser; whitelist: UserWhitelist }> {
    try {
        // Validation inputs
        if (!email?.trim() || !password?.trim()) {
            throw new AuthError('Email et mot de passe requis', 'validation/empty-fields');
        }

        console.log('[AuthService] Attempting login for:', email);

        // Tentative connexion Firebase
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = credential.user;

        console.log('[AuthService] Firebase auth success, checking whitelist...');

        // Vérification whitelist (gatekeeper)
        const whitelist = await verifyWhitelist(user.uid, user.email!);

        return { user: user, whitelist };

    } catch (error: any) {
        throw handleFirebaseError(error);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// CONNEXION GOOGLE
// ═══════════════════════════════════════════════════════════════════════

export async function loginWithGoogle(): Promise<{
    user: FirebaseUser;
    whitelist: UserWhitelist;
    isNewUser: boolean;
}> {
    try {
        console.log('[AuthService] Initiating Google OAuth...');

        const credential = await signInWithPopup(auth, googleProvider);
        const user = credential.user;
        const isNewUser = credential.additionalUserInfo?.isNewUser || false;

        console.log('[AuthService] Google auth success:', user.email);

        // Vérification whitelist (même logique que email/password)
        const whitelist = await verifyWhitelist(user.uid, user.email!);

        return { user, whitelist, isNewUser };

    } catch (error: any) {
        throw handleFirebaseError(error);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// VÉRIFICATION WHITELIST (GATEKEEPER)
// ═══════════════════════════════════════════════════════════════════════

async function verifyWhitelist(
    uid: string,
    email: string
): Promise<UserWhitelist> {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
        console.warn('[AuthService] Access denied - Not whitelisted:', email);

        // Déconnexion immédiate pour sécurité
        await signOut(auth);

        throw new AuthError(
            'Accès refusé. Ce compte n\'est pas autorisé.',
            'auth/not-whitelisted'
        );
    }

    const whitelist = userDoc.data() as UserWhitelist;

    if (!whitelist.isActive) {
        await signOut(auth);
        throw new AuthError(
            'Compte désactivé. Contactez l\'administrateur.',
            'auth/account-disabled'
        );
    }

    // Mise à jour dernière connexion (non bloquant)
    try {
        await updateDoc(doc(db, 'users', uid), {
            lastLoginAt: serverTimestamp(),
        });
    } catch (e) {
        console.warn('[AuthService] Failed to update lastLoginAt:', e);
    }

    return whitelist;
}

// ═══════════════════════════════════════════════════════════════════════
// GESTION SESSION
// ═══════════════════════════════════════════════════════════════════════

export function onAuthServiceStateChange(
    callback: (user: FirebaseUser | null, whitelist: UserWhitelist | null, error: AuthError | null) => void
): () => void {
    return onAuthStateChanged(auth, async (user) => {
        if (!user) {
            callback(null, null, null);
            return;
        }

        try {
            const whitelist = await verifyWhitelist(user.uid, user.email!);
            callback(user, whitelist, null);
        } catch (error: any) {
            // Erreur whitelist = déconnexion silencieuse
            await signOut(auth);
            callback(null, null, error instanceof AuthError ? error : new AuthError('Session invalide', 'auth/session-expired'));
        }
    });
}

export async function logoutUser(): Promise<void> {
    await signOut(auth);
}

// ═══════════════════════════════════════════════════════════════════════
// CRÉATION UTILISATEUR (Admin uniquement)
// ═══════════════════════════════════════════════════════════════════════

export async function createWhitelistedUser(
    email: string,
    password: string,
    role: UserWhitelist['role'],
    createdBy: string
): Promise<string> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userData: Omit<UserWhitelist, 'uid'> = {
        email: email.toLowerCase(),
        displayName: email.split('@')[0],
        authMethods: ['password'],
        role,
        isActive: true,
        createdBy,
        createdAt: serverTimestamp() as Timestamp,
        lastLoginAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, 'users', uid), userData);
    await signOut(auth);

    return uid;
}

export { auth };
