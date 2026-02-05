const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables locales
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error('❌ Environnement Firebase incomplet dans .env.local');
    process.exit(1);
}

// Initialiser Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
});

const db = admin.firestore();

const testProduct = {
    name: "Test Basilic Expert (IA)",
    description: "Produit de test ajouté manuellement par l'agent IA pour vérifier l'intégrité de la base de données. Qualité Premium.",
    price: "4 000 FCFA / kg",
    tag: "Aromate",
    quantity: 5,
    unit: "kg",
    inStock: true,
    image: "https://firebasestorage.googleapis.com/v0/b/tedsai-prod-dd55f.appspot.com/o/garden%2F1737630239352_basilic.png?alt=media",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function runTest() {
    console.log('🚀 Tentative d\'ajout du produit de test...');
    try {
        const docRef = await db.collection('garden_products').add(testProduct);
        console.log('✅ Produit ajouté avec ID:', docRef.id);

        // Vérification immédiate
        const savedDoc = await docRef.get();
        if (savedDoc.exists) {
            console.log('🔍 Vérification réussie : Le produit est bien présent en base.');
        } else {
            console.error('❌ Erreur de vérification : Le document semble introuvable après création.');
        }
    } catch (error) {
        console.error('❌ ÉCHEC du test :', error);
    } finally {
        process.exit();
    }
}

runTest();
