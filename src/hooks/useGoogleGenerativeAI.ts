import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Récupérer la clé API depuis les variables d'environnement
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY) {
  console.warn('La clé API Google Generative AI n\'est pas définie. Le chatbot fonctionnera en mode simulation.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

export const useGoogleGenerativeAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string): Promise<string> => {
    if (!model) {
      // Mode simulation si aucune clé API n'est disponible
      return simulateResponse(message);
    }

    setIsLoading(true);

    try {
      // Obtenir le contexte de la page actuelle pour enrichir la réponse
      const currentPage = typeof window !== 'undefined' ? window.location.pathname : '';

      // Construire un prompt contextuel
      const contextPrompt = `
        Tu es TED, l'assistant intelligent de TEDSAI Complex.
        L'utilisateur est actuellement sur la page: ${currentPage}.
        Sa question est: "${message}"

        Réponds de manière utile, précise et en lien avec l'écosystème TEDSAI.
        Si la question concerne un service spécifique (IA, restaurant, jardin, etc.),
        fournis des informations pertinentes et propose des liens vers les bonnes pages.

        Réponds en français, avec un ton professionnel mais chaleureux.
        Ta réponse doit être concise mais informative.
      `;

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Google Generative AI:', error);
      return "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};

// Fonction de simulation pour le mode hors ligne
const simulateResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut') || lowerMsg.includes('hello')) {
    return "Bonjour ! Je suis TED, votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?";
  } else if (lowerMsg.includes('ia') || lowerMsg.includes('intelligence') || lowerMsg.includes('automatisation')) {
    return "Nos solutions d'intelligence artificielle incluent l'automatisation intelligente, les chatbots personnalisés et l'analyse prédictive. Pour en savoir plus, visitez la page Solutions IA.";
  } else if (lowerMsg.includes('restaurant') || lowerMsg.includes('menu') || lowerMsg.includes('nourriture')) {
    return "Le restaurant viTEDia propose une gastronomie traçable avec des produits du jardin SelecTED. Découvrez notre menu sur la page Restaurant.";
  } else if (lowerMsg.includes('jardin') || lowerMsg.includes('produit') || lowerMsg.includes('bio')) {
    return "Le jardin SelecTED cultive des produits bio et traçables. Visitez notre boutique pour découvrir nos produits frais.";
  } else if (lowerMsg.includes('contact') || lowerMsg.includes('support')) {
    return "Vous pouvez nous contacter via le formulaire de contact ou par téléphone au +237 6XX XX XX XX.";
  } else if (lowerMsg.includes('prix') || lowerMsg.includes('tarif') || lowerMsg.includes('coût')) {
    return "Pour connaître nos tarifs, rendez-vous sur la page correspondante à chaque service. Nous avons des options adaptées à différents besoins.";
  } else if (lowerMsg.includes('horaire') || lowerMsg.includes('ouvert')) {
    return "Le restaurant viTEDia est ouvert de 11h à 23h. Le jardin SelecTED propose des visites les samedis matin.";
  } else {
    return "Merci pour votre question ! Je suis TED, l'assistant intelligent de TEDSAI Complex. Je peux vous aider à découvrir nos services d'intelligence artificielle, notre restaurant viTEDia, notre jardin SelecTED et bien plus encore. Que souhaitez-vous savoir ?";
  }
};
