'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminGuard({ children, requiredRoles = [] }: { children: React.ReactNode, requiredRoles?: string[] }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                // Check user profile in 'users' collection
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userRole = userData.role;

                    // List of all roles that have basic admin access
                    const allAdminRoles = ['super_admin', 'admin_resto', 'admin_garden', 'admin_ia'];

                    // 1. Basic Check: Is the user an admin at all?
                    if (!allAdminRoles.includes(userRole)) {
                        alert("Accès refusé : Vous n'avez pas les droits d'administration.");
                        await auth.signOut();
                        router.push('/login');
                        return;
                    }

                    // 2. Specific Role Check (if requiredRoles provided)
                    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole) && userRole !== 'super_admin') {
                        // Super admin always passes
                        alert(`Accès restreint aux rôles : ${requiredRoles.join(', ')}`);
                        router.push('/admin'); // Redirect to main dashboard instead of logout
                        return;
                    }

                    setAuthorized(true);
                } else {
                    alert("Compte non configuré.");
                    await auth.signOut();
                    router.push('/login');
                }
            } catch (error) {
                console.error("Auth Guard Error:", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, requiredRoles]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                Chargement des droits...
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}
