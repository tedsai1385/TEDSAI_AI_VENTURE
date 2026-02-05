/**
 * Authentication Utilities - TEDSAI Admin
 * Phase 1.5 : Helpers de base
 * Phase 2 : 2FA, JWT, Session management
 */

/**
 * Simule une vérification d'authentification
 * À remplacer par vraie logique en Phase 2
 */
export function isAuthenticated(): boolean {
    // TODO Phase 2: Vérifier JWT/session réelle
    if (typeof window !== 'undefined') {
        return localStorage.getItem('admin-authenticated') === 'true';
    }
    return false;
}

/**
 * Simule une connexion
 * À remplacer par appel API + JWT en Phase 2
 */
export async function login(email: string, password: string): Promise<boolean> {
    // TODO Phase 2: Appel API backend
    // TODO Phase 2: Stocker JWT dans httpOnly cookie
    // TODO Phase 2: Déclencher 2FA si activé

    // Simulation
    if (email === 'admin@tedsai.cm' && password === 'demo') {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-authenticated', 'true');
            // Simuler un cookie (à remplacer par vrai cookie httpOnly)
            document.cookie = 'auth-token=demo-token; path=/; max-age=86400';
        }
        return true;
    }
    return false;
}

/**
 * Déconnexion
 */
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-authenticated');
        document.cookie = 'auth-token=; path=/; max-age=0';
    }
}

/**
 * Structure pour 2FA (Phase 2)
 */
export interface TOTPSetup {
    secret: string;
    qrCode: string;
    backupCodes: string[];
}

export async function setup2FA(userId: string): Promise<TOTPSetup> {
    // TODO Phase 2: Générer secret TOTP avec speakeasy
    // TODO Phase 2: Générer QR code
    // TODO Phase 2: Générer backup codes

    return {
        secret: 'PLACEHOLDER',
        qrCode: 'data:image/png;base64,PLACEHOLDER',
        backupCodes: ['BACKUP-1', 'BACKUP-2'],
    };
}

export async function verify2FA(userId: string, code: string): Promise<boolean> {
    // TODO Phase 2: Vérifier code TOTP avec speakeasy
    return false;
}
