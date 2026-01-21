import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration for TEDSAI chatbot
export const modelConfig = {
    model: 'gemini-pro', // Stable and widely supported
    generationConfig: {
        temperature: 0.7, // Balance between creativity and precision
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
    },
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
};

// Get configured model instance
export function getModel(): GenerativeModel {
    return genAI.getGenerativeModel(modelConfig);
}

// Helper function to generate chat completion
export async function generateChatCompletion(
    prompt: string,
    conversationHistory?: { role: string; content: string }[]
): Promise<string> {
    try {
        const model = getModel();

        // If there's conversation history, use chat mode
        if (conversationHistory && conversationHistory.length > 0) {
            const chat = model.startChat({
                history: conversationHistory.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            return response.text();
        }

        // Otherwise, use simple generation
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating chat completion:', error);
        throw new Error('Failed to generate response from Gemini');
    }
}
