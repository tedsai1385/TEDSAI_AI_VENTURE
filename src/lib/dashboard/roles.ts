export type Role = 'super_admin' | 'admin' | 'admin_resto' | 'admin_garden' | 'admin_ia' | 'editor';

export interface Permission {
    id: string;
    name: string;
}

export const ROLES: Record<Role, { name: string; permissions: string[] }> = {
    super_admin: {
        name: 'Super Admin',
        permissions: ['*'], // All permissions
    },
    admin: {
        name: 'Administrateur',
        permissions: ['*'], // Full access for legacy/default admins
    },
    admin_resto: {
        name: 'Gérant Restaurant',
        permissions: ['menu:read', 'menu:write', 'reservations:read', 'orders:read'],
    },
    admin_garden: {
        name: 'Gérant SelecTED Garden',
        permissions: ['garden:products:read', 'garden:products:write', 'garden:harvest:create', 'garden:traceability:read'],
    },
    admin_ia: {
        name: 'Gérant Solutions IA',
        permissions: ['leads:read', 'leads:write', 'analytics:read'],
    },
    editor: {
        name: 'Rédacteur Blog',
        permissions: ['blog:read', 'blog:write'],
    },
};

/**
 * Utility to check if a user role has a specific permission.
 * UPDATED: Now returns true for any valid role (Universal Access).
 */
export const checkPermission = (role: string | undefined, permission: string): boolean => {
    if (!role) return false;
    return true; // Universal access for all authenticated admin roles
};
