'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useChatbot } from '@/context/ChatbotContext';
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    MapPinned,
    Heart
} from 'lucide-react';

// Custom LinkedIn Icon
const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

// Custom Instagram Icon
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

// Custom Facebook Icon
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

// Custom Youtube Icon (White triangle on red background provided by parent)
const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="currentColor" />
        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#ff0000" />
    </svg>
);

// Custom TikTok Icon
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

// Custom WhatsApp Icon
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Custom Telegram Icon
const TelegramIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

// Custom X (Twitter) Icon
const XIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon="twitter">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
    </svg>
);


const Footer = () => {
    const { openChat } = useChatbot();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" id="main-footer">
            <div className="container mx-auto px-4 py-12">
                {/* CTA Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-12 text-center">
                    <h3 className="text-3xl font-bold mb-4">Prêt à automatiser votre avenir ?</h3>
                    <p className="text-blue-50 mb-6 max-w-2xl mx-auto">Discutez avec notre agent IA ou demandez un devis personnalisé pour vos projets.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Demander un devis
                        </Link>
                        <button
                            onClick={openChat}
                            className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            aria-label="Ouvrir le chatbot IA"
                        >
                            Discuter avec l'IA
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Identity & Branding */}
                    <div className="lg:col-span-1">
                        <div className="mb-4 relative w-32 h-16">
                            <Image
                                src="/assets/images/logos/tedsai_logo.jpg"
                                alt="TEDSAI Logo"
                                fill
                                className="object-contain rounded-md"
                                priority
                            />
                        </div>
                        <div className="mb-4">
                            <strong className="text-xl">TEDSAI Complex</strong><br />
                            <em className="text-gray-400 text-sm">L'intelligence au service de la terre et de la table.</em>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                Un écosystème unifié pour propulser l'Afrique vers l'industrie 4.0.
                            </p>
                        </div>
                        <div className="flex gap-3" aria-label="Liens vers les réseaux sociaux">
                            {/* LinkedIn - Blue #0077b5 */}
                            <a href="https://www.linkedin.com/in/tedsai-complex-a26b95397" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0077b5] hover:brightness-110 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="LinkedIn" aria-label="LinkedIn">
                                <LinkedInIcon size={20} />
                            </a>
                            {/* Instagram - Official Gradient */}
                            <a href="https://www.instagram.com/tedsai1385/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:brightness-110 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="Instagram" aria-label="Instagram">
                                <InstagramIcon size={20} />
                            </a>
                            {/* X (Twitter) - Black */}
                            <a href="https://x.com/Tedsai1385" id="cta-footer-x-formerly-known-as-twitter" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="X (Twitter)" aria-label="X (Twitter)">
                                <XIcon size={18} />
                            </a>
                            {/* Facebook - Blue #1877f2 */}
                            <a href="https://www.facebook.com/profile.php?id=61584073655708" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1877f2] hover:brightness-110 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="Facebook" aria-label="Facebook">
                                <FacebookIcon size={20} />
                            </a>
                            {/* YouTube - Red #ff0000 */}
                            <a href="https://www.youtube.com/@TEDSAI1385" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#ff0000] hover:brightness-110 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="YouTube" aria-label="YouTube">
                                <YoutubeIcon size={20} />
                            </a>
                            {/* TikTok - Black #000000 with generic effect */}
                            <a href="https://www.tiktok.com/@tedsai_complex?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#000000] hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors shadow-lg" title="TikTok" aria-label="TikTok">
                                <TikTokIcon size={18} />
                            </a>
                            {/* WhatsApp Channel - Green #25D366 */}
                            <a href="https://whatsapp.com/channel/0029VbBFnda5PO11nOuVTU3F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] hover:brightness-110 rounded-full flex items-center justify-center transition-colors shadow-lg" title="WhatsApp Channel" aria-label="WhatsApp Channel">
                                <WhatsAppIcon size={18} />
                            </a>
                            {/* Telegram - Blue #0088cc */}
                            <a href="https://t.me/tedsai_complex" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0088cc] hover:brightness-110 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg" title="Telegram" aria-label="Telegram">
                                <TelegramIcon size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Accueil</Link></li>
                            <li><Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">À Propos</Link></li>
                            <li><Link href="/solutions-ia" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Solutions IA</Link></li>
                            <li><Link href="/vitedia" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Restaurant viTEDia</Link></li>
                            <li><Link href="/garden-selected" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">SelecTED Garden</Link></li>
                            <li><Link href="/ecosystem" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">L'Écosystème</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Nos Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/solutions-ia#automation" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Automatisation IA</Link></li>
                            <li><Link href="/solutions-ia#agents" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Agents Intelligents</Link></li>
                            <li><Link href="/vitedia#traceability" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Traçabilité Alimentaire</Link></li>
                            <li><Link href="/garden-selected#urban" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">SelecTED Garden</Link></li>
                            <li><Link href="/observatoire" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Études & Consulting</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Contact & Info</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-400" aria-hidden="true" />
                                <span className="text-gray-400">contact@tedsai.cm</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-400" aria-hidden="true" />
                                <span className="text-gray-400">+237 6XX XXX XXX</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-400" aria-hidden="true" />
                                <span className="text-gray-400">Yaoundé, Cameroun</span>
                            </li>
                            <li className="mt-4">
                                <a href="https://maps.app.goo.gl/PAqnePyormGahFcW9" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">
                                    <MapPinned size={16} aria-hidden="true" /> Localiser sur Maps
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <div className="text-gray-400">
                        &copy; 2026 <strong className="text-white">TEDSAI Complex</strong> — Built with 🧠 & 🌱
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <Link href="/mentions-legales" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Mentions Légales</Link>
                        <Link href="/confidentialite" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-1">Confidentialité</Link>
                    </div>
                    <div className="text-gray-400 flex items-center gap-1">
                        Contact: contact@tedsai-complex.com
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
