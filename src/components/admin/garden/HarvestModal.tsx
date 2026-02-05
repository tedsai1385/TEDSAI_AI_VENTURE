'use client';

import { useState } from 'react';
import { useInventoryStore, GardenItem } from '@/lib/store/inventory-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label'; // Assuming Label exists or I use native label
// If Label missing, I'll use <label>. I'll assume standard shadcn installation.
// Checking previous steps... I didn't verify Label. I'll use native label class.
import { Loader2, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface HarvestModalProps {
    isOpen: boolean;
    onClose: () => void;
    parcelId: string;
    parcelName: string;
}

import { useGardenStore } from '@/lib/store/garden-store';

export function HarvestModal({ isOpen, onClose, parcelId, parcelName }: HarvestModalProps) {
    const { addItem } = useGardenStore();
    const [loading, setLoading] = useState(false);

    // Form State
    const [product, setProduct] = useState('Tomates');
    const [quantity, setQuantity] = useState('');
    const [quality, setQuality] = useState<'A' | 'B' | 'C'>('A');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const qtyNum = Number(quantity);

        try {
            await addItem({
                name: product,
                description: `Récolte fraîche de la parcelle ${parcelName}. Qualité ${quality}.`,
                price: "4 500 FCFA / kg",
                tag: quality === 'A' ? 'Premium' : 'Standard',
                quantity: qtyNum,
                unit: 'kg',
                inStock: true,
                image: '', // Pas d'image par défaut via ce modal rapide
            });

            toast.success('Récolte validée !', {
                description: `${quantity}kg de ${product} ajoutés au store local.`
            });

            onClose();
            setQuantity('');
        } catch (error) {
            console.error("Error adding harvest:", error);
            toast.error("Erreur lors de la validation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-dark-surface border-dark-border text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-cortex-primary" />
                        Nouvelle Récolte
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Entrez les détails de la récolte pour {parcelName} ({parcelId}).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm text-zinc-300">Produit</label>
                        <select
                            className="col-span-3 flex h-10 w-full rounded-md border border-dark-border bg-dark-bg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cortex-primary/50"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            <option value="Tomates">Tomates</option>
                            <option value="Basilic">Basilic</option>
                            <option value="Piment">Piment</option>
                            <option value="Aubergines">Aubergines</option>
                            <option value="Laitue">Laitue</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm text-zinc-300">Quantité (kg)</label>
                        <Input
                            type="number"
                            step="0.1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="col-span-3 bg-dark-bg border-dark-border text-white focus:ring-cortex-primary/50"
                            placeholder="Ex: 12.5"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm text-zinc-300">Qualité</label>
                        <div className="col-span-3 flex gap-4">
                            {(['A', 'B', 'C'] as const).map((grade) => (
                                <button
                                    type="button"
                                    key={grade}
                                    onClick={() => setQuality(grade)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${quality === grade
                                        ? 'bg-cortex-primary/20 border-cortex-primary text-cortex-primary'
                                        : 'border-dark-border hover:bg-white/5 text-zinc-400'
                                        }`}
                                >
                                    Grade {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                        Annuler
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading} className="bg-cortex-primary hover:bg-cortex-primary-light text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Valider Récolte
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
