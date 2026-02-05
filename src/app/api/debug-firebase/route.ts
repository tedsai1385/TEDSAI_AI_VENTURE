import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';

export async function GET() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    const privateKeyLength = privateKey ? privateKey.length : 0;
    const privateKeyStart = privateKey ? privateKey.substring(0, 20) : 'MISSING';
    const isPrivateKeyValidFormat = privateKey && privateKey.includes('-----BEGIN PRIVATE KEY-----');

    return NextResponse.json({
        configStatus: {
            projectId: projectId ? '✅ Present' : '❌ MISSING',
            clientEmail: clientEmail ? '✅ Present' : '❌ MISSING',
            privateKey: privateKey ? `✅ Present (Length: ${privateKeyLength}, Valid Header: ${isPrivateKeyValidFormat})` : '❌ MISSING',
            storageBucket: storageBucket ? '✅ Present' : '❌ MISSING',
        },
        adminStorageInitialized: !!adminStorage,
        values: {
            projectId,
            clientEmail,
            storageBucket,
            // DO NOT LOG PRIVATE KEY
        }
    });
}
