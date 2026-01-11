'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Real Firestore reservation
const saveReservation = async (data: any, userId: string = 'anonymous') => {
    try {
        await addDoc(collection(db, 'vitedia_reservations'), {
            ...data,
            userId,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        console.log('Reservation saved to Firestore');
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
    const chatBodyRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
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
        <div className="ted-widget">
            <button className="ted-button" onClick={toggleChat} title="Discuter avec TED">
                <img src="/assets/images/logos/tedsai_logo.jpg" alt="TED" />
            </button>

            <div className={`ted-chat-window ${isOpen ? 'active' : ''}`}>
                <div className="ted-chat-header">
                    <div className="ted-chat-header-info">
                        <img src="/assets/images/logos/tedsai_logo.jpg" alt="TED Assistant" />
                        <div>
                            <h3>TED Assistant</h3>
                            <p>En ligne • {bookingState.active ? 'Réservation...' : 'IA Connectée'}</p>
                        </div>
                    </div>
                    <button className="ted-close-btn" onClick={toggleChat}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="ted-chat-body" ref={chatBodyRef}>
                    {history.length === 0 && (
                        <div className="ted-message ted">
                            <div className="ted-message-content">
                                Bonjour ! Je suis TED. Je peux vous orienter vers nos pôles : IA, Agriculture, Élevage, Restauration ou Épicerie.
                                <div className="ted-scenarios">
                                    <button className="ted-scenario-btn" onClick={() => handleScenario('reserve')}>
                                        <i className="fa-solid fa-utensils"></i> Réserver chez viTEDia
                                    </button>
                                    <button className="ted-scenario-btn" onClick={() => handleScenario('ia')}>
                                        <i className="fa-solid fa-brain"></i> Solutions IA
                                    </button>
                                    <button className="ted-scenario-btn" onClick={() => handleScenario('menu')}>
                                        <i className="fa-solid fa-book-open"></i> Voir le Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {history.map((msg, idx) => (
                        <div key={idx} className={`ted-message ${msg.role === 'assistant' ? 'ted' : 'user'}`}>
                            {msg.role === 'assistant' && (
                                <img src="/assets/images/logos/tedsai_logo.jpg" alt="TED" className="ted-message-avatar" style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8, float: 'left' }} />
                            )}
                            <div className="ted-message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="ted-message ted">
                            <div className="ted-typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <form className="ted-chat-footer" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="ted-input"
                        placeholder={bookingState.active ? (bookingState.step === 'people' ? 'Ex: 2' : 'Répondez ici...') : "Écrivez votre message..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="ted-send-btn">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;
