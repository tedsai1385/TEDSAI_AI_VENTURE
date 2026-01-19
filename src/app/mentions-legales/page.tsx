'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function MentionsLegales() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setHasAskedQuestion(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId: 'legal-page-user',
          sessionId: 'legal-session-' + Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Quick legal questions
  const quickQuestions = [
    { id: 'editor', text: 'Qui est l\'éditeur du site ?' },
    { id: 'host', text: 'Qui héberge le site ?' },
    { id: 'ip', text: 'Quels sont les droits de propriété intellectuelle ?' },
    { id: 'privacy', text: 'Quelle est la politique de confidentialité ?' },
    { id: 'contact', text: 'Comment contacter l\'équipe légale ?' },
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      const form = document.getElementById('legal-chat-form') as HTMLFormElement;
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="relative">
      <div className="container" style={{ padding: '8rem 0 4rem', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Mentions Légales</h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>1. ÉDITEUR DU SITE</h2>
          <p><strong>Raison sociale :</strong> TEDSAI Complex SARL</p>
          <p><strong>Siège social :</strong> Yaoundé, Cameroun</p>
          <p><strong>Capital social :</strong> [À compléter] FCFA</p>
          <p><strong>RCCM :</strong> [À compléter]</p>
          <p><strong>NIF :</strong> [À compléter]</p>
          <p><strong>Téléphone :</strong> +237 XXX XXX XXX</p>
          <p><strong>Email :</strong> contact@tedsai.cm</p>
          <p><strong>Directeur de la publication :</strong> Martial TEDSAI</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>2. HÉBERGEMENT</h2>
          <p><strong>Hébergeur :</strong> Vercel Inc.</p>
          <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789</p>
          <p><strong>Téléphone :</strong> +1 (559) 288-7060</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>3. PROPRIÉTÉ INTELLECTUELLE</h2>
          <p>
            L'ensemble du site (structure, textes, images, logos, vidéos) est protégé par le droit d'auteur.
            Toute reproduction sans autorisation est interdite.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Marques déposées :</strong><br />
            • TEDSAI™<br />
            • viTEDia™<br />
            • SelecTED Garden™
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>4. DONNÉES PERSONNELLES & COOKIES</h2>
          <p>
            Veuillez consulter notre <a href="/confidentialite" style={{ color: 'var(--color-secondary)' }}>Politique de Confidentialité</a> pour plus d'informations.
          </p>
        </section>

        <section>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '1rem' }}>5. CONTACT</h2>
          <p>
            Pour toute question juridique : <a href="mailto:legal@tedsai.cm" style={{ color: 'var(--color-secondary)' }}>legal@tedsai.cm</a>
          </p>
        </section>

        {/* Legal Q&A Section */}
        <section style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>Questions Fréquentes sur les Mentions Légales</h2>

          <div className="mb-4">
            <button
              onClick={toggleChat}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {isChatOpen ? 'Fermer le Chat Légal' : 'Poser une Question Légale'}
            </button>
          </div>

          {isChatOpen && (
            <div className="mt-4 border rounded-lg overflow-hidden shadow-lg bg-white">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Assistant Légal TED</h3>
                      <p className="text-sm opacity-80">Toujours disponible pour répondre à vos questions légales</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                    <span className="text-sm">En ligne</span>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Bienvenue sur le Chat Légal</h3>
                    <p className="text-gray-600 mb-6">Posez vos questions sur les mentions légales</p>

                    {!hasAskedQuestion && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                        {quickQuestions.map((question) => (
                          <button
                            key={question.id}
                            onClick={() => handleQuickQuestion(question.text)}
                            className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                          >
                            {question.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white rounded-tr-none'
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div
                            className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-200 shadow-sm">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSubmit} id="legal-chat-form" className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Posez votre question légale..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.16-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Notre assistant légal utilise l'intelligence artificielle pour répondre à vos questions
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
