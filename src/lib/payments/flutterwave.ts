/**
 * Flutterwave Payment Integration
 * Phase 2.4 - TEDSAI Admin Dashboard
 * 
 * Gestion paiements Mobile Money (MTN MoMo, Orange Money)
 */

export type PaymentMethod = 'momo_mtn' | 'momo_orange' | 'card' | 'cash';

export interface PaymentRequest {
    amount: number;
    currency: string; // 'XAF' pour FCFA
    customerEmail: string;
    customerPhone: string;
    customerName: string;
    orderId: string;
    paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    paymentLink?: string;
    error?: string;
}

/**
 * Initier un paiement Flutterwave
 * TODO Phase 2.4: Implémenter avec Flutterwave SDK
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log('[Flutterwave] Paiement initié:', request);

    // TODO Phase 2.4: Implémenter avec Flutterwave
    // const Flutterwave = require('flutterwave-node-v3');
    // const flw = new Flutterwave(
    //   process.env.FLW_PUBLIC_KEY,
    //   process.env.FLW_SECRET_KEY
    // );

    // const payload = {
    //   tx_ref: `TEDSAI-${request.orderId}-${Date.now()}`,
    //   amount: request.amount,
    //   currency: request.currency,
    //   payment_options: request.paymentMethod === 'momo_mtn' ? 'mobilemoneyrwanda' : 'mobilemoney',
    //   customer: {
    //     email: request.customerEmail,
    //     phone_number: request.customerPhone,
    //     name: request.customerName,
    //   },
    //   customizations: {
    //     title: 'TEDSAI Complex',
    //     description: `Commande #${request.orderId}`,
    //     logo: 'https://tedsai.cm/logo.png',
    //   },
    //   redirect_url: `https://tedsai.cm/api/payments/verify`,
    // };

    // const response = await flw.Charge.card(payload);
    // return {
    //   success: true,
    //   transactionId: response.data.id,
    //   paymentLink: response.data.link,
    // };

    // Simulation pour Phase 2.4
    return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        paymentLink: `https://checkout.flutterwave.com/mock/${request.orderId}`,
    };
}

/**
 * Vérifier le statut d'un paiement
 * TODO Phase 2.4: Implémenter vérification
 */
export async function verifyPayment(transactionId: string): Promise<{
    status: 'pending' | 'successful' | 'failed';
    amount?: number;
}> {
    console.log('[Flutterwave] Vérification paiement:', transactionId);

    // TODO Phase 2.4: Appel API Flutterwave
    // const response = await flw.Transaction.verify({ id: transactionId });
    // return {
    //   status: response.data.status === 'successful' ? 'successful' : 'failed',
    //   amount: response.data.amount,
    // };

    return {
        status: 'successful',
        amount: 15000,
    };
}

/**
 * Configuration Flutterwave
 * Commission : 1.4% + 100 FCFA
 */
export const FlutterwaveConfig = {
    publicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
    secretKey: process.env.FLW_SECRET_KEY || '',
    webhookSecret: process.env.FLW_WEBHOOK_SECRET || '',
    commission: 0.014, // 1.4%
    fixedFee: 100, // FCFA
    calculateFees: (amount: number) => ({
        commission: amount * 0.014,
        fixedFee: 100,
        total: amount * 0.014 + 100,
    }),
};
