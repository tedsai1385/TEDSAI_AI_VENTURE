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

        // Run transaction
        await adminDb.runTransaction(async (transaction) => {
            for (const item of items) {
                const productRef = adminDb!.collection('garden_products').doc(item.productId);
                const productDoc = await transaction.get(productRef);

                if (!productDoc.exists) {
                    throw new Error(`Produit non trouvé : ${item.name}`);
                }

                const currentStock = productDoc.data()?.stock || 0;

                if (currentStock < item.quantity) {
                    throw new Error(`Stock insuffisant pour : ${item.name} (${currentStock} disponibles)`);
                }

                // Reserve stock
                transaction.update(productRef, {
                    stock: currentStock - item.quantity,
                    inStock: (currentStock - item.quantity) > 0,
                    updatedAt: new Date(),
                });
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Inventory Reservation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
