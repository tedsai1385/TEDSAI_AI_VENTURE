/**
 * WhatsApp Notifications Service
 * Phase 2.3 - TEDSAI Admin Dashboard
 * 
 * Envoie notifications WhatsApp via Twilio WhatsApp Business API
 */

export interface WhatsAppNotification {
    to: string; // Format: +237XXXXXXXXX
    message: string;
    template?: 'order_confirmed' | 'order_ready' | 'order_delivered' | 'stock_alert';
}

/**
 * Envoyer une notification WhatsApp
 * TODO Phase 2.3: Intégrer Twilio WhatsApp Business API
 */
export async function sendWhatsAppNotification(notification: WhatsAppNotification): Promise<boolean> {
    console.log('[WhatsApp] Notification à envoyer:', notification);

    // TODO Phase 2.3: Implémenter avec Twilio
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const from = process.env.TWILIO_WHATSAPP_NUMBER; // whatsapp:+14155238886

    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   from: from,
    //   to: `whatsapp:${notification.to}`,
    //   body: notification.message
    // });

    // Simulation pour Phase 2.3
    return true;
}

/**
 * Templates de messages WhatsApp
 */
export const WhatsAppTemplates = {
    orderConfirmed: (orderid: string, totalAmount: number) => `
🌱 *TEDSAI - Commande Confirmée*

Votre commande #${orderid} a été confirmée !

Montant : ${totalAmount.toLocaleString()} FCFA
Statut : En préparation

Nous vous tiendrons informé de l'avancement.

_De la Data à l'Assiette_ 🍽️
  `.trim(),

    orderReady: (orderid: string, deliveryAddress?: string) => `
✅ *TEDSAI - Commande Prête*

Votre commande #${orderid} est prête !

${deliveryAddress ? `Adresse de livraison : ${deliveryAddress}` : 'À récupérer sur place'}

Merci pour votre confiance ! 🌱
  `.trim(),

    orderDelivered: (orderid: string) => `
🎉 *TEDSAI - Commande Livrée*

Votre commande #${orderid} a été livrée avec succès !

Merci d'avoir choisi TEDSAI Complex.
N'hésitez pas à nous laisser un avis.

_L'Algorithme Organique_ 🌿
  `.trim(),

    stockAlert: (productName: string, daysRemaining: number) => `
⚠️ *ALERT STOCK - TEDSAI Admin*

Rupture imminente : ${productName}
Jours restants : ${daysRemaining}

Action requise : Planifier récolte ou commande fournisseur

Dashboard : https://tedsai.cm/admin/garden
  `.trim(),
};
