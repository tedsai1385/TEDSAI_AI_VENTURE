'use client';

import { useReservationStore, ReservationStatus } from '@/lib/store/reservation-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Users,
    Clock,
    Phone,
    Check,
    X,
    Trash2,
    Utensils,
    MoreVertical,
    Search,
    Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminReservationsPage() {
    const { reservations, updateStatus, deleteReservation } = useReservationStore();
    const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');
    const [isHydrated, setIsHydrated] = useState(false);

    // Ensure hydration to prevent SSR mismatch
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const filteredReservations = reservations.filter(r =>
        filter === 'all' ? true : r.status === filter
    );

    if (!isHydrated) return null;

    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'seated': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'completed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Réservations viTEDia</h1>
                    <p className="text-zinc-400">Gérez les réservations de table et l'accueil client.</p>
                </div>
                <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    {['all', 'pending', 'confirmed', 'seated'].map((f) => (
                        <Button
                            key={f}
                            size="sm"
                            variant={filter === f ? 'secondary' : 'ghost'}
                            className={`capitalize ${filter === f ? 'bg-neutral-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            onClick={() => setFilter(f as any)}
                        >
                            {f === 'all' ? 'Toutes' : f === 'pending' ? 'Attente' : f === 'confirmed' ? 'Confirmé' : 'À table'}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {filteredReservations.length === 0 ? (
                    <Card className="bg-neutral-900 border-neutral-800 border-dashed py-12 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-50">
                            <Calendar className="w-12 h-12 mb-2" />
                            <p>Aucune réservation trouvée.</p>
                        </div>
                    </Card>
                ) : (
                    filteredReservations.map((res) => (
                        <Card key={res.id} className="bg-neutral-900 border-neutral-800 group hover:border-[#8b5a2b]/30 transition-all overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Color stripe indicating status */}
                                <div className={`w-1 md:w-2 ${res.status === 'confirmed' ? 'bg-green-500' :
                                    res.status === 'pending' ? 'bg-yellow-500' :
                                        res.status === 'cancelled' ? 'bg-red-500' : 'bg-neutral-700'
                                    }`} />

                                <CardContent className="p-4 md:p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800 text-[#8b5a2b] font-bold text-xl">
                                            {res.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-white">{res.name}</h3>
                                                <Badge variant="outline" className={`text-[10px] uppercase ${getStatusColor(res.status)}`}>
                                                    {res.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                                                <span className="flex items-center gap-1"><Calendar size={14} className="text-[#8b5a2b]" /> {res.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} className="text-[#8b5a2b]" /> {res.time}</span>
                                                <span className="flex items-center gap-1"><Users size={14} className="text-[#8b5a2b]" /> {res.guests} pers.</span>
                                                <span className="flex items-center gap-1"><Phone size={14} className="text-[#8b5a2b]" /> {res.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        {res.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-500 text-white gap-1 flex-1"
                                                    onClick={() => updateStatus(res.id, 'confirmed')}
                                                >
                                                    <Check size={14} /> Confirmer
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:bg-red-500/10 flex-1"
                                                    onClick={() => updateStatus(res.id, 'cancelled')}
                                                >
                                                    <X size={14} /> Refuser
                                                </Button>
                                            </>
                                        )}
                                        {res.status === 'confirmed' && (
                                            <Button
                                                size="sm"
                                                className="bg-[#8b5a2b] hover:bg-[#8b5a2b]/80 text-white gap-1 flex-1"
                                                onClick={() => updateStatus(res.id, 'seated')}
                                            >
                                                <Utensils size={14} /> Placer à table
                                            </Button>
                                        )}
                                        {res.status === 'seated' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-green-500/50 text-green-500 hover:bg-green-500/10 flex-1"
                                                onClick={() => updateStatus(res.id, 'completed')}
                                            >
                                                <Check size={14} /> Service Terminé
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                            onClick={() => deleteReservation(res.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
