import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserWhitelist {
    uid: string;                    // Firebase Auth UID
    email: string;                  // Email principal (unique)
    displayName: string;
    photoURL?: string;

    // Authentification
    authMethods: ('password' | 'google')[];
    passwordHash?: string;          // Si créé par admin (optionnel)

    // Autorisation
    role: UserRole;
    isActive: boolean;              // Désactivation sans suppression

    // Métadonnées
    createdBy: string;              // UID admin créateur
    createdAt: Timestamp;
    lastLoginAt: Timestamp;
    lastLoginIP?: string;

    // Restrictions
    allowedCategories?: string[];   // Pour éditeurs limités
    maxArticlesPerDay?: number;     // Quota éditorial
}

export type CreateUserWhitelistDTO = Omit<UserWhitelist, 'uid' | 'createdAt' | 'lastLoginAt'>;
