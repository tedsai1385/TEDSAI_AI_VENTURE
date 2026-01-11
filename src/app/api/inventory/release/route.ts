import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: Request) {
    if (!adminDb) {
        return NextResponse.json({ error: 'Backend not initialized' }, { status: 500 });
    }

    try {
        const { items } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
        }

        await adminDb.runTransaction(async (transaction) => {
            for (const item of items) {
                const productRef = adminDb!.collection('garden_products').doc(item.productId);
                const productDoc = await transaction.get(productRef);

                if (productDoc.exists) {
                    const currentStock = productDoc.data()?.stock || 0;
                    transaction.update(productRef, {
                        stock: currentStock + item.quantity,
                        inStock: true,
                        updatedAt: new Date(),
                    });
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Inventory Release Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
