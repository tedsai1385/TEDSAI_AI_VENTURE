import type { Metadata } from "next";
import "@/styles/design-tokens.css";
import "./globals.css";

import { metadata as seoMetadata, viewport as seoViewport } from '@/lib/seo-config';

export const metadata = seoMetadata;
export const viewport = seoViewport;

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ChatbotProvider } from "@/context/ChatbotContext";

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider"
import TEDChatbotProvider from "@/components/chatbot/TEDChatbotProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ErrorBoundary>
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
                </ErrorBoundary>
                <Analytics />
            </body>
        </html>
    );
}
