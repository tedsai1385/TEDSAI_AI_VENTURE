import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const path = formData.get('path') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Nettoyage nom au cas où
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}_${safeName}`;

        // 1. TENTATIVE FIREBASE ADMIN
        // On essaie d'uploader via le Admin SDK si configuré
        if (adminStorage) {
            try {
                // Essai sur le bucket par défaut ou configuré
                const bucket = adminStorage.bucket();

                // Petit check rapide
                // await bucket.exists(); // Optionnel, peut être lent

                const fileRef = bucket.file(`${path}/${filename}`);

                await fileRef.save(buffer, {
                    metadata: { contentType: file.type },
                });

                // Pour rendre public
                await fileRef.makePublic();
                // OU signed URL longue durée si makePublic bloque
                // const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });

                const url = fileRef.publicUrl();

                return NextResponse.json({
                    success: true,
                    url,
                    provider: 'firebase-admin'
                });

            } catch (firebaseError: any) {
                console.error("⚠️ Firebase Admin Upload Failed (Billing/Auth/Config):", firebaseError.message);
                // On NE retourne PAS d'erreur tout de suite, on passe au fallback local
            }
        }

        // 2. FALLBACK : STOCKAGE LOCAL (Dev / Secours)
        // Sauvegarde dans public/uploads pour être servi statiquement
        try {
            const relativeDir = `/uploads/${path}`;
            const uploadDir = join(process.cwd(), 'public', 'uploads', path);

            // Création récursive du dossier
            await mkdir(uploadDir, { recursive: true });

            const filePath = join(uploadDir, filename);
            await writeFile(filePath, buffer);

            const publicUrl = `${relativeDir}/${filename}`;
            console.log("✅ Local Upload Success:", publicUrl);

            return NextResponse.json({
                success: true,
                url: publicUrl,
                provider: 'local-filesystem',
                warning: 'Stockage local utilisé (Firebase indisponible)'
            });

        } catch (localError: any) {
            console.error("❌ Local Upload Failed:", localError);
            return NextResponse.json({ error: 'All upload methods failed (Firebase & Local)' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('API Upload Fatal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
