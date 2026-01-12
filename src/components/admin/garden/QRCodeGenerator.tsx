'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer } from 'lucide-react';

interface QRCodeGeneratorProps {
    data: string;
    label: string;
    onClose: () => void;
}

export default function QRCodeGenerator({ data, label, onClose }: QRCodeGeneratorProps) {
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        QRCode.toDataURL(data, { width: 400, margin: 2 }, (err, url) => {
            if (err) console.error(err);
            else setQrUrl(url);
        });
    }, [data]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Traçabilité Produit</h3>
                    <p className="text-sm text-slate-500 font-medium bg-slate-100 py-1 px-3 rounded-full inline-block">
                        {label}
                    </p>

                    <div className="bg-white p-4 rounded-xl border-2 border-slate-100 flex justify-center">
                        {qrUrl ? (
                            <img src={qrUrl} alt="QR Code" className="w-56 h-56 object-contain" />
                        ) : (
                            <div className="w-56 h-56 bg-slate-100 animate-pulse rounded-lg" />
                        )}
                    </div>

                    <p className="text-xs text-slate-400">
                        Scannez ce code pour voir l'historique complet de la parcelle et de la récolte.
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => {
                                const link = document.createElement('a');
                                link.download = `QR-${label.replace(/\s+/g, '-')}.png`;
                                link.href = qrUrl;
                                link.click();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                        >
                            <Download size={18} />
                            Télécharger
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-bold rounded-xl border border-emerald-500/20 transition-all"
                        >
                            <Printer size={18} />
                            Imprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
