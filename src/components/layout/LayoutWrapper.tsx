'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartSidebar from "@/components/features/CartSidebar";
import FloatingCartButton from "@/components/features/FloatingCartButton";
import { useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const isAuthPage = pathname?.startsWith('/admin') || pathname === '/admin/auth/login';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <FloatingCartButton onClick={() => setIsCartOpen(true)} />
        </>
    );
}
