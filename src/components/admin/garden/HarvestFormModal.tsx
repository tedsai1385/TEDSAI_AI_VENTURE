'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useGardenStore } from '@/lib/store/garden-store';

interface HarvestFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any;
}

const compressImage = (base64: string, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
        const img = document.createElement('img');
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
};

export function HarvestFormModal({ isOpen, onClose, product }: HarvestFormModalProps) {
    const { addItem, updateItem } = useGardenStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '4 500 FCFA / kg',
        tag: 'Aromate',
        quantity: 0,
        unit: 'kg',
        inStock: true,
        image: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '4 500 FCFA / kg',
                tag: product.tag || 'Aromate',
                quantity: product.quantity || 0,
                unit: product.unit || 'kg',
                inStock: product.inStock !== undefined ? product.inStock : true,
                image: product.image || ''
            });
        }
    }, [product, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            const compressed = await compressImage(base64);
            setFormData(prev => ({ ...prev, image: compressed }));
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Le nom du produit est requis');
            return;
        }

        setLoading(true);

        try {
            if (product?.id) {
                await updateItem(product.id, formData);
                toast.success('Produit mis à jour localement');
            } else {
                await addItem(formData);
                toast.success('Produit ajouté au catalogue local');
            }
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const triggerFilePicker = () => {
        const input = document.getElementById('image-upload-input') as HTMLInputElement;
        if (input) input.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-dark-surface border-dark-border text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? 'Modifier le Produit' : 'Ajouter un Produit'}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Gérez les détails du produit pour le catalogue public.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Image Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400">Image du Produit</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-dark-border bg-zinc-950/50">
                            <div
                                onClick={triggerFilePicker}
                                className="relative w-32 h-32 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center group hover:border-cortex-primary/50 cursor-pointer transition-all"
                            >
                                {formData.image ? (
                                    <>
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="text-white text-[10px] font-bold uppercase">Changer l'image</div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, image: '' }));
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 shadow-xl transform scale-0 group-hover:scale-100 transition-transform"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                        {uploading ? <Loader2 className="w-8 h-8 animate-spin text-cortex-primary" /> : <Upload className="w-8 h-8" />}
                                        <span className="text-[10px] font-medium uppercase tracking-wider">Aperçu</span>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-cortex-primary" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-3 w-full">
                                <div
                                    onClick={triggerFilePicker}
                                    className="bg-cortex-primary/10 border border-cortex-primary/30 text-cortex-primary px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-cortex-primary/20 transition-all font-medium cursor-pointer group"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                    Cliquez ici pour ajouter une image
                                </div>
                                <input
                                    id="image-upload-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <p className="text-[11px] text-zinc-500 text-center sm:text-left">
                                    Format recommandé : Square (1:1) <br />
                                    PNG, JPG ou WebP. Max 5Mo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Nom du Produit</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-zinc-950 border-dark-border text-white placeholder:text-zinc-600 focus:ring-cortex-primary/50"
                                placeholder="Ex: Basilic Genovese"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Catégorie / Tag</label>
                            <Input
                                value={formData.tag}
                                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                                className="bg-zinc-950 border-dark-border text-white placeholder:text-zinc-600 focus:ring-cortex-primary/50"
                                placeholder="Ex: Aromate, Hydro, Saison"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-zinc-950 border-dark-border text-white placeholder:text-zinc-600 min-h-[80px] focus:ring-cortex-primary/50"
                            placeholder="Description marketing courte..."
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Prix Affiché</label>
                            <Input
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="bg-zinc-950 border-dark-border text-white placeholder:text-zinc-600 focus:ring-cortex-primary/50"
                                placeholder="Ex: 4 500 FCFA / kg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Quantité</label>
                            <Input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="bg-zinc-950 border-dark-border text-white focus:ring-cortex-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Unité</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                className="flex h-10 w-full rounded-md border border-dark-border bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cortex-primary/50"
                            >
                                <option value="kg">Kilogramme (kg)</option>
                                <option value="pièce">Pièce</option>
                                <option value="bouquet">Bouquet</option>
                                <option value="sac">Sac</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={formData.inStock}
                            onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                            className="w-4 h-4 rounded border-dark-border bg-zinc-950 text-cortex-primary focus:ring-cortex-primary"
                        />
                        <label htmlFor="inStock" className="text-sm font-medium text-zinc-300 cursor-pointer">
                            Disponible en stock
                        </label>
                    </div>

                    <DialogFooter className="pt-4 border-t border-dark-border">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading || uploading} className="bg-cortex-primary hover:bg-cortex-primary-light text-white">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {product ? 'Enregistrer les modifications' : 'Ajouter le Produit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
