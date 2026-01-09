'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function AdminSetupPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const log = (msg: string) => setLogs(prev => [...prev, msg]);

    const createAllAccounts = async () => {
        setLoading(true);
        setLogs(['🚀 Démarrage de la création...']);

        const accounts = [
            { email: 'superadmin@tedsai.cm', pass: 'admin123', role: 'super_admin', name: 'Super Admin' },
            { email: 'resto@tedsai.cm', pass: 'resto123', role: 'admin_resto', name: 'Chef Cuisine' },
            { email: 'garden@tedsai.cm', pass: 'garden123', role: 'admin_garden', name: 'Chef Jardinier' },
            { email: 'ia@tedsai.cm', pass: 'ia123', role: 'admin_ia', name: 'Responsable IA' }
        ];

        for (const acc of accounts) {
            try {
                log(`Tentative création ${acc.email}...`);

                // Note: In client-side app, we can only create one user at a time and it logs us in.
                // We will create the user, set db profile, and sign out immediately.
                const userCredential = await createUserWithEmailAndPassword(auth, acc.email, acc.pass);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: acc.email,
                    role: acc.role,
                    name: acc.name,
                    createdAt: new Date()
                });

                log(`✅ Compte créé : ${acc.email} (${acc.role})`);
                await signOut(auth); // Sign out to prepare for next creation

            } catch (err: any) {
                if (err.code === 'auth/email-already-in-use') {
                    log(`⚠️ Compte ${acc.email} existe déjà.`);
                } else {
                    log(`❌ Erreur pour ${acc.email}: ${err.message}`);
                }
            }
        }
        log("✨ Opération terminée !");
        setLoading(false);
    };

    return (
        <div style={{
            fontFamily: 'sans-serif',
            padding: '2rem',
            maxWidth: '600px',
            margin: '2rem auto',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ color: '#0A2463', marginBottom: '1rem' }}>🛠 Initialisation Admin</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Cet outil va créer les comptes administrateurs par défaut dans Firebase.
                Utilisez ceci uniquement lors de la première installation.
            </p>

            <button
                onClick={createAllAccounts}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginBottom: '1.5rem'
                }}
            >
                {loading ? 'Création en cours...' : 'Créer les comptes (Superadmin, Resto, Garden, IA)'}
            </button>

            <div style={{
                background: '#1e293b',
                color: '#4ade80',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                minHeight: '150px',
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem'
            }}>
                {logs.length === 0 ? 'En attente...' : logs.join('\n')}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                    ← Retour à la Connexion
                </a>
            </div>
        </div>
    );
}
