'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, X, ShieldCheck, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { useGardenStore, GardenProduct } from '@/lib/store/garden-store';

interface HarvestFormV2Props {
    isOpen: boolean;
    onClose: () => void;
    product?: GardenProduct | null;
}

const compressImage = (base64: string, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
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

export function HarvestFormV2({ isOpen, onClose, product }: HarvestFormV2Props) {
    const [loading, setLoading] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const { addItem, updateItem } = useGardenStore();

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const result = e.target?.result as string;
                // Compression immédiate pour préserver le localStorage
                const compressed = await compressImage(result);
                setLocalPreview(compressed);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    useEffect(() => {
        if (product && isOpen) {
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
            setLocalPreview(product.image || null);
        } else if (isOpen) {
            resetForm();
        }
    }, [product, isOpen]);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '4 500 FCFA / kg',
            tag: 'Aromate',
            quantity: 0,
            unit: 'kg',
            inStock: true,
            image: ''
        });
        setLocalPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🚀 DÉBUT SUBMIT (MODE ZUSTAND/BASE64) - Data:', formData);

        if (!formData.name.trim()) {
            toast.error('Le nom du produit est obligatoire');
            return;
        }

        if (!localPreview && !formData.image) {
            toast.error('Veuillez ajouter une image pour le catalogue');
            return;
        }

        setLoading(true);

        try {
            const finalImage = localPreview || formData.image;
            const productData = {
                ...formData,
                image: finalImage,
            };

            if (product?.id) {
                console.log('📝 Mise à jour via Store:', product.id);
                await updateItem(product.id, productData);
                toast.success('Produit mis à jour localement');
            } else {
                console.log('➕ Ajout via Store...');
                await addItem(productData);
                toast.success('Produit ajouté instantanément');
            }
            onClose();
            resetForm();
        } catch (error: any) {
            console.error('❌ ERREUR FORM:', error);
            toast.error(`Erreur: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-[#09090b] border-zinc-800 text-white p-0 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-cortex-primary/10 to-transparent p-6 border-b border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <span className="p-2 bg-cortex-primary/10 rounded-lg text-cortex-primary">
                                <ShoppingBag className="w-6 h-6" />
                            </span>
                            {product ? 'Modifier l\'article' : 'Ajouter au Catalogue Garden'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 mt-1">
                            Style Restaurant : L'image sera stockée directement dans votre catalogue.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Zone Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`
                                relative w-full md:w-48 h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                                ${isDragActive ? 'border-cortex-primary bg-cortex-primary/5' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900'}
                                ${localPreview ? 'border-none p-0 shadow-xl' : ''}
                            `}
                        >
                            <input {...getInputProps()} />
                            {localPreview ? (
                                <div className="w-full h-full relative group">
                                    <picture>
                                        <img src={localPreview} alt="Preview" className="w-full h-full object-cover" />
                                    </picture>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                        <Upload className="w-6 h-6 mb-2 text-white" />
                                        <span className="text-[10px] font-bold uppercase text-white">Changer l'image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500 gap-2">
                                    <div className="p-3 bg-zinc-800 rounded-full">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Image du produit</span>
                                    <span className="text-[9px] text-zinc-600">Glisser-déposer ici</span>
                                </div>
                            )}
                        </div>

                        {/* Champs Identité */}
                        <div className="flex-1 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Désignation</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Ex: Basilic Grand Vert Aquaponique"
                                    className="h-12 bg-zinc-900/50 border-zinc-800 focus:border-cortex-primary/50 text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Catégorie / Tag</label>
                                <Input
                                    value={formData.tag}
                                    onChange={(e) => setFormData(p => ({ ...p, tag: e.target.value }))}
                                    placeholder="Ex: Aromate, Frais, Saison"
                                    className="h-12 bg-zinc-900/50 border-zinc-800 focus:border-cortex-primary/50 text-zinc-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description Marketing</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                            placeholder="Mettez en avant les qualités du produit..."
                            className="bg-zinc-900/50 border-zinc-800 focus:border-cortex-primary/50 min-h-[100px] resize-none leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Prix Affiché</label>
                            <Input
                                value={formData.price}
                                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                                className="bg-zinc-950 border-zinc-800 font-mono text-cortex-success"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Qté Disponible</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData(p => ({ ...p, quantity: Number(e.target.value) }))}
                                    className="bg-zinc-950 border-zinc-800 w-24 text-center"
                                />
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))}
                                    className="flex-1 h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-300"
                                >
                                    <option value="kg">kg</option>
                                    <option value="pièce">pièce</option>
                                    <option value="bouquet">bouquet</option>
                                    <option value="sac">sac</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-800 select-none">
                                <input
                                    type="checkbox"
                                    id="inStockV2"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData(p => ({ ...p, inStock: e.target.checked }))}
                                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-cortex-primary"
                                />
                                <label htmlFor="inStockV2" className="text-sm font-semibold text-zinc-300 cursor-pointer">
                                    En Stock
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col-reverse md:flex-row gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 text-zinc-500 hover:text-white"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-cortex-primary hover:bg-cortex-primary-light text-white font-bold h-12 shadow-lg shadow-cortex-primary/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Validation...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 mr-3" />
                                    {product ? 'Valider les modifications' : 'Publier au Catalogue'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
