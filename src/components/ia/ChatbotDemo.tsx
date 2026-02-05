'use client';

import React, { useState } from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

export const ChatbotDemo = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de la Quincaillerie du Centre. Comment puis-je vous aider ?' },
        { role: 'user', text: 'Avez-vous du ciment 42.5 en stock ?' },
        { role: 'bot', text: 'Oui, il nous reste 150 sacs de Ciment CIMENCAM 42.5. Le prix est de 4 800 FCFA l\'unité. Voulez-vous que je vous en réserve ?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsgs = [...messages, { role: 'user', text: input }];
        setMessages(newMsgs);
        setInput('');

        // Fake AI response
        setTimeout(() => {
            setMessages([...newMsgs, { role: 'bot', text: "Ceci est une démo. L'IA réelle analyserait votre demande et vérifierait le stock en temps réel." }]);
        }, 1000);
    };

    return (
        <Section spacing="base" className="bg-[var(--color-secondary)] text-white overflow-hidden">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="bg-blue-900/30 inline-block px-4 py-2 rounded-full text-blue-300 text-sm font-bold mb-6 border border-blue-800">
                            Démo Live
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                            Testez la puissance de la conversation.
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            Vos clients sont déjà sur WhatsApp. Pourquoi les forcer à aller sur un site web compliqué ?
                            Notre IA gère la conversation, comprend le contexte (Pinyin, Camfranglais supportés) et conclut la vente.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Comprend les fautes de frappe
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Connecté à votre stock réel
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Gère les paiements mobiles
                            </li>
                        </ul>
                    </div>

                    <div className="flex-1 w-full flex justify-center">
                        <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20" />

                            {/* Header WhatsApp style */}
                            <div className="bg-[#075E54] p-4 pt-8 flex items-center gap-3 text-white">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">Q</div>
                                <div>
                                    <div className="font-bold text-sm">Quincaillerie IA</div>
                                    <div className="text-[10px] text-green-200">En ligne</div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 bg-[#ECE5DD] p-4 overflow-y-auto space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg p-2 text-sm shadow-sm ${msg.role === 'user' ? 'bg-[#DCF8C6] text-gray-800' : 'bg-white text-gray-800'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="bg-white p-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none text-black"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center text-white"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
