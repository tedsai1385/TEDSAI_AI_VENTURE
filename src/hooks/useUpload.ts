'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase/config';
import { signInAnonymously } from 'firebase/auth';

interface UploadOptions {
    path: string;
    metadata?: Record<string, string>;
}

export function useUpload() {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Fonction d'authentification anonyme helper
    const ensureAuth = async () => {
        if (!auth.currentUser) {
            try {
                await signInAnonymously(auth);
            } catch (err: any) {
                console.warn("Auth anonyme échouée (API Key invalide ?), tentative upload sans auth:", err.code);
                // NE PAS bloquer ici, on laisse le storage décider si c'est autorisé sans auth
            }
        }
        return auth.currentUser;
    };

    const upload = async (file: File, options: UploadOptions) => {
        setError(null);
        setProgress(0);

        try {
            // 1. Auth requise
            await ensureAuth();

            // 2. Vérification fichier
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('Fichier trop volumineux (max 10MB)');
            }

            if (!storage) throw new Error("Firebase Storage non initialisé");

            // 3. Upload avec monitoring
            // Nettoyage nom fichier
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${Date.now()}_${cleanName}`;

            // Chemin complet
            const fullPath = `${options.path}/${filename}`;
            const fileRef = ref(storage, fullPath);

            // Upload
            const snapshot = await uploadBytes(fileRef, file, {
                contentType: file.type,
                customMetadata: options.metadata,
            });

            // URL
            const url = await getDownloadURL(snapshot.ref);

            setProgress(100);
            return { success: true, url, filename };

        } catch (err: any) {
            console.error('Client SDK Upload Error:', err);

            // TENTATIVE FALLBACK API (Serveur ou Local)
            try {
                console.log("🔄 Tentative via API de secours...");
                const formData = new FormData();
                formData.append('file', file);
                // On enlève le timestamp du path pour l'API qui gère son propre nommage
                // path: "articles"
                formData.append('path', options.path);

                const response = await fetch('/api/gallery/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'API Fallback failed');
                }

                const data = await response.json();

                setProgress(100);
                return {
                    success: true,
                    url: data.url,
                    filename: data.url.split('/').pop() || 'uploaded-file'
                };

            } catch (apiErr: any) {
                console.error('API Fallback Error:', apiErr);
                setError(`Echec total (Client & API): ${apiErr.message}`);
                throw new Error('Impossible d\'uploader le fichier (ni via Firebase, ni en local).');
            }
        }
    };

    return { upload, progress, error };
}
