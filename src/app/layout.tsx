import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TEDSAI Complex - De la Data à l'Assiette",
    description: "TEDSAI Complex : Un écosystème intelligent unifiant Intelligence Artificielle, Gastronomie Durable et Agriculture Urbaine.",
    icons: {
        icon: '/icon.jpg',
    },
};

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ChatbotProvider } from "@/context/ChatbotContext";

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider"
import TEDChatbotProvider from "@/components/chatbot/TEDChatbotProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AuthProvider>
                    <CartProvider>
                        <ChatbotProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange
                            >
                                <LayoutWrapper>
                                    {children}
                                    <TEDChatbotProvider />
                                </LayoutWrapper>
                            </ThemeProvider>
                        </ChatbotProvider>
                    </CartProvider>
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    );
}
