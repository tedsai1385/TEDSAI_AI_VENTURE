/**
 * System prompt templates for TEDSAI chatbot
 * Tone: Formal and professional
 */

export const SYSTEM_PROMPT_BASE = `Vous êtes l'assistant virtuel officiel de TEDSAI Complex, un écosystème innovant et durable situé au cœur de la nature.

TEDSAI Complex combine harmonieusement :
- 🌱 **SelecTED Garden** : Agriculture durable et biologique avec traçabilité complète
- 🍽️ **Gastronomie** : Restaurant Vitédia proposant une cuisine raffinée
- 🛍️ **Épicerie fine** : Produits locaux et artisanaux
- 🐑 **Élevage responsable** : Production respectueuse de l'environnement
- 🤖 **Solutions IA** : Technologies innovantes pour entreprises

## INSTRUCTIONS STRICTES :

### Ton et Style
- Utilisez un **ton formel et professionnel** en toutes circonstances
- Réponses **concises et précises** (maximum 150 mots)
- Vouvoiement systématique
- Vocabulaire professionnel et courtois

### Périmètre de Réponse
- Répondez UNIQUEMENT sur les sujets liés à TEDSAI Complex
- Si la question est hors périmètre : "Je suis spécialisé dans l'assistance concernant TEDSAI Complex. Pour d'autres sujets, je vous invite à contacter notre équipe directement."
- Ne **jamais inventer** d'informations

### Structure des Réponses
1. Réponse claire et directe
2. Lien vers page pertinente si applicable (format : \`[Texte du lien](URL)\`)
3. Proposition d'aide complémentaire si nécessaire

### Actions Spéciales
- **Réservation restaurant** : Diriger vers le formulaire de réservation
- **Contact** : Proposer le formulaire de contact
- **Informations produits** : Fournir détails et rediriger vers pages appropriées
- **Questions techniques** : Offrir support escaladé si nécessaire

### En cas d'Incertitude
"Je n'ai pas cette information précise actuellement. Je vous invite à **contacter notre équipe** via [notre formulaire de contact](/contact) ou par téléphone pour obtenir une réponse certaine."

Maintenant, répondez à la question de l'utilisateur :`;

export const SYSTEM_PROMPT_WITH_CONTEXT = (
    siteContent?: string,
    knowledgeBase?: string,
    conversationHistory?: string
) => `${SYSTEM_PROMPT_BASE}

${siteContent ? `\n### INFORMATIONS DU SITE :\n${siteContent}\n` : ''}
${knowledgeBase ? `\n### BASE DE CONNAISSANCES PRIORITAIRE :\n${knowledgeBase}\n` : ''}
${conversationHistory ? `\n### HISTORIQUE DE LA CONVERSATION :\n${conversationHistory}\n` : ''}

---

QUESTION DE L'UTILISATEUR :`;

/**
 * Generate a complete prompt with context
 */
export function buildPrompt(
    userMessage: string,
    options?: {
        siteContent?: string[];
        knowledgeBase?: string[];
        conversationHistory?: { role: string; content: string }[];
    }
): string {
    const { siteContent, knowledgeBase, conversationHistory } = options || {};

    // Format site content
    const formattedSiteContent = siteContent?.length
        ? siteContent.map((content, index) => `${index + 1}. ${content}`).join('\n')
        : undefined;

    // Format knowledge base
    const formattedKnowledge = knowledgeBase?.length
        ? knowledgeBase.map((kb, index) => `${index + 1}. ${kb}`).join('\n')
        : undefined;

    // Format conversation history
    const formattedHistory = conversationHistory?.length
        ? conversationHistory
            .map(msg => `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`)
            .join('\n')
        : undefined;

    const systemPrompt = SYSTEM_PROMPT_WITH_CONTEXT(
        formattedSiteContent,
        formattedKnowledge,
        formattedHistory
    );

    return `${systemPrompt}\n\n${userMessage}`;
}

/**
 * Extract action hints from user message
 */
export function detectUserIntent(message: string): {
    type: 'reservation' | 'contact' | 'info' | 'general';
    confidence: number;
} {
    const lowerMessage = message.toLowerCase();

    // Reservation keywords
    if (
        lowerMessage.includes('réserv') ||
        lowerMessage.includes('table') ||
        lowerMessage.includes('rendez-vous') ||
        lowerMessage.includes('booking')
    ) {
        return { type: 'reservation', confidence: 0.9 };
    }

    // Contact keywords
    if (
        lowerMessage.includes('contact') ||
        lowerMessage.includes('appel') ||
        lowerMessage.includes('téléphone') ||
        lowerMessage.includes('email') ||
        lowerMessage.includes('écri')
    ) {
        return { type: 'contact', confidence: 0.8 };
    }

    // Info keywords
    if (
        lowerMessage.includes('produit') ||
        lowerMessage.includes('service') ||
        lowerMessage.includes('prix') ||
        lowerMessage.includes('horaire') ||
        lowerMessage.includes('menu')
    ) {
        return { type: 'info', confidence: 0.7 };
    }

    return { type: 'general', confidence: 0.5 };
}
