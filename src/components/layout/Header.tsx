'use client';

import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: '/', label: 'Accueil', icon: 'fa-solid fa-home' },
        { href: '/solutions-ia', label: 'Solutions IA' },
        { href: '/vitedia', label: 'viTEDia' },
        { href: '/garden', label: 'SelecTED Gardens' },
        { href: '/shop', label: 'Boutique', icon: 'fa-solid fa-basket-shopping' },
        { href: '/ecosystem', label: 'Écosystème' },
        { href: '/observatoire', label: 'Observatoire' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-50 via-white to-purple-50 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/assets/images/logos/tedsai_logo.jpg"
                        alt="TEDSAI Logo"
                        className="h-6 w-auto object-contain rounded-md"
                    />
                    <span className="font-bold text-lg text-primary hidden sm:inline-block">TEDSAI</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1.5 ml-auto">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <button
                                className={`px-3 py-1 h-7 text-xs font-medium rounded-md transition-all duration-200 flex items-center ${pathname === link.href
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                    }`}
                            >
                                {link.label}
                            </button>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-base font-medium py-2 transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-gray-600'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Link href="/contact" className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-white shadow hover:bg-primary/90">
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
