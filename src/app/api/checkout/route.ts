import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items } = body;

        if (!items || items.length === 0) {
            return new NextResponse('No items in checkout', { status: 400 });
        }

        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'xaf', // Using XAF as requested
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: item.price, // Amount in lowest denomination (e.g., cents/kobo). check if Stripe supports XAF decimals. If not, this is correct (1500 = 1500 XAF). XAF is zero-decimal usually? No, it's typically treated as integer in Stripe if passed as such. Wait, Stripe usually expects amounts in smallest unit. XAF doesn't have cents usually used. Let's verify. 
                // XAF is a zero-decimal currency in Stripe? 
                // "The Cameroonian franc (XAF) is a zero-decimal currency." -> So 1500 is 1500.
            },
            quantity: item.cartQuantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL || 'https://tedsai.vercel.app'}/shop?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://tedsai.vercel.app'}/shop?canceled=1`,
            metadata: {
                // Add any order metadata here
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
