import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    if (!webhookSecret) {
        console.error('⚠️ STRIPE_WEBHOOK_SECRET is not set.');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature')!;

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`❌ Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle event
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'checkout.session.expired':
                await handleSessionExpired(event.data.object as Stripe.Checkout.Session);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[Webhook Error]', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    if (!adminDb) return;

    console.log('[Webhook] Processing checkout session:', session.id);

    // Find order by session ID
    const ordersSnapshot = await adminDb
        .collection('orders')
        .where('stripeSessionId', '==', session.id)
        .limit(1)
        .get();

    if (ordersSnapshot.empty) {
        console.error('Order not found for session:', session.id);
        return;
    }

    const orderDoc = ordersSnapshot.docs[0];

    // Update order status
    await orderDoc.ref.update({
        status: 'confirmed',
        paymentStatus: 'paid',
        stripePaymentIntentId: session.payment_intent,
        paidAt: new Date(),
        updatedAt: new Date(),
    });

    console.log('[Webhook] Order confirmed:', orderDoc.id);

    // Trigger internal notification service
    try {
        await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'order_confirmation',
                orderId: orderDoc.id,
                email: session.customer_details?.email
            }),
        });
    } catch (err) {
        console.error('Failed to trigger notification:', err);
    }
}

async function handleSessionExpired(session: Stripe.Checkout.Session) {
    if (!adminDb) return;
    console.log('[Webhook] Session expired, releasing stock:', session.id);
    await releaseStockFromSession(session);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    if (!adminDb) return;

    console.log('[Webhook] Payment failed:', paymentIntent.id);

    // Find order
    const ordersSnapshot = await adminDb
        .collection('orders')
        .where('stripePaymentIntentId', '==', paymentIntent.id)
        .limit(1)
        .get();

    if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        await orderDoc.ref.update({
            paymentStatus: 'failed',
            status: 'cancelled',
            updatedAt: new Date(),
        });

        // Release stock since payment failed
        const orderData = orderDoc.data();
        if (orderData.items) {
            await releaseInventory(orderData.items);
        }
    }
}

async function releaseStockFromSession(session: Stripe.Checkout.Session) {
    if (!adminDb || !session.metadata?.items) return;

    try {
        const items = JSON.parse(session.metadata.items as string);
        await releaseInventory(items);

        // Update order status if it exists
        const ordersSnapshot = await adminDb
            .collection('orders')
            .where('stripeSessionId', '==', session.id)
            .limit(1)
            .get();

        if (!ordersSnapshot.empty) {
            await ordersSnapshot.docs[0].ref.update({
                status: 'cancelled',
                reason: 'session_expired',
                updatedAt: new Date(),
            });
        }
    } catch (err) {
        console.error('Error releasing stock from session:', err);
    }
}

async function releaseInventory(items: any[]) {
    if (!adminDb) return;

    await adminDb.runTransaction(async (transaction) => {
        for (const item of items) {
            const productRef = adminDb!.collection('garden_products').doc(item.productId);
            const productDoc = await transaction.get(productRef);

            if (productDoc.exists) {
                const currentStock = productDoc.data()?.stock || 0;
                transaction.update(productRef, {
                    stock: currentStock + item.quantity,
                    inStock: true
                });
            }
        }
    });
}
