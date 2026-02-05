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
    PRIMARY_GRADIENT: 'from-blue-600 to-blue-800',
    BACKGROUND: 'bg-gray-50',
    USER_BUBBLE: 'bg-blue-600',
    BOT_BUBBLE: 'bg-white'
  },
  QUICK_ACCESS_PAGES: [
    { label: 'IA', href: '/solutions-ia', icon: '🧠', color: 'bg-blue-500' },
    { label: 'Resto', href: '/vitedia', icon: '🍽️', color: 'bg-amber-500' },
    { label: 'Garden', href: '/Garden-selected', icon: '🌱', color: 'bg-green-500' },
    { label: 'Éco', href: '/ecosystem', icon: '🌍', color: 'bg-blue-600' },
    { label: 'Contact', href: '/contact', icon: '📞', color: 'bg-gray-500' },
    { label: 'Boutique', href: '/shop', icon: '🛒', color: 'bg-orange-500' },
  ],
  INITIAL_QUICK_REPLIES: [
    { label: 'Services IA', action: 'ia', icon: '🧠' },
    { label: 'Restaurant', action: 'restaurant', icon: '🍽️' },
    { label: 'Garden & Produits', action: 'garden', icon: '🌱' },
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
  { label: 'Garden & Produits', action: 'garden', icon: <Leaf className="w-4 h-4" /> },
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
        router.push('/Garden-selected');
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
      {/* Bouton flottant (Launcher) Premium */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, y: 20, rotate: -20 }}
            animate={{
              scale: 1,
              y: 0,
              rotate: 0,
              transition: { type: "spring", stiffness: 260, damping: 20 }
            }}
            exit={{ scale: 0, y: 20, rotate: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={toggleChat}
              className="group relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-2xl shadow-blue-500/40 flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm"
              aria-label="Discuter avec TED"
            >
              {/* Effet de brillance animé au hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              <div className="relative">
                <Sparkles className="absolute -top-3 -right-3 w-4 h-4 text-yellow-300 animate-pulse" />
                <Bot className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </button>

            {/* Notification Badge */}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre du Chatbot - Glassmorphism & Modern UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[92vw] max-w-[400px] h-[600px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl"
          >
            {/* Header Premium */}
            <div className="relative p-5 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-violet-700/90 text-white overflow-hidden">
              {/* Background patterns */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight tracking-tight">TED Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-medium uppercase tracking-widest opacity-80">Online • AI Powered</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={minimizeChat}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${state.isMinimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Corps du Chat */}
            {!state.isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar bg-gradient-to-b from-transparent to-blue-50/30">
                  {state.messages.map((message, idx) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex flex-col max-w-[85%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`
                            px-4 py-2.5 rounded-2xl shadow-sm text-xs leading-relaxed
                            ${message.sender === 'user'
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm'
                              : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                            }
                          `}
                        >
                          {message.content}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-2 font-medium">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {state.isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-slate-100 px-4 py-3 rounded-3xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Barre de Saisie Premium */}
                <div className="p-4 bg-white/50 backdrop-blur-md border-t border-slate-100">
                  <div className="relative group">
                    <Input
                      value={state.currentInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Tapez votre message..."
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-5 pl-4 pr-14 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all !text-slate-900 placeholder:text-slate-400 border-2 group-focus-within:border-blue-500/30"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!state.currentInput.trim() || state.isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                    >
                      {state.isTyping ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 rotate-12 group-hover:rotate-0 transition-transform" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-2 font-medium tracking-wide">
                    TEDSAI Intelligent Ecosystem • v2.0
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

}
