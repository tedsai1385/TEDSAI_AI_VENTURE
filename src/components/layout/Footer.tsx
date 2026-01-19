'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useChatbot } from '@/context/ChatbotContext';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    MapPinned,
    Heart
} from 'lucide-react';


const Footer = () => {
    const { openChat } = useChatbot();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* CTA Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-center">
                    <h3 className="text-3xl font-bold mb-4">Prêt à automatiser votre avenir ?</h3>
                    <p className="text-blue-50 mb-6 max-w-2xl mx-auto">Discutez avec notre agent IA ou demandez un devis personnalisé pour vos projets.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Demander un devis
                        </Link>
                        <button
                            onClick={openChat}
                            className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
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
                            />
                        </div>
                        <div className="mb-4">
                            <strong className="text-xl">TEDSAI Complex</strong><br />
                            <em className="text-gray-400 text-sm">Automatisation intelligente & solutions IA sur mesure.</em>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                Un écosystème unifié pour propulser l'Afrique vers l'industrie 4.0.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a href="https://www.linkedin.com/in/tedsai-complex-a26b95397" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors" title="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://www.instagram.com/tedsai1385/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors" title="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="https://x.com/Tedsai1385" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors" title="X (Twitter)">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61584073655708" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors" title="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.youtube.com/@TEDSAIComplex" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors" title="YouTube">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors">À Propos</Link></li>
                            <li><Link href="/solutions-ia" className="text-gray-400 hover:text-white transition-colors">Solutions IA</Link></li>
                            <li><Link href="/vitedia" className="text-gray-400 hover:text-white transition-colors">Restaurant viTEDia</Link></li>
                            <li><Link href="/garden" className="text-gray-400 hover:text-white transition-colors">SelecTED Gardens</Link></li>
                            <li><Link href="/ecosystem" className="text-gray-400 hover:text-white transition-colors">L'Écosystème</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Nos Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/solutions-ia#automation" className="text-gray-400 hover:text-white transition-colors">Automatisation IA</Link></li>
                            <li><Link href="/solutions-ia#agents" className="text-gray-400 hover:text-white transition-colors">Agents Intelligents</Link></li>
                            <li><Link href="/vitedia#traceability" className="text-gray-400 hover:text-white transition-colors">Traçabilité Alimentaire</Link></li>
                            <li><Link href="/garden#urban" className="text-gray-400 hover:text-white transition-colors">Agriculture Urbaine</Link></li>
                            <li><Link href="/observatoire" className="text-gray-400 hover:text-white transition-colors">Études & Consulting</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Contact & Info</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <span className="text-gray-400">contact@tedsai.cm</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <span className="text-gray-400">+237 6XX XXX XXX</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <span className="text-gray-400">Yaoundé, Cameroun</span>
                            </li>
                            <li className="mt-4">
                                <a href="https://maps.app.goo.gl/PAqnePyormGahFcW9" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
                                    <MapPinned size={16} /> Localiser sur Maps
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <div className="text-gray-400">
                        &copy; {new Date().getFullYear()} <strong className="text-white">TEDSAI Complex</strong>. Tous droits réservés.
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
                        <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
                    </div>
                    <div className="text-gray-400 flex items-center gap-1">
                        Built with <Heart size={14} className="text-red-500 fill-red-500" /> & Intelligence Artificielle
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
