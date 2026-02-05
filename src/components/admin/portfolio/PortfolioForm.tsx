'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioStore, PortfolioItem, PortfolioCategory, MediaType, LayoutPosition } from '@/lib/store/portfolio-store';
import { useGalleryStore } from '@/lib/store/gallery-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Save,
    X,
    Image as ImageIcon,
    Video,
    UploadCloud,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    Layout,
    Globe,
    ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORIES: PortfolioCategory[] = ['Logo', 'Web', 'Packaging', 'Print', 'Social'];

interface PortfolioFormProps {
    id?: string;
}

export function PortfolioForm({ id }: PortfolioFormProps) {
    const router = useRouter();
    const isEditing = id && id !== 'new';

    const { items, addItem, updateItem, listenToPortfolio } = usePortfolioStore();
    const { items: galleryItems, listenToGallery, uploadFile } = useGalleryStore();

    const [isLoading, setIsLoading] = useState(false);
    const [showMediaSelector, setShowMediaSelector] = useState(false);
    const [localFile, setLocalFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<Partial<PortfolioItem>>({
        title: '',
        description: '',
        clientName: '',
        category: 'Logo',
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        layoutPosition: 'masonry_auto',
        displayOrder: 0,
        status: 'draft',
        altText: ''
    });

    useEffect(() => {
        const unsubPortfolio = listenToPortfolio();
        const unsubGallery = listenToGallery();

        if (isEditing) {
            const item = items.find(i => i.id === id);
            if (item) {
                setFormData(item);
            }
        }

        return () => {
            unsubPortfolio();
            unsubGallery();
        };
    }, [isEditing, id, items, listenToPortfolio, listenToGallery]);

    const handleChange = (field: keyof PortfolioItem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title?.trim()) {
            toast.error("Le titre est obligatoire");
            return;
        }

        if (!formData.mediaUrl && !localFile) {
            toast.error("Un média est requis");
            return;
        }

        setIsLoading(true);

        try {
            let finalMediaUrl = formData.mediaUrl || '';
            let finalThumbnailUrl = formData.thumbnailUrl || '';

            // Handle local upload
            if (localFile) {
                const path = `portfolio/${Date.now()}-${localFile.name}`;
                const uploadedUrl = await uploadFile(localFile, path);
                finalMediaUrl = uploadedUrl;

                // If it's an image, thumbnail can be the same. 
                // If it's a video, we rely on the user to provide a poster or we use a default
                if (formData.mediaType === 'image') {
                    finalThumbnailUrl = uploadedUrl;
                }
            }

            const payload: any = {
                ...formData,
                mediaUrl: finalMediaUrl,
                thumbnailUrl: finalThumbnailUrl || finalMediaUrl, // Fallback to mediaUrl
                displayOrder: Number(formData.displayOrder)
            };

            if (isEditing && id) {
                await updateItem(id, payload);
            } else {
                await addItem(payload);
            }

            toast.success(isEditing ? "Projet mis à jour !" : "Projet créé !");
            router.push('/admin/portfolio/infographie');
        } catch (error: any) {
            console.error("Submit Error:", error);
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    };

    const previewUrl = localFile ? URL.createObjectURL(localFile) : formData.thumbnailUrl || formData.mediaUrl;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0 text-neutral-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {isEditing ? `Modifier "${formData.title}"` : "Nouveau Projet Portfolio"}
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {isEditing ? "Mettez à jour les détails du projet." : "Ajoutez une nouvelle réalisation à votre portfolio."}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 rounded-full px-4 py-1.5 shadow-sm">
                        <Label htmlFor="status-mode" className="text-[10px] font-bold text-neutral-400 cursor-pointer uppercase tracking-wider">
                            {formData.status === 'published' ? 'En Ligne' : 'Brouillon'}
                        </Label>
                        <Switch
                            id="status-mode"
                            checked={formData.status === 'published'}
                            onCheckedChange={(c) => handleChange('status', c ? 'published' : 'draft')}
                        />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Media & Layout */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-neutral-900 border-neutral-800 p-6 overflow-hidden">
                        <Label className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest mb-4 block">Aperçu Média</Label>

                        <div className="relative aspect-square rounded-xl bg-black border border-neutral-800 overflow-hidden mb-6 group">
                            {previewUrl ? (
                                formData.mediaType === 'video' ? (
                                    <video src={formData.mediaUrl} poster={formData.thumbnailUrl} className="w-full h-full object-cover" muted />
                                ) : (
                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                )
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-neutral-700 gap-2">
                                    <ImageIcon size={40} />
                                    <span className="text-[10px] font-bold">AUCUN MÉDIA</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button type="button" size="sm" variant="outline" className="text-xs h-8" onClick={() => setShowMediaSelector(true)}>
                                    Galerie
                                </Button>
                                <label className="text-xs h-8 bg-white text-black px-3 rounded-md flex items-center justify-center font-bold cursor-pointer hover:bg-neutral-200 transition-colors">
                                    Upload
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
                                        onChange={e => {
                                            if (e.target.files?.[0]) {
                                                setLocalFile(e.target.files[0]);
                                                handleChange('mediaUrl', '');
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg bg-neutral-800", formData.mediaType === 'video' ? "text-red-500" : "text-blue-500")}>
                                        {formData.mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{formData.mediaType}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] uppercase font-black text-neutral-500 hover:text-[var(--color-primary)]"
                                    onClick={() => handleChange('mediaType', formData.mediaType === 'video' ? 'image' : 'video')}
                                >
                                    Changer
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Position Layout</Label>
                                <select
                                    className="w-full bg-black/40 border border-neutral-800 rounded-lg p-2.5 text-xs text-white uppercase font-bold focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    value={formData.layoutPosition}
                                    onChange={e => handleChange('layoutPosition', e.target.value)}
                                >
                                    <option value="masonry_auto">Masonry Auto</option>
                                    <option value="featured_left">En Avant (Gauche)</option>
                                    <option value="grid_right">Grillage (Droite)</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-neutral-900 border-neutral-800 p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Titre du Projet</Label>
                                <Input
                                    className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white font-bold"
                                    placeholder="Ex: Branding TEDSAI"
                                    value={formData.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Catégorie</Label>
                                <select
                                    className="w-full bg-black/40 border border-neutral-800 rounded-lg p-2.5 text-xs text-white uppercase font-bold focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Nom du Client</Label>
                                <Input
                                    className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white"
                                    placeholder="Ex: Ministère de l'Agriculture"
                                    value={formData.clientName}
                                    onChange={e => handleChange('clientName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Ordre d'affichage</Label>
                                <Input
                                    type="number"
                                    className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white font-mono"
                                    value={formData.displayOrder}
                                    onChange={e => handleChange('displayOrder', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Description du projet</Label>
                            <Textarea
                                className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white min-h-[120px] text-sm"
                                placeholder="Détails de la mission, enjeux, résultats..."
                                value={formData.description}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Tags / SEO (Alt Text)</Label>
                            <Input
                                className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white text-xs"
                                placeholder="Mots-clés séparés par des virgules"
                                value={formData.altText}
                                onChange={e => handleChange('altText', e.target.value)}
                            />
                        </div>

                        {formData.mediaType === 'video' && (
                            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start gap-3">
                                <Video className="text-red-500 shrink-0" size={18} />
                                <div>
                                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-tighter">Paramètres Vidéo</h4>
                                    <p className="text-xs text-neutral-400 mt-1">L'upload supporte le .mp4 et .mov. Assurez-vous d'avoir une image de poster définie via la médiathèque pour l'aperçu statique.</p>
                                    <div className="mt-4 flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Poster/Thumbnail URL</Label>
                                            <Input
                                                className="bg-black/40 border-neutral-800 text-xs text-neutral-400"
                                                placeholder="Laissez vide pour utiliser MediaUrl"
                                                value={formData.thumbnailUrl}
                                                onChange={e => handleChange('thumbnailUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="flex justify-end gap-4 p-4">
                        <Button type="button" variant="ghost" onClick={() => router.push('/admin/portfolio/infographie')} className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[var(--color-primary)] text-black font-black px-12 h-12 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 uppercase tracking-tighter">
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                            Sauvegarder Projet
                        </Button>
                    </div>
                </div>
            </form>

            {/* Media Selector Modal */}
            {showMediaSelector && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <Card className="w-full max-w-5xl h-[85vh] bg-neutral-900 border border-neutral-800 flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Médiathèque</h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowMediaSelector(false)} className="text-neutral-400">
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-black/40">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {galleryItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            handleChange(formData.mediaType === 'video' ? 'thumbnailUrl' : 'mediaUrl', item.url);
                                            if (formData.mediaType === 'image') setLocalFile(null);
                                            setShowMediaSelector(false);
                                        }}
                                        className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-800 cursor-pointer bg-neutral-800 hover:border-[var(--color-primary)]"
                                    >
                                        <Image src={item.url} alt="Media" fill className="object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
