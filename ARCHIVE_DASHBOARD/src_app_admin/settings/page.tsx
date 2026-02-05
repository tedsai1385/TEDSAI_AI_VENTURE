'use client';

import { Button } from '@/components/ui/button';
import {
    Save,
    Shield,
    Bell,
    Globe,
    Database,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-500 text-sm">Configuration générale du système TEDSAI.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                </Button>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3">
                    <nav className="space-y-1">
                        {[
                            { icon: Globe, label: 'Général', active: true },
                            { icon: Shield, label: 'Sécurité', active: false },
                            { icon: Bell, label: 'Notifications', active: false },
                            { icon: Database, label: 'Base de données', active: false },
                            { icon: Mail, label: 'Email SMTP', active: false },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${item.active
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Using simple divs for form layout as we are mocking functionality */}
                <div className="md:col-span-9 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Informations du Site</h3>
                            <p className="text-sm text-gray-500">Ces informations sont visibles publiquement.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nom du Site</label>
                                    <input type="text" defaultValue="TEDSAI Complex" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email de Contact</label>
                                    <input type="email" defaultValue="contact@tedsai.cm" className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description SEO</label>
                                <textarea rows={3} defaultValue="Le premier complexe agritech du Cameroun, alliant IA et agriculture durable." className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Mode Maintenance</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Localisation & Devise</h3>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Fuseau Horaire</label>
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-blue-500">
                                    <option>Afrique/Douala (GMT+1)</option>
                                    <option>Europe/Paris (GMT+1)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Devise</label>
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-blue-500">
                                    <option>FCFA (XAF)</option>
                                    <option>Euro (EUR)</option>
                                    <option>Dollar (USD)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
