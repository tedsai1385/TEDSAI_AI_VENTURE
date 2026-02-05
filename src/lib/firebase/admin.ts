import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminStorage: admin.storage.Storage | null = null;

try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (projectId && clientEmail && privateKey) {
        // Clean private key: remove quotes if present and fix newlines
        privateKey = privateKey.trim();
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.substring(1, privateKey.length - 1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
                storageBucket: storageBucket || `${projectId}.appspot.com`,
            });
            console.log('✅ Firebase Admin SDK initialized with bucket:', storageBucket || `${projectId}.appspot.com`);
        }
        adminDb = admin.firestore();
        adminAuth = admin.auth();
        adminStorage = admin.storage();
    } else {
        console.warn('⚠️ Firebase Admin keys missing. Admin SDK not initialized.');
    }
} catch (error) {
    console.error('Firebase admin initialization error:', error);
}

export { adminDb, adminAuth, adminStorage };
