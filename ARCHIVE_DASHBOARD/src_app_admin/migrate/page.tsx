'use client';

import React, { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { Database, Play, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function MigrationPage() {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const runMigration = async () => {
        setStatus('running');
        setError('');
        setResults(null);

        try {
            const response = await fetch('/api/migrate', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setResults(data.results);
            } else {
                setStatus('error');
                setError(data.error || 'Migration failed');
            }
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Database className="mx-auto text-blue-500 mb-4" size={64} />
                        <h1 className="text-4xl font-bold text-white mb-4">Migration Firestore</h1>
                        <p className="text-slate-400 text-lg">
                            Importez les données JSON dans Firestore en un clic
                        </p>
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6">Données à Migrer</h2>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span><strong>Épicerie</strong> : 7 produits (épices + produits frais)</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span><strong>Restaurant</strong> : 7 plats (entrées, plats, desserts)</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span><strong>Élevage</strong> : Stats de production + Services</span>
                            </li>
                        </ul>

                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
                            <p className="text-amber-400 text-sm">
                                ⚠️ <strong>Attention</strong> : Cette opération va créer/écraser les documents dans Firestore.
                                Assurez-vous d'avoir configuré les règles de sécurité.
                            </p>
                        </div>

                        <button
                            onClick={runMigration}
                            disabled={status === 'running'}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {status === 'running' ? (
                                <>
                                    <Loader className="animate-spin" size={24} />
                                    Migration en cours...
                                </>
                            ) : (
                                <>
                                    <Play size={24} />
                                    Lancer la Migration
                                </>
                            )}
                        </button>

                        {/* Results */}
                        {status === 'success' && results && (
                            <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle className="text-emerald-400" size={32} />
                                    <h3 className="text-xl font-bold text-emerald-400">Migration Réussie !</h3>
                                </div>
                                <div className="space-y-2 text-slate-300">
                                    <p>✅ <strong>{results.epicerie}</strong> produits épicerie migrés</p>
                                    <p>✅ <strong>{results.menu}</strong> plats restaurant migrés</p>
                                    <p>✅ <strong>{results.elevage}</strong> documents élevage migrés</p>
                                    {results.errors && results.errors.length > 0 && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <p className="text-red-400 font-bold mb-2">Erreurs :</p>
                                            <ul className="text-sm space-y-1">
                                                {results.errors.map((err: string, idx: number) => (
                                                    <li key={idx} className="text-red-300">{err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <XCircle className="text-red-400" size={32} />
                                    <h3 className="text-xl font-bold text-red-400">Erreur de Migration</h3>
                                </div>
                                <p className="text-red-300">{error}</p>
                            </div>
                        )}
                    </div>

                    {status === 'success' && (
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 mb-4">Prochaines étapes :</p>
                            <div className="flex gap-4 justify-center">
                                <a
                                    href="/admin/shop"
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all"
                                >
                                    Gérer l'Épicerie
                                </a>
                                <a
                                    href="/admin/restaurant/menu"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
                                >
                                    Gérer le Menu
                                </a>
                                <a
                                    href="/admin/elevage"
                                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all"
                                >
                                    Gérer l'Élevage
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
