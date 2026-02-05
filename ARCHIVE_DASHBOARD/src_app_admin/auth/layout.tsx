export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Layout minimal pour les pages d'authentification
    // Pas de AuthProvider, pas de LayoutWrapper, pas de Header/Footer
    return <>{children}</>;
}
