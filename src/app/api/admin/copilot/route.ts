import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// System prompt for TED-Bot
const SYSTEM_PROMPT = `Tu es TED-Bot, l'assistant intelligent du dashboard admin TEDSAI Complex.

Contexte TEDSAI :
- Restaurant viTEDia : Gastronomie camerounaise moderne
- SelecTED Garden : Production bio avec traçabilité
- Boutique : Vente produits locaux
- Solutions IA B2B

Tes capacités :
1. Générer descriptions SEO optimisées pour produits/plats
2. Prévoir ruptures de stock (historique + saisonnalité)
3. Créer promos anti-gaspillage automatiques
4. Génerer outlines d'articles blog

Règles :
- Réponds de manière concise et actionnable
- Utilise le contexte camerounais (FCFA, produits locaux)
- Propose des actions concrètes, pas que de la théorie
- Reste dans le domaine TEDSAI (IA, Restaurant, Garden, Élevage)

Réponds en français.`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message requis' },
                { status: 400 }
            );
        }

        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key non configurée' },
                { status: 500 }
            );
        }

        // Generate response with Gemini
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Compris ! Je suis TED-Bot, assistant du dashboard TEDSAI. Comment puis-je vous aider ?' }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return NextResponse.json({
            response,
            model: 'gemini-1.5-flash',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Copilot API error:', error);

        return NextResponse.json(
            {
                error: 'Erreur lors de la génération',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// Rate limiting (à implémenter avec Redis ou Upstash)
// TODO Phase 2.1 : Ajouter rate limiting (60 req/min par user)
// TODO Phase 2.1 : Ajouter audit logging des actions IA
// TODO Phase 2.1 : Ajouter cache responses fréquentes
