'use client';

import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: '/', label: 'Accueil', icon: 'fa-solid fa-home' },
        { href: '/ecosystem', label: 'Écosystème' },
        { href: '/vitedia', label: 'viTEDia' },
        { href: '/garden-selected', label: 'SelecTED Garden' },
        { href: '/shop', label: 'Boutique', icon: 'fa-solid fa-basket-shopping' },
        { href: '/solutions-ia', label: 'Solutions IA' },
        { href: '/infographie', label: 'Infographie' },
        { href: '/observatoire', label: 'Observatoire' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-50 via-white to-blue-100 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded">
                    <div className="relative h-8 w-8">
                        <Image
                            src="/assets/images/logos/tedsai_logo.jpg"
                            alt="TEDSAI Logo"
                            fill
                            className="object-contain rounded-md"
                            priority
                        />
                    </div>
                    <span className="font-bold text-lg text-primary hidden sm:inline-block">TEDSAI</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1.5 ml-auto" aria-label="Navigation principale">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-1 h-7 text-xs font-medium rounded-md transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${pathname === link.href
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                }`}
                            aria-current={pathname === link.href ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="md:hidden border-t border-gray-100 bg-white"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu de navigation mobile"
                >
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-base font-medium py-2 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${pathname === link.href ? 'text-primary' : 'text-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Link
                                href="/contact"
                                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Prendre Rendez-vous
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
