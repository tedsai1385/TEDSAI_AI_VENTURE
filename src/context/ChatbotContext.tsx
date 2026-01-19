'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChatbotContextType {
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpenState] = useState(false);

    const openChat = useCallback(() => setIsOpenState(true), []);
    const closeChat = useCallback(() => setIsOpenState(false), []);
    const toggleChat = useCallback(() => setIsOpenState(prev => !prev), []);
    const setIsOpen = useCallback((open: boolean) => setIsOpenState(open), []);

    return (
        <ChatbotContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, setIsOpen }}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (context === undefined) {
        throw new Error('useChatbot must be used within a ChatbotProvider');
    }
    return context;
};
