'use client';

import React, { useEffect, useState } from 'react';
// We use the new next/navigation useParams if available or fall back
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, MapPin, Calendar, Truck, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function TraceabilityPage() {
    const params = useParams();
    const id = params?.id as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'garden_products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Produit introuvable. Ce code est peut-être incorrect.");
                }
            } catch (err) {
                console.error(err);
                setError("Erreur de connexion lors de la vérification.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Traçabilité Impossible</h1>
                    <p className="text-slate-500 mb-6">{error || "Code invalide"}</p>
                    <Link href="/garden" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                        <ArrowLeft size={20} />
                        Retour au Jardin
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden print:shadow-none">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <Link href="/garden" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors print:hidden">
                            <ArrowLeft size={20} />
                            Retour
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-500/30 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-emerald-400/30">
                                {product.cert || 'BIO Standard'}
                            </span>
                            <span className="text-emerald-100 text-sm font-mono opacity-80">
                                #{product.id.slice(0, 8)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Leaf size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Produit</h3>
                                    <p className="text-lg font-bold text-slate-800">{product.name}</p>
                                    <p className="text-slate-500">{product.weight || product.stock || '50kg'} (Lot initial)</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Origine</h3>
                                    <p className="text-lg font-bold text-slate-800">{product.parcel || 'SelecTED Garden'}</p>
                                    <p className="text-slate-500">Douala, Cameroun</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Récolte</h3>
                                    <p className="text-lg font-bold text-slate-800">
                                        {product.harvestDate?.seconds
                                            ? new Date(product.harvestDate.seconds * 1000).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })
                                            : 'N/A'}
                                    </p>
                                    <p className="text-slate-500">Qualité: <span className="capitalize text-emerald-600 font-bold">{product.status}</span></p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</h3>
                                    <p className="text-lg font-bold text-slate-800">Restaurant viTEDia</p>
                                    <p className="text-slate-500">Circuit Court (< 1km)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Visualization */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            Certificat d'Authenticité
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Ce produit a été cultivé sans pesticides chimiques, dans le respect des normes d'agriculture durable du Complexe TEDSAI.
                            L'eau d'irrigation est filtrée et gérée par notre système IA.
                        </p>
                    </div>

                    <div className="text-center print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            <Printer size={20} />
                            Imprimer la Fiche
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-900 text-slate-400 p-6 text-center text-sm">
                    <p>© 2024 SelecTED Garden • Une initiative TEDSAI AI Venture</p>
                    <p className="text-xs opacity-50 mt-1">ID Unique: {product.id}</p>
                </div>
            </div>
        </div>
    );
}
