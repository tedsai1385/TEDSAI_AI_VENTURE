'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MessageCircle, X, Send, Brain, Utensils, BookOpen } from 'lucide-react';

// Real Firestore reservation
const saveReservation = async (data: any, userId: string = 'anonymous') => {
    try {
        await addDoc(collection(db, 'vitedia_reservations'), {
            ...data,
            userId,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        // console.log('Reservation saved to Firestore');
    } catch (error) {
        console.error('Error saving reservation:', error);
    }
};

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Booking Flow State
    const [bookingState, setBookingState] = useState<{
        active: boolean;
        step?: 'people' | 'date' | 'time' | 'name';
        data?: any;
    }>({ active: false, data: {} });

    const [sessionId] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ted_session_id');
            if (saved) return saved;
            const newId = crypto.randomUUID();
            localStorage.setItem('ted_session_id', newId);
            return newId;
        }
        return '';
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping, bookingState]);

    const toggleChat = () => setIsOpen(!isOpen);

    const addMessage = (role: 'user' | 'assistant', content: string) => {
        setHistory(prev => [...prev, { role, content, timestamp: new Date() }]);
    };

    const handleScenario = (action: string) => {
        if (action === 'reserve') {
            setBookingState({ active: true, step: 'people', data: {} });
            addMessage('assistant', "C'est noté ! Pour combien de personnes ?");
        } else if (action === 'menu') {
            addMessage('user', "Voir le menu");
            addMessage('assistant', "Nos plats varient entre 8 000 et 15 000 FCFA. Vous pouvez voir le menu complet sur la page viTEDia.");
            // Optional: Redirect logic
        } else if (action === 'ia') {
            addMessage('user', "Services IA");
            addMessage('assistant', "Nos solutions IA pour entreprises commencent par un audit. Visitez la page Solutions IA ou demandez un devis ici.");
        }
    };

    const processBookingStep = (text: string) => {
        const currentData = { ...bookingState.data };
        let nextStep = bookingState.step;
        let active = true;

        switch (bookingState.step) {
            case 'people':
                if (isNaN(parseInt(text))) {
                    addMessage('assistant', "Veuillez entrer un nombre valide (ex: 2).");
                    return;
                }
                currentData.people = text;
                nextStep = 'date';
                addMessage('assistant', "Très bien. Pour quelle date ? (JJ/MM)");
                break;
            case 'date':
                currentData.date = text;
                nextStep = 'time';
                addMessage('assistant', "À quelle heure ?");
                break;
            case 'time':
                currentData.time = text;
                nextStep = 'name';
                addMessage('assistant', "Et à quel nom je note cela ?");
                break;
            case 'name':
                currentData.name = text;
                // Finalize
                active = false;
                nextStep = undefined;
                saveReservation(currentData);
                addMessage('assistant', `Merci ${text} ! Votre réservation pour ${currentData.people} personnes le ${currentData.date} à ${currentData.time} est bien notée.`);
                setTimeout(() => {
                    addMessage('assistant', "Puis-je faire autre chose pour vous ?");
                }, 1500);
                break;
        }

        setBookingState({ active, step: nextStep, data: currentData });
    };

    const handleSendMessage = async (e?: React.FormEvent, presetMessage?: string) => {
        if (e) e.preventDefault();
        const textToSend = presetMessage || message;
        if (!textToSend.trim()) return;

        addMessage('user', textToSend);
        setMessage('');

        // 1. Intercept for Booking Flow
        if (bookingState.active) {
            if (textToSend.toLowerCase() === 'annuler') {
                setBookingState({ active: false, data: {} });
                addMessage('assistant', "Réservation annulée. Que souhaitez-vous faire ?");
            } else {
                setTimeout(() => processBookingStep(textToSend), 500);
            }
            return;
        }

        // 2. Intercept for Keywords (Legacy "Reflexes")
        const lower = textToSend.toLowerCase();
        if (lower.includes('réserver') || lower.includes('reservation')) {
            handleScenario('reserve');
            return;
        }

        // 3. Fallback to AI
        setIsTyping(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: history,
                    userId: user?.uid || 'anonymous',
                    sessionId: sessionId,
                }),
            });

            const data = await response.json();
            if (data.response) {
                addMessage('assistant', data.response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('assistant', "Désolé, je rencontre un problème de connexion.");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src="/assets/images/logos/tedsai_logo.jpg"
                                    alt="TED Assistant"
                                    className="w-10 h-10 rounded-full border-2 border-white/20"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">TED Assistant</h3>
                                <p className="text-xs text-blue-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    {bookingState.active ? 'Réservation en cours' : 'IA Connectée'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 scroll-smooth space-y-4">
                        {history.length === 0 && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <img src="/assets/images/logos/tedsai_logo.jpg" className="w-full h-full rounded-full" alt="AI" />
                                </div>
                                <div className="space-y-3 max-w-[85%]">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100">
                                        Bonjour ! Je suis TED. Je peux vous orienter vers nos pôles.
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleScenario('reserve')}
                                            className="text-left text-xs bg-white hover:bg-blue-50 border border-blue-100 p-2.5 rounded-xl transition-colors flex items-center gap-2 text-blue-700 font-medium"
                                        >
                                            <Utensils className="w-3.5 h-3.5" />
                                            Réserver chez viTEDia
                                        </button>
                                        <button
                                            onClick={() => handleScenario('ia')}
                                            className="text-left text-xs bg-white hover:bg-purple-50 border border-purple-100 p-2.5 rounded-xl transition-colors flex items-center gap-2 text-purple-700 font-medium"
                                        >
                                            <Brain className="w-3.5 h-3.5" />
                                            Solutions IA
                                        </button>
                                        <button
                                            onClick={() => handleScenario('menu')}
                                            className="text-left text-xs bg-white hover:bg-green-50 border border-green-100 p-2.5 rounded-xl transition-colors flex items-center gap-2 text-green-700 font-medium"
                                        >
                                            <BookOpen className="w-3.5 h-3.5" />
                                            Voir le Menu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {history.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
                                        <img src="/assets/images/logos/tedsai_logo.jpg" alt="AI" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div
                                    className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
                                    <img src="/assets/images/logos/tedsai_logo.jpg" alt="AI" className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-16 flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer Input */}
                    <form
                        onSubmit={(e) => handleSendMessage(e)}
                        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={bookingState.active ? (bookingState.step === 'people' ? 'Ex: 2' : 'Répondez ici...') : "Posez une question..."}
                            className="flex-1 bg-gray-100 text-sm text-gray-900 placeholder:text-gray-400 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-white/20"
            >
                {isOpen ? (
                    <X className="w-7 h-7 text-white" />
                ) : (
                    <>
                        <img
                            src="/assets/images/logos/tedsai_logo.jpg"
                            alt="Chat"
                            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 absolute inset-0 transition-opacity duration-300"
                        />
                        <MessageCircle className="w-7 h-7 text-white group-hover:opacity-0 transition-opacity duration-300" />
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
