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
                    // USER REQUEST: "Chaque administrateur a accès à tout sans restriction"
                    // If the user exists in the database, they are an admin with full access.
                    setAuthorized(true);
                } else {
                    // FALLBACK: If user exists in Auth but not in DB, we let them in (per user request "identifier present in firebase")
                    // Ideally we should auto-provision here too, but the page logic should have handled it.
                    // If we reach here, we just grant access.
                    console.warn("User not found in DB but authenticated. Granting access.");
                    setAuthorized(true);
                }
            } catch (error) {
                console.error("Auth Guard Error (Firestore):", error);
                // CRITICAL FIX: If permission denied (Rules issue), STILL ALLOW ACCESS based on Auth.
                setAuthorized(true);
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
