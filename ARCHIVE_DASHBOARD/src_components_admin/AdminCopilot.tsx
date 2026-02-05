'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface CopilotAction {
    type: 'generateDescription' | 'predictStock' | 'createPromo' | 'generateArticle';
    label: string;
    icon: string;
}

const QUICK_ACTIONS: CopilotAction[] = [
    { type: 'generateDescription', label: 'Générer description produit', icon: '✍️' },
    { type: 'predictStock', label: 'Prévoir rupture stock', icon: '📊' },
    { type: 'createPromo', label: 'Créer promo anti-gaspillage', icon: '🎯' },
    { type: 'generateArticle', label: 'Outline article blog', icon: '📝' },
];

export function AdminCopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Raccourci clavier Cmd+J / Ctrl+J
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const sendMessage = async (message: string) => {
        if (!message.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: message,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || 'Erreur lors de la génération.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Copilot error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Erreur de connexion au Copilot. Veuillez réessayer.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action: CopilotAction) => {
        const prompts = {
            generateDescription: 'Génère une description SEO pour un produit "Ndolé 2.0"',
            predictStock: 'Prévois le risque de rupture pour le basilic dans 7 jours',
            createPromo: 'Créer une promo anti-gaspillage pour 10kg de tomates',
            generateArticle: 'Génère un outline d\'article sur "IA en agriculture urbaine"',
        };

        sendMessage(prompts[action.type]);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cortex-primary to-cortex-secondary text-white shadow-glow-green flex items-center justify-center hover:scale-110 transition-transform group"
                aria-label="Ouvrir Copilot IA"
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-cortex-secondary rounded-full flex items-center justify-center text-xs font-bold">
                    ✨
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-dark-surface border border-dark-border rounded-xl shadow-2xl flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-border bg-gradient-to-r from-cortex-primary to-cortex-secondary">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <div>
                        <h3 className="text-white font-heading font-bold">TEDSAI Copilot</h3>
                        <p className="text-white/80 text-xs">Powered by Gemini 1.5 Pro</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
                <div className="p-4 space-y-2">
                    <p className="text-xs text-dark-text-secondary mb-3">Actions rapides :</p>
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.type}
                            onClick={() => handleQuickAction(action)}
                            className="w-full text-left px-3 py-2 text-sm bg-dark-bg border border-dark-border rounded-lg hover:border-cortex-primary transition-colors"
                        >
                            <span className="mr-2">{action.icon}</span>
                            <span className="text-white">{action.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.role === 'user'
                                    ? 'bg-cortex-primary text-white'
                                    : 'bg-dark-bg border border-dark-border text-white'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <span className="text-xs opacity-60 mt-1 block">
                                {msg.timestamp.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-cortex-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">TED-Bot réfléchit...</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Demandez à TED-Bot..."
                        className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-cortex-primary text-sm"
                        disabled={loading}
                    />
                    <Button
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        className="bg-cortex-primary hover:bg-cortex-primary-dark"
                        size="sm"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-xs text-dark-text-secondary mt-2 text-center">
                    Cmd+J pour ouvrir/fermer
                </p>
            </div>
        </div>
    );
}
