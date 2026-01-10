export type Role = 'super_admin' | 'admin_resto' | 'admin_garden' | 'admin_ia' | 'editor';

export interface Permission {
    id: string;
    name: string;
}

export const ROLES: Record<Role, { name: string; permissions: string[] }> = {
    super_admin: {
        name: 'Super Admin',
        permissions: ['*'], // All permissions
    },
    admin_resto: {
        name: 'Gérant Restaurant',
        permissions: ['menu:read', 'menu:write', 'reservations:read', 'orders:read'],
    },
    admin_garden: {
        name: 'Gérant Jardin',
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

export function checkPermission(userRole: string | undefined, permission: string): boolean {
    if (!userRole) return false;
    const roleData = ROLES[userRole as Role];
    if (!roleData) return false;
    if (roleData.permissions.includes('*')) return true;
    return roleData.permissions.includes(permission);
}
