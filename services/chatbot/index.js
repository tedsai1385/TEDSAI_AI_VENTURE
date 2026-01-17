const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());
// Configure CORS to allow requests from the frontend domain
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['POST']
}));

// Initialize Firestore
const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `Tu es TED, l'assistant virtuel du Complexe TEDSAI (Technologie, Éducation, Développement, Services, Agriculture, Innovation).
Ton rôle est d'aider les visiteurs du site, les clients du restaurant viTEDia et les partenaires du Jardin SelecTED.
Ton ton est professionnel, chaleureux, innovant et africain.
Tu connais tout sur le complexe :
- Restaurant viTEDia : Cuisine fusion, traçabilité QR code, chef Jean K.
- Jardin SelecTED : Agriculture urbaine, produits bio, hydroponie.
- Formations : IA, agriculture, entrepreneuriat.
- Observatoire : Données sur l'agritech au Cameroun.
Réponds de manière concise et utile.`;

app.get('/', (req, res) => {
    res.send('TEDSAI Chatbot Service is running');
});

app.post('/chat', async (req, res) => {
    try {
        const { message, sessionId, userId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Prepare history/context if needed, for this MVP we do single turn or simple history from firestore could be added
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_INSTRUCTION }],
                },
                {
                    role: "model",
                    parts: [{ text: "Bien reçu. Je suis TED, prêt à aider." }],
                }
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        // Persist to Firestore asynchronously
        if (sessionId) {
            const sessionRef = firestore.collection('chatSessions').doc(sessionId);
            await sessionRef.set({
                userId: userId || 'anonymous',
                lastActive: new Date(),
                messages: Firestore.FieldValue.arrayUnion(
                    { role: 'user', content: message, timestamp: new Date() },
                    { role: 'assistant', content: response, timestamp: new Date() }
                )
            }, { merge: true }).catch(err => console.error('Firestore save error:', err));
        }

        res.json({ response });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Chatbot service listening on port ${PORT}`);
});
