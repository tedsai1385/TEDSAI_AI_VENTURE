'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/admin/login');
                return;
            }

            try {
                // Check user profile in 'users' collection
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Check for admin roles
                    const validRoles = ['super_admin', 'admin_resto', 'admin_garden', 'admin_ia'];
                    if (validRoles.includes(userData.role)) {
                        setAuthorized(true);
                    } else {
                        alert("Accès refusé : Rôle insuffisant.");
                        await auth.signOut();
                        router.push('/admin/login');
                    }
                } else {
                    alert("Compte non configuré.");
                    await auth.signOut();
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error("Auth Guard Error:", error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Chargement sécurisé...
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}
