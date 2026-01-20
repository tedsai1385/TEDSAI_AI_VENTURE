'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Brain,
  Utensils,
  Leaf,
  MessageSquare,
  MapPin,
  Clock,
  ShoppingCart,
  Globe,
  User,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useGoogleGenerativeAI } from '@/hooks/useGoogleGenerativeAI';
import { useRouter } from 'next/navigation';
import { useChatbot } from '@/context/ChatbotContext';
// Types pour le chatbot
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: QuickReply[];
};

type QuickReply = {
  label: string;
  action: string;
  icon?: React.ReactNode;
};

type ChatbotState = {
  isMinimized: boolean;
  isTyping: boolean;
  messages: Message[];
  currentInput: string;
  showShortcuts: boolean;
};

// Configuration directe dans le composant pour éviter les problèmes d'import
const CHATBOT_CONFIG = {
  AUTO_OPEN_DELAY: 10000, // 10 secondes (Confirmé)
  BOT_NAME: 'TED - Assistant Intelligent',
  WELCOME_MESSAGES: {
    DEFAULT: "Bonjour ! Je suis TED, votre assistant intelligent. Je peux vous aider à découvrir l'écosystème TEDSAI, trouver des informations sur nos services, ou vous guider dans votre parcours. Comment puis-je vous aider aujourd'hui ?",
    MORNING: "Bonjour ! Je suis TED, votre assistant intelligent. Belle journée à vous ! Comment puis-je vous aider aujourd'hui ?",
    AFTERNOON: "Bon après-midi ! Je suis TED, votre assistant intelligent. Comment puis-je vous aider ?",
    EVENING: "Bonsoir ! Je suis TED, votre assistant intelligent. Puis-je vous aider en quoi que ce soit ?"
  },
  THEME_COLORS: {
    PRIMARY_GRADIENT: 'from-blue-600 to-purple-600',
    BACKGROUND: 'bg-gray-50',
    USER_BUBBLE: 'bg-blue-600',
    BOT_BUBBLE: 'bg-white'
  },
  QUICK_ACCESS_PAGES: [
    { label: 'IA', href: '/solutions-ia', icon: '🧠', color: 'bg-blue-500' },
    { label: 'Resto', href: '/vitedia', icon: '🍽️', color: 'bg-amber-500' },
    { label: 'Jardin', href: '/garden', icon: '🌱', color: 'bg-green-500' },
    { label: 'Éco', href: '/ecosystem', icon: '🌍', color: 'bg-purple-500' },
    { label: 'Contact', href: '/contact', icon: '📞', color: 'bg-gray-500' },
    { label: 'Boutique', href: '/shop', icon: '🛒', color: 'bg-orange-500' },
  ],
  INITIAL_QUICK_REPLIES: [
    { label: 'Services IA', action: 'ia', icon: '🧠' },
    { label: 'Restaurant', action: 'restaurant', icon: '🍽️' },
    { label: 'Jardin & Produits', action: 'garden', icon: '🌱' },
    { label: 'Contact', action: 'contact', icon: '📞' },
  ],
  MAX_MESSAGE_LENGTH: 1000,
  MAX_HISTORY_SIZE: 50,
  FEATURES: {
    ENABLE_AUTO_OPEN: true,
    ENABLE_TYPING_INDICATOR: true,
    ENABLE_QUICK_REPLIES: true,
    ENABLE_CONTEXT_AWARENESS: true,
    ENABLE_MULTILINGUAL: true,
    ENABLE_FEEDBACK: true
  },
  SUPPORTED_LANGUAGES: ['fr', 'en'],
  DEFAULT_LANGUAGE: 'fr',
  PRIVACY_SETTINGS: {
    STORE_USER_DATA: true,
    ANONYMIZE_IP: true,
    CONSENT_REQUIRED: false
  }
};

const getWelcomeMessageByTime = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return CHATBOT_CONFIG.WELCOME_MESSAGES.MORNING;
  } else if (hour >= 12 && hour < 18) {
    return CHATBOT_CONFIG.WELCOME_MESSAGES.AFTERNOON;
  } else {
    return CHATBOT_CONFIG.WELCOME_MESSAGES.EVENING;
  }
};

const TED_CHATBOT_NAME = CHATBOT_CONFIG.BOT_NAME;
const WELCOME_MESSAGE = getWelcomeMessageByTime();
const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { label: 'Services IA', action: 'ia', icon: <Brain className="w-4 h-4" /> },
  { label: 'Restaurant', action: 'restaurant', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Jardin & Produits', action: 'garden', icon: <Leaf className="w-4 h-4" /> },
  { label: 'Contact', action: 'contact', icon: <MessageSquare className="w-4 h-4" /> },
];

export default function TEDChatbot() {
  const { isOpen, setIsOpen, toggleChat, closeChat } = useChatbot();
  const [state, setState] = useState<ChatbotState>({
    isMinimized: false,
    isTyping: false,
    messages: [{
      id: 'welcome',
      content: WELCOME_MESSAGE,
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: INITIAL_QUICK_REPLIES
    }],
    currentInput: '',
    showShortcuts: false // Fermé par défaut
  });

  const [showWelcomeAfterDelay, setShowWelcomeAfterDelay] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { sendMessage } = useGoogleGenerativeAI();

  // Afficher le message de bienvenue après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAfterDelay(true);
      setIsOpen(true);
    }, CHATBOT_CONFIG.AUTO_OPEN_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Fermer le message de bienvenue automatique après interaction
  useEffect(() => {
    if (state.messages.length > 1) {
      setShowWelcomeAfterDelay(false);
    }
  }, [state.messages]);

  // Scroller vers le bas quand les messages changent
  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const minimizeChat = () => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  };

  const toggleShortcuts = () => {
    setState(prev => ({
      ...prev,
      showShortcuts: !prev.showShortcuts
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      currentInput: e.target.value
    }));
  };

  const handleQuickReplyClick = (action: string) => {
    switch (action) {
      case 'ia':
        router.push('/solutions-ia');
        break;
      case 'restaurant':
        router.push('/vitedia');
        break;
      case 'garden':
        router.push('/garden');
        break;
      case 'contact':
        router.push('/contact');
        break;
      default:
        break;
    }
    addMessage(`Je voudrais en savoir plus sur ${action}`, 'user');
  };

  const addMessage = (content: string, sender: 'user' | 'bot', quickReplies?: QuickReply[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      ...(quickReplies && { quickReplies })
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      currentInput: sender === 'user' ? '' : prev.currentInput
    }));
  };

  const handleSendMessage = async () => {
    if (!state.currentInput.trim()) return;

    // Ajouter le message de l'utilisateur
    addMessage(state.currentInput, 'user');

    // Simuler la saisie du bot
    setState(prev => ({ ...prev, isTyping: true }));

    try {
      // Utiliser l'API Google Generative AI pour générer une réponse
      const response = await sendMessage(state.currentInput);

      // Ajouter la réponse du bot
      addMessage(response, 'bot', INITIAL_QUICK_REPLIES);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      addMessage("Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?", 'bot', INITIAL_QUICK_REPLIES);
    }

    // Arrêter l'indicateur de saisie
    setState(prev => ({ ...prev, isTyping: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Boutons rapides pour accéder aux pages
  const quickAccessButtons = CHATBOT_CONFIG.QUICK_ACCESS_PAGES.map(page => {
    const iconMap: Record<string, React.ReactNode> = {
      '🧠': <Brain className="w-4 h-4" />,
      '🍽️': <Utensils className="w-4 h-4" />,
      '🌱': <Leaf className="w-4 h-4" />,
      '🌍': <MapPin className="w-4 h-4" />,
      '📞': <MessageSquare className="w-4 h-4" />,
      '🛒': <ShoppingCart className="w-4 h-4" />,
    };

    return {
      label: page.label,
      href: page.href,
      icon: iconMap[page.icon as keyof typeof iconMap] || <MapPin className="w-4 h-4" />,
      color: page.color
    };
  });

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat - Style de l'ancienne interface */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={toggleChat}
              className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-white/20"
              aria-label="Ouvrir le chatbot TED"
            >
              <img
                src="/assets/images/logos/tedsai_logo.jpg"
                alt="Chat"
                className="w-full h-full object-cover opacity-0 group-hover:opacity-100 absolute inset-0 transition-opacity duration-300"
              />
              <Bot className="w-7 h-7 text-white group-hover:opacity-0 transition-opacity duration-300" />
            </button>

            {/* Petit indicateur pulsant */}
            {!showWelcomeAfterDelay && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de bienvenue automatique */}
      <AnimatePresence>
        {showWelcomeAfterDelay && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-40 max-w-xs bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{TED_CHATBOT_NAME}</p>
                <p className="text-xs text-gray-600 mt-1">{WELCOME_MESSAGE}</p>
              </div>
              <button
                onClick={() => setShowWelcomeAfterDelay(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[90vw] max-w-[340px] md:max-w-md h-[60vh] md:h-[70vh] flex flex-col"
          >
            <Card className="flex flex-col h-full shadow-xl border-0 rounded-xl overflow-hidden">
              {/* En-tête du chatbot */}
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm md:text-base font-bold">{TED_CHATBOT_NAME}</CardTitle>
                      <p className="text-[10px] md:text-xs opacity-80">Toujours là pour vous aider</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={minimizeChat}
                      className="text-white hover:bg-white/10 p-1 md:p-2 h-7 w-7 md:h-9 md:w-9"
                    >
                      {state.isMinimized ? '+' : '−'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeChat}
                      className="text-white hover:bg-white/10 p-1 md:p-2 h-7 w-7 md:h-9 md:w-9"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Corps du chat */}
              {!state.isMinimized && (
                <>
                  <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                    {/* Zone de messages */}
                    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
                      {state.messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.sender === 'bot' && (
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Bot className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                                </div>
                              )}
                              <p className="text-xs md:text-sm">{message.content}</p>
                              {message.sender === 'user' && (
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <User className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {state.isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white text-gray-800 rounded-2xl px-4 py-2 rounded-bl-none border border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Section Raccourcis Réductible */}
                    <div className="border-t border-gray-200">
                      <button
                        onClick={toggleShortcuts}
                        className="w-full py-2 px-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span>Raccourcis & Suggestions</span>
                        </div>
                        {state.showShortcuts ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {state.showShortcuts && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50 shadow-inner"
                          >
                            <div className="p-3 space-y-3">
                              {/* Boutons d'accès rapide aux pages */}
                              <div className="flex flex-wrap gap-2">
                                {quickAccessButtons.map((btn, index) => (
                                  <motion.button
                                    key={btn.href}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => router.push(btn.href)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white ${btn.color} hover:opacity-90 transition-all shadow-sm hover:shadow-md border border-white/20`}
                                  >
                                    {btn.icon}
                                    <span className="font-medium">{btn.label}</span>
                                  </motion.button>
                                ))}
                              </div>

                              {/* Réponses rapides (IA) */}
                              {state.messages[state.messages.length - 1]?.quickReplies && (
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/50">
                                  {state.messages[state.messages.length - 1]?.quickReplies?.map((reply, index) => (
                                    <motion.button
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.03 }}
                                      onClick={() => handleQuickReplyClick(reply.action)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 rounded-full text-xs font-medium transition-all shadow-sm hover:shadow-md"
                                    >
                                      <span className="text-sm">{reply.icon}</span>
                                      {reply.label}
                                    </motion.button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={state.currentInput}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Posez votre question..."
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!state.currentInput.trim() || state.isTyping}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {state.isTyping ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence >
    </>
  );
}