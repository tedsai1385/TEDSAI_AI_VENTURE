import { useState } from 'react';

export const useGoogleGenerativeAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          // On pourrait envoyer l'historique ici si besoin
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('API returned error:', data.error);
        return "Désolé, je rencontre un problème technique momentané. Veuillez réessayer.";
      }

      return data.response;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Chatbot:', error);
      return "Désolé, je n'arrive pas à joindre mes services cognitifs. Vérifiez votre connexion internet.";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
