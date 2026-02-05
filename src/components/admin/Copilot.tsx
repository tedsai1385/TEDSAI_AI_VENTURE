'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export function Copilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'bot',
            content: "Bonjour ! Je suis TED-Bot. Comment puis-je vous aider aujourd'hui ?",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error('Erreur API');

            const data = await response.json();

            const botMessage: Message = {
                role: 'bot',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "Désolé, j'ai rencontré une erreur technique. Vérifiez votre connexion ou la clé API.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative w-14 h-14 bg-cortex-restaurant rounded-2xl shadow-lg shadow-cortex-restaurant/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-fade-in"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
                    <Sparkles className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cortex-garden rounded-full border-2 border-neutral-900" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up",
                    isMaximized ? "fixed inset-6 w-auto h-auto" : "w-[400px] h-[600px] max-h-[80vh]"
                )}>
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cortex-restaurant/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-cortex-restaurant" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-none">TED-Bot Copilot</h3>
                                <p className="text-[10px] text-cortex-garden font-mono mt-1 uppercase tracking-widest">IA Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-neutral-500 hover:text-white"
                                onClick={() => setIsMaximized(!isMaximized)}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-neutral-500 hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                    msg.role === 'user' ? "bg-cortex-restaurant text-white" : "bg-neutral-800 text-cortex-restaurant"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-cortex-restaurant/10 border border-cortex-restaurant/20 text-neutral-200 rounded-tr-none shadow-sm shadow-cortex-restaurant/5"
                                        : "bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-tl-none shadow-sm shadow-black/20"
                                )}>
                                    {msg.content}
                                    <div className="text-[9px] opacity-30 mt-1 uppercase font-mono">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
                                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                                    <Loader2 className="w-4 h-4 text-cortex-restaurant animate-spin" />
                                </div>
                                <div className="p-3 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-2xl rounded-tl-none text-sm italic">
                                    TED-Bot réfléchit...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-neutral-950 border-t border-neutral-800">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Générer une promo, un article..."
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cortex-restaurant/30 transition-all shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1.5 w-9 h-9 bg-cortex-restaurant rounded-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cortex-restaurant/20"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
