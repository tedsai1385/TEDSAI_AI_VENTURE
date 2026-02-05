import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import path from 'path';

// Import JSON data
import epicerieData from '@/../../public/assets/data/epicerie.json';
import menuData from '@/../../public/assets/data/menu.json';
import elevageData from '@/../../public/assets/data/elevage.json';

// Initialize Firebase Admin (Server-side only)
if (!admin.apps.length) {
    try {
        // Use environment variable for service account path
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './migration-key.json';
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e) {
        console.error('Failed to init Firebase Admin:', e);
        // Initialize without credentials in development
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }
}

const db = admin.firestore();

export async function POST(request: NextRequest) {
    try {
        const results = { epicerie: 0, menu: 0, elevage: 0, errors: [] as string[] };

        // 1. Migrate Epicerie
        const epicerieProducts = [
            ...epicerieData.epices.map(p => ({ ...p, category: 'epice' as const })),
            ...epicerieData.produits_frais
        ];

        for (const product of epicerieProducts) {
            try {
                await db.collection('epicerie_products').doc(product.id.toString()).set({
                    ...product,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                results.epicerie++;
            } catch (error) {
                results.errors.push(`Error adding ${product.name}: ${error}`);
            }
        }

        // 2. Migrate Menu
        const menuItems = [
            ...menuData.starters.map(item => ({ ...item, category: 'starter' as const })),
            ...menuData.mains.map(item => ({ ...item, category: 'main' as const })),
            ...menuData.desserts.map(item => ({ ...item, category: 'dessert' as const }))
        ];

        for (const item of menuItems) {
            try {
                await db.collection('vitedia_menu').doc(item.id.toString()).set({
                    ...item,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                results.menu++;
            } catch (error) {
                results.errors.push(`Error adding ${item.name}: ${error}`);
            }
        }

        // 3. Migrate Elevage
        try {
            await db.collection('elevage_stats').doc('current').set({
                volaille: {
                    capacity: elevageData.volaille.capacity,
                    cycle_duration: elevageData.volaille.cycle_duration,
                    production_annuelle: elevageData.volaille.production_annuelle,
                    taux_survie: elevageData.volaille.stats.taux_survie,
                    poids_moyen: elevageData.volaille.stats.poids_moyen,
                    rentabilite: elevageData.volaille.stats.rentabilite
                },
                aquaculture: {
                    especes: elevageData.aquaculture.especes.join(', '),
                    bassins: elevageData.aquaculture.bassins.toString(),
                    production_annuelle: elevageData.aquaculture.production_annuelle,
                    taux_survie: elevageData.aquaculture.stats.taux_survie,
                    poids_moyen_tilapia: elevageData.aquaculture.stats.poids_moyen_tilapia,
                    rentabilite: elevageData.aquaculture.stats.rentabilite
                },
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            results.elevage++;

            await db.collection('elevage_services').doc('list').set({
                items: elevageData.services,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            results.elevage++;
        } catch (error) {
            results.errors.push(`Error migrating elevage: ${error}`);
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
