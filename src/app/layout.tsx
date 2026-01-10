import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TEDSAI Complex - De la Data à l'Assiette",
    description: "TEDSAI Complex : Un écosystème intelligent unifiant Intelligence Artificielle, Gastronomie Durable et Agriculture Urbaine.",
};

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body>
                <AuthProvider>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </AuthProvider>
            </body>
        </html>
    );
}
