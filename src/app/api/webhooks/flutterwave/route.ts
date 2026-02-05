import { NextResponse } from 'next/server';
import { sendWhatsAppNotification, WhatsAppTemplates } from '@/lib/notifications/whatsapp';
import { verifyPayment } from '@/lib/payments/flutterwave';

/**
 * Webhook Flutterwave
 * Phase 2.4 - Gestion des callbacks paiements
 */
export async function POST(req: Request) {
    try {
        const signature = req.headers.get('verif-hash');
        const secret = process.env.FLW_WEBHOOK_SECRET;

        // TODO Phase 2.4: Vérifier signature webhook
        // if (signature !== secret) {
        //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const payload = await req.json();
        console.log('[Webhook Flutterwave]', payload);

        // Extraire infos transaction
        const { event, data } = payload;

        if (event === 'charge.completed') {
            const { id, tx_ref, amount, currency, customer, status } = data;

            // Vérifier le paiement
            const verification = await verifyPayment(id);

            if (verification.status === 'successful') {
                // TODO: Mettre à jour commande en DB
                // const orderId = tx_ref.split('-')[1];
                // await updateOrderStatus(orderId, 'paid');

                // Envoyer notification WhatsApp
                await sendWhatsAppNotification({
                    to: customer.phone_number,
                    message: WhatsAppTemplates.orderConfirmed(tx_ref, amount),
                    template: 'order_confirmed',
                });

                console.log(`✅ Paiement ${id} confirmé - Notification envoyée`);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('[Webhook Error]', error);
        return NextResponse.json(
            { error: 'Webhook processing failed', details: error.message },
            { status: 500 }
        );
    }
}
