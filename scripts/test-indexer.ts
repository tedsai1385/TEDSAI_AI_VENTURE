import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as admin from 'firebase-admin';
import { SITE_MAP, extractPageContent } from '@/services/chatbot/site-indexer';
import { db as clientDb } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Initialize Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle private key newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('✅ Firebase Admin initialized');
    } catch (e) {
        console.error('Failed to init Admin SDK', e);
    }
}

const adminDb = admin.firestore();

async function indexWithAdmin() {
    console.log('🔍 Starting indexation with Admin SDK...');
    let indexed = 0;
    const errors: string[] = [];

    for (const page of SITE_MAP) {
        try {
            const content = extractPageContent(page);
            const pageData = {
                page_id: page.page_id,
                url: page.url,
                title: page.title,
                content: content,
                category: page.category,
                keywords: page.keywords,
                last_indexed: admin.firestore.Timestamp.now(), // Use admin timestamp
            };

            await adminDb.collection('site_content').doc(page.page_id).set(pageData);
            console.log(`✅ Indexed: ${page.title}`);
            indexed++;
        } catch (error) {
            console.error(`Failed to index ${page.page_id}`, error);
            errors.push(`${page.page_id}: ${error}`);
        }
    }
    return { success: errors.length === 0, indexed, errors };
}

// Simple search simulation using client SDK logic (but we can test read access here if clientDb works)
async function testSearchRead() {
    console.log('\n🔍 Testing Read Access with Admin SDK...');

    try {
        const snapshot = await adminDb.collection('site_content').get();
        console.log(`📚 Found ${snapshot.size} documents in site_content.`);

        // Test basic keyword match locally to verify content
        const keywords = ['restaurant', 'vitedia'];
        const matched = snapshot.docs.filter(d => {
            const data = d.data();
            return keywords.some(k => JSON.stringify(data).toLowerCase().includes(k));
        });
        console.log(`🔎 Found ${matched.length} docs matching 'restaurant' (Verification test).`);
    } catch (e) {
        console.error('Read test failed', e);
    }
}

async function main() {
    try {
        const result = await indexWithAdmin();
        if (result.success) {
            await testSearchRead();
        } else {
            console.error('Indexation failed', result.errors);
        }
    } catch (error) {
        console.error('Script error:', error);
    }
}

main();
