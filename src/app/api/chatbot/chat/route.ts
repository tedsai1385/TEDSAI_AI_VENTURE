import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini/client';
import { detectUserIntent } from '@/lib/gemini/prompts';
import { adminDb } from '@/lib/firebase/admin';
import fs from 'fs';
import path from 'path';

// Load site content from JSON file
function loadSiteContent() {
    try {
        const filePath = path.join(process.cwd(), 'assets', 'data', 'site-content-index.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.warn('⚠️ Site content index not found');
        return null;
    }
}

// Load knowledge base from Firestore OR fallback to local
async function loadKnowledgeBase() {
    // Try Firestore first
    if (adminDb) {
        try {
            const snapshot = await adminDb
                .collection('chatbot_knowledge')
                .where('active', '==', true)
                .orderBy('priority', 'desc')
                .limit(20)
                .get();

            const data = snapshot.docs.map(doc => doc.data());
            if (data.length > 0) {
                console.log(`✅ Loaded ${data.length} entries from Firestore`);
                return data;
            }
        } catch (error) {
            console.warn('⚠️ Firestore unavailable:', error);
        }
    }

    // Fallback to local knowledge
    console.log('📁 Using local fallback knowledge base');
    return [
        {
            question: "Comment réserver au restaurant ?",
            answer: "Vous pouvez réserver directement via notre site web à la section viTEDia, ou en nous contactant à contact@tedsai.cm",
            category: "restaurant",
            keywords: ["réservation", "booking", "vitedia"]
        },
        {
            question: "Quels sont vos services en IA ?",
            answer: "TEDSAI propose du consulting IA, de l'automatisation, du Machine Learning, de la Computer Vision et du traitement du langage naturel pour les entreprises.",
            category: "ia",
            keywords: ["ia", "intelligence artificielle", "services"]
        }
    ];
}

function buildEnrichedPrompt(siteContent: any, knowledgeBase: any[]) {
    let context = `Tu es TED, l'assistant intelligent de TEDSAI Complex au Cameroun.\n\n`;
    context += `TEDSAI combine agriculture durable, restaurant gastronomique (viTEDia), et solutions IA pour entreprises.\n\n`;

    if (siteContent && siteContent.pages) {
        context += `PAGES DU SITE :\n`;
        siteContent.pages.forEach((p: any) => context += `- ${p.title}: ${p.content.substring(0, 200)}...\n`);
    }

    if (siteContent && siteContent.services) {
        context += `\nSERVICES :\n`;
        siteContent.services.forEach((s: any) => context += `- ${s.name}: ${s.description}\n`);
    }

    if (knowledgeBase.length > 0) {
        context += `\nCONNAISSANCES :\n`;
        knowledgeBase.forEach((kb: any) => context += `Q: ${kb.question}\nR: ${kb.answer}\n\n`);
    }

    if (siteContent && siteContent.faq) {
        context += `\nFAQ :\n`;
        siteContent.faq.forEach((faq: any) => context += `Q: ${faq.question}\nR: ${faq.answer}\n`);
    }

    context += `\nINSTRUCTIONS :
- Réponds en français de manière concise (max 150 mots), professionnelle et chaleureuse
- Utilise le vouvoiement
- Si tu ne sais pas, propose de contacter contact@tedsai.cm
- Inclus des liens vers les pages pertinentes quand utile
- Reste dans le domaine TEDSAI (IA, Restaurant, garden, Élevage)\n`;

    return context;
}

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory = [] } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message requis', response: 'Veuillez envoyer un message.' },
                { status: 400 }
            );
        }

        // Load data
        const siteContent = loadSiteContent();
        const knowledgeBase = await loadKnowledgeBase();
        const intent = detectUserIntent(message);

        // Build system instruction
        const systemInstruction = buildEnrichedPrompt(siteContent, knowledgeBase);

        // Initialize Gemini with latest compatible model
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest', // Utilisation du modèle flash-latest pour assurer la compatibilité et le quota
            systemInstruction: systemInstruction,
        });

        // Chat with history
        const chat = model.startChat({
            history: conversationHistory.map((msg: any) => ({
                role: msg.role === 'assistant' || msg.role === 'bot' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const aiText = response.text();

        // Actions
        const actions = [];
        if (intent.type === 'reservation') {
            actions.push({
                type: 'reservation',
                label: 'Réserver au restaurant',
                url: '/vitedia#reservation'
            });
        }
        if (intent.type === 'contact') {
            actions.push({
                type: 'contact',
                label: 'Nous contacter',
                url: '/contact'
            });
        }

        return NextResponse.json({
            response: aiText,
            actions,
            intent: intent.type,
            metadata: {
                firebaseActive: !!adminDb,
                knowledgeEntries: knowledgeBase.length
            }
        });
    } catch (error: any) {
        console.error('❌ Chatbot API error:', error);
        return NextResponse.json(
            {
                error: 'Erreur technique',
                response: 'Désolé, je rencontre une difficulté technique. Veuillez réessayer dans quelques instants ou nous contacter à contact@tedsai.cm'
            },
            { status: 500 }
        );
    }
}
