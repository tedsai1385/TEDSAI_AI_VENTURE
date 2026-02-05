import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, userId, shippingAddress } = body;

        if (!items || items.length === 0) {
            return new NextResponse('No items in checkout', { status: 400 });
        }

        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.19);
        const shipping = 2000;
        const total = subtotal + tax + shipping;

        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'xaf',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: item.price,
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            shipping_options: [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: shipping,
                        currency: 'xaf',
                    },
                    display_name: 'Livraison standard',
                },
            }],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL || 'https://tedsai.vercel.app'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://tedsai.vercel.app'}/checkout/cancel`,
            metadata: {
                userId: userId || 'guest',
                shippingAddress: JSON.stringify(shippingAddress),
                items: JSON.stringify(items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }))),
            },
            customer_email: shippingAddress?.email,
        });

        // Reserve stock and create pending order in a single transaction if possible, 
        // but since we need session.id, we do it after.
        if (adminDb) {
            await adminDb.runTransaction(async (transaction) => {
                // 1. Check & Reserve Stock ONLY for Garden products
                for (const item of items) {
                    // Only garden products have inventory tracking in this specific collection
                    if (item.category === 'garden') {
                        const productRef = adminDb!.collection('garden_products').doc(item.productId);
                        const productDoc = await transaction.get(productRef);

                        if (!productDoc.exists) continue; // Skip if product managed elsewhere or deleted

                        const currentStock = productDoc.data()?.stock || 0;
                        if (currentStock < item.quantity) {
                            throw new Error(`Stock insuffisant pour ${item.name}.`);
                        }

                        transaction.update(productRef, {
                            stock: currentStock - item.quantity,
                            inStock: (currentStock - item.quantity) > 0
                        });
                    }
                }

                // 2. Create Order
                const orderRef = adminDb!.collection('orders').doc();
                transaction.set(orderRef, {
                    userId: userId || 'guest',
                    items: items.map((i: any) => ({
                        ...i,
                        price: Math.round(i.price) // Ensure integer
                    })),
                    subtotal,
                    tax,
                    shipping,
                    total,
                    status: 'pending',
                    paymentStatus: 'pending',
                    shippingAddress,
                    stripeSessionId: session.id,
                    createdAt: new Date(),
                });
            });
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
