import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// PUT - Mettre à jour une connaissance
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!adminDb) {
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { question, answer, category, keywords, priority, active } = body;

        await adminDb.collection('chatbot_knowledge').doc(params.id).update({
            question,
            answer,
            category,
            keywords: keywords || [],
            priority: priority || 'normal',
            active: active !== undefined ? active : true,
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Knowledge PUT Error]:', error);
        return NextResponse.json(
            { error: 'Failed to update knowledge', message: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une connaissance
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!adminDb) {
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        await adminDb.collection('chatbot_knowledge').doc(params.id).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Knowledge DELETE Error]:', error);
        return NextResponse.json(
            { error: 'Failed to delete knowledge', message: error.message },
            { status: 500 }
        );
    }
}
