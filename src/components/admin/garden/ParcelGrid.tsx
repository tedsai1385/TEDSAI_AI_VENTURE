'use client';

import { useState } from 'react';
import { useInventoryStore } from '@/lib/store/inventory-store';
import { HarvestModal } from '@/components/admin/garden/HarvestModal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Droplets, Sun, Wind, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ParcelGrid() {
    const [selectedParcel, setSelectedParcel] = useState<{ id: string, name: string } | null>(null);

    // Mock parcel data (could be in store too, but static for layout)
    const parcels = [
        { id: 'P-01', name: 'Serre A (Tomates)', status: 'ready', humidity: '65%', temp: '24°' },
        { id: 'P-02', name: 'Serre A (Piments)', status: 'growing', humidity: '60%', temp: '25°' },
        { id: 'P-03', name: 'Jardin Vertical', status: 'maintenance', humidity: '45%', temp: '22°' },
        { id: 'P-04', name: 'Bac Aromates', status: 'ready', humidity: '55%', temp: '23°' },
        { id: 'P-05', name: 'Aquaponie', status: 'growing', humidity: '80%', temp: '21°' },
        { id: 'P-06', name: 'Pépinière', status: 'seeding', humidity: '70%', temp: '26°' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'bg-[#0E7C7B]/20 text-[#0E7C7B] border-[#0E7C7B]/50';
            case 'growing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'maintenance': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'seeding': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    };

    const getCardStyle = (status: string) => {
        switch (status) {
            case 'ready':
                return 'bg-gradient-to-br from-[#0E7C7B]/30 via-neutral-900 to-neutral-900 border-[#0E7C7B]/50 hover:border-[#0E7C7B] hover:shadow-glow-green';
            case 'growing':
                return 'bg-gradient-to-br from-amber-900/10 via-neutral-900 to-neutral-900 border-amber-900/30 hover:border-amber-700';
            case 'maintenance':
                return 'bg-gradient-to-br from-red-900/10 via-neutral-900 to-neutral-900 border-red-900/30 hover:border-red-700';
            case 'seeding':
                return 'bg-gradient-to-br from-blue-900/10 via-neutral-900 to-neutral-900 border-blue-900/30 hover:border-blue-700';
            default:
                return 'bg-neutral-900 border-neutral-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parcels.map((parcel) => (
                <div
                    key={parcel.id}
                    className={cn(
                        "group relative rounded-xl p-5 transition-all duration-300 cursor-pointer border overflow-hidden",
                        getCardStyle(parcel.status)
                    )}
                >
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <Leaf className={cn("w-5 h-5 transition-colors",
                                parcel.status === 'ready' ? "text-[#0E7C7B]" : "text-zinc-500 group-hover:text-white"
                            )} />
                            <span className="text-sm font-mono text-zinc-400">{parcel.id}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] uppercase", getStatusColor(parcel.status))}>
                            {parcel.status}
                        </Badge>
                    </div>

                    <h3 className="text-white font-medium mb-4">{parcel.name}</h3>

                    <div className="flex gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" /> {parcel.humidity}
                        </div>
                        <div className="flex items-center gap-1">
                            <Sun className="w-3 h-3" /> {parcel.temp}
                        </div>
                    </div>

                    {parcel.status === 'ready' && (
                        <div className="absolute inset-0 bg-cortex-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
                            <Button
                                variant="secondary"
                                className="bg-white text-cortex-primary font-bold shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedParcel({ id: parcel.id, name: parcel.name });
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Récolter
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            {/* Modal Injection */}
            {selectedParcel && (
                <HarvestModal
                    isOpen={!!selectedParcel}
                    onClose={() => setSelectedParcel(null)}
                    parcelId={selectedParcel.id}
                    parcelName={selectedParcel.name}
                />
            )}
        </div>
    );
}
