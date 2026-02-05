import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerData, paymentMethod = 'card' } = body;

        if (!items || items.length === 0) {
            return new NextResponse('No items in checkout', { status: 400 });
        }

        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        let checkoutUrl = '';
        let transactionId = '';

        if (paymentMethod === 'card') {
            if (!process.env.STRIPE_SECRET_KEY) {
                return new NextResponse('Configuration Error: Stripe key is missing.', { status: 500 });
            }

            const line_items = items.map((item: any) => ({
                price_data: {
                    currency: 'xaf',
                    product_data: { name: item.name },
                    unit_amount: item.price,
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${baseUrl}/vitedia/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/vitedia/checkout/cancel`,
                metadata: {
                    customerName: customerData.name,
                    customerPhone: customerData.phone,
                    notes: customerData.notes || '',
                },
            });
            checkoutUrl = session.url!;
            transactionId = session.id;
        } else {
            // Mobile Money via Flutterwave
            const flw_secret = process.env.FLW_SECRET_KEY;
            if (!flw_secret) {
                // If no keys, return a mock URL for demo
                checkoutUrl = `https://checkout.flutterwave.com/mock-momo?amount=${subtotal}`;
                transactionId = `FLW-MOCK-${Date.now()}`;
            } else {
                const response = await fetch('https://api.flutterwave.com/v3/payments', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${flw_secret}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tx_ref: `TEDSAI-REST-${Date.now()}`,
                        amount: subtotal,
                        currency: 'XAF',
                        redirect_url: `${baseUrl}/vitedia/checkout/success`,
                        customer: {
                            email: customerData.email || `${customerData.phone}@tedsai.cm`,
                            phonenumber: customerData.phone,
                            name: customerData.name,
                        },
                        customizations: {
                            title: 'TEDSAI Complex - Vitedia',
                            description: 'Commande Restaurant',
                        },
                        payment_options: 'mobilemoneyfrancophone',
                    }),
                });

                const data = await response.json();
                if (data.status === 'success') {
                    checkoutUrl = data.data.link;
                    transactionId = data.data.tx_ref;
                } else {
                    throw new Error(data.message || 'Flutterwave Error');
                }
            }
        }

        // Store pending order in Firebase
        if (adminDb) {
            const now = new Date();
            await adminDb.collection('restaurant_orders').doc(transactionId).set({
                id: transactionId,
                customerName: customerData.name,
                customerPhone: customerData.phone,
                items: items.map((i: any) => `${i.quantity}x ${i.name}`),
                total: subtotal,
                description: customerData.notes || "Commande restaurant",
                status: 'new',
                paymentStatus: 'pending',
                method: paymentMethod,
                createdAt: FieldValue.serverTimestamp(),
                time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                source: 'Vitedia Web'
            });
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error('Checkout Error:', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
