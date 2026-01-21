import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/gemini/client';
import { buildPrompt, detectUserIntent } from '@/lib/gemini/prompts';
import { searchSiteContent } from '@/services/chatbot/site-indexer';

// Rate limiting (simple in-memory implementation for POC)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // messages per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userLimit = requestCounts.get(identifier);

    if (!userLimit || now > userLimit.resetTime) {
        requestCounts.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}

/**
 * Extract keywords from user message for site content search
 */
function extractKeywords(message: string): string[] {
    const lowerMessage = message.toLowerCase();

    // Define keyword mapping for better search
    const keywordMap = {
        'ia': ['ia', 'intelligence', 'artificielle'],
        'restaurant': ['restaurant', 'vitedia', 'manger', 'cuisine'],
        'jardin': ['jardin', 'garden', 'légumes', 'bio'],
        'épicerie': ['épicerie', 'boutique', 'shop', 'produits'],
        'élevage': ['élevage', 'viande', 'animaux'],
        'réservation': ['réservation', 'réserver', 'booking'],
        'contact': ['contact', 'email', 'téléphone'],
    };

    const keywords: string[] = [];

    for (const [key, values] of Object.entries(keywordMap)) {
        if (values.some(val => lowerMessage.includes(val))) {
            keywords.push(...values);
        }
    }

    return keywords.length > 0 ? keywords : ['tedsai', 'complex'];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory } = body;

        // Validation
        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required and must be a string' },
                { status: 400 }
            );
        }

        if (message.length > 500) {
            return NextResponse.json(
                { error: 'Message is too long (max 500 characters)' },
                { status: 400 }
            );
        }

        // Rate limiting
        const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(clientIp)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Detect user intent
        const intent = detectUserIntent(message);

        // Extract keywords and search site content
        const keywords = extractKeywords(message);
        const relevantPages = await searchSiteContent(keywords);

        // Format site content for prompt
        const siteContent = relevantPages.map(page =>
            `[${page.title}](${page.url}): ${page.content}`
        );

        // Build prompt with site context
        const prompt = buildPrompt(message, {
            siteContent: siteContent.length > 0 ? siteContent : undefined,
            conversationHistory: conversationHistory || [],
        });

        // Generate response
        const response = await generateChatCompletion(prompt, conversationHistory);

        // Prepare response with actions
        const actions = [];
        if (intent.type === 'reservation' && intent.confidence > 0.7) {
            actions.push({
                type: 'reservation',
                label: 'Faire une réservation',
                url: '/vitedia#reservation',
            });
        }
        if (intent.type === 'contact' && intent.confidence > 0.7) {
            actions.push({
                type: 'contact',
                label: 'Nous contacter',
                url: '/contact',
            });
        }

        // Add relevant page links
        const links = relevantPages.slice(0, 2).map(page => ({
            title: page.title,
            url: page.url,
        }));

        return NextResponse.json({
            response,
            actions,
            links: links.length > 0 ? links : undefined,
            intent: intent.type,
        });
    } catch (error) {
        console.error('Chatbot API error:', error);
        return NextResponse.json(
            {
                error: 'Une erreur est survenue. Veuillez réessayer.',
                response: 'Je suis désolé, je rencontre actuellement une difficulté technique. Veuillez réessayer dans quelques instants ou **[contacter notre équipe](/contact)** directement.',
            },
            { status: 500 }
        );
    }
}
