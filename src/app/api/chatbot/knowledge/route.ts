import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET - Récupérer toutes les connaissances
export async function GET(request: NextRequest) {
    try {
        if (!adminDb) {
            return NextResponse.json([], { status: 200 }); // Retourner tableau vide si pas de DB
        }

        const snapshot = await adminDb
            .collection('chatbot_knowledge')
            .orderBy('createdAt', 'desc')
            .get();

        const knowledge = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(knowledge);
    } catch (error: any) {
        console.error('[Knowledge GET Error]:', error);
        return NextResponse.json(
            { error: 'Failed to fetch knowledge', message: error.message },
            { status: 500 }
        );
    }
}

// POST - Ajouter une nouvelle connaissance
export async function POST(request: NextRequest) {
    try {
        if (!adminDb) {
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { question, answer, category, keywords, priority, active } = body;

        // Validation
        if (!question || !answer || !category) {
            return NextResponse.json(
                { error: 'Question, answer, and category are required' },
                { status: 400 }
            );
        }

        const docRef = await adminDb.collection('chatbot_knowledge').add({
            question,
            answer,
            category,
            keywords: keywords || [],
            priority: priority || 'normal',
            active: active !== undefined ? active : true,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({ id: docRef.id, success: true });
    } catch (error: any) {
        console.error('[Knowledge POST Error]:', error);
        return NextResponse.json(
            { error: 'Failed to create knowledge', message: error.message },
            { status: 500 }
        );
    }
}
