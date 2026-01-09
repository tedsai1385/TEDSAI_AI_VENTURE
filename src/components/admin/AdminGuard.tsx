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
                router.push('/login?redirect=/admin');
                return;
            }

            try {
                // Check if user is in 'admin_users' whitelist
                const adminDoc = await getDoc(doc(db, 'admin_users', user.email!));

                if (adminDoc.exists()) {
                    setAuthorized(true);
                } else {
                    alert("Accès refusé : Votre email n'est pas autorisé.");
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
