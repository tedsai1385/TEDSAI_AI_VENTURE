/**
 * Firestore Migration Script - Dashboard V2
 * 
 * This script migrates existing JSON data to Firestore collections.
 * Run this ONCE to initialize the database with existing data.
 * 
 * Usage: node scripts/migrate-to-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json'); // Using provided key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData() {
    console.log('🚀 Starting Firestore migration...\n');

    try {
        // 1. Migrate Epicerie Products
        console.log('📦 Migrating Epicerie products...');
        const epicerieData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../public/assets/data/epicerie.json'), 'utf8')
        );

        const epicerieProducts = [
            ...epicerieData.epices.map(p => ({ ...p, category: 'epice' })),
            ...epicerieData.produits_frais
        ];

        for (const product of epicerieProducts) {
            await db.collection('epicerie_products').doc(product.id).set({
                ...product,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✓ Added: ${product.name}`);
        }

        // 2. Migrate Restaurant Menu
        console.log('\n🍽️ Migrating Restaurant menu...');
        const menuData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../public/assets/data/menu.json'), 'utf8')
        );

        const menuItems = [
            ...menuData.starters.map(item => ({ ...item, category: 'starter' })),
            ...menuData.mains.map(item => ({ ...item, category: 'main' })),
            ...menuData.desserts.map(item => ({ ...item, category: 'dessert' }))
        ];

        for (const item of menuItems) {
            await db.collection('vitedia_menu').doc(item.id).set({
                ...item,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✓ Added: ${item.name}`);
        }

        // 3. Migrate Elevage Stats
        console.log('\n🐔 Migrating Elevage stats...');
        const elevageData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../public/assets/data/elevage.json'), 'utf8')
        );

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
        console.log('  ✓ Stats migrated');

        await db.collection('elevage_services').doc('list').set({
            items: elevageData.services,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('  ✓ Services migrated');

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('  1. Update frontend pages to fetch from Firestore');
        console.log('  2. Test all admin pages');
        console.log('  3. Remove or archive JSON files');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

migrateData();

