'use client';

import React, { useState, useEffect } from 'react';
import { usePacksStore, PackItem } from '@/lib/store/packs-store';
import { useGalleryStore } from '@/lib/store/gallery-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Edit2, X, Save, Image as ImageIcon, Utensils, Home, Package, Gift, Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { toast } from 'sonner';

const ICONS = {
    utensils: <Utensils size={24} />,
    home: <Home size={24} />,
    package: <Package size={24} />,
    gift: <Gift size={24} />
};

const COLORS = [
    { label: 'Orange', value: 'bg-orange-50', text: 'text-orange-500' },
    { label: 'Vert', value: 'bg-green-50', text: 'text-green-500' },
    { label: 'Violet', value: 'bg-purple-50', text: 'text-purple-500' },
    { label: 'Bleu', value: 'bg-blue-50', text: 'text-blue-500' },
];

export const PacksManager = () => {
    // Stores
    const { packs, isLoading, listenToPacks, addPack, deletePack, updatePack, uploadFile } = usePacksStore();
    const { items: galleryItems, listenToGallery } = useGalleryStore();

    // Local State
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Media Selector State
    const [showMediaSelector, setShowMediaSelector] = useState(false);

    // Drag & Drop State
    const [dragActive, setDragActive] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<PackItem>>({
        title: '',
        price: '',
        desc: '',
        items: [],
        image: '',
        promo: '',
        bg: 'bg-orange-50',
        iconType: 'utensils'
    });

    const [newItemInput, setNewItemInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Listeners
    useEffect(() => {
        const unsubscribePacks = listenToPacks();
        const unsubscribeGallery = listenToGallery();
        return () => {
            unsubscribePacks();
            unsubscribeGallery();
        };
    }, [listenToPacks, listenToGallery]);

    const resetForm = () => {
        setFormData({
            title: '',
            price: '',
            desc: '',
            items: [],
            image: '',
            promo: '',
            bg: 'bg-orange-50',
            iconType: 'utensils'
        });
        setNewItemInput('');
        setImageFile(null);
        setIsEditing(null);
        setIsFormOpen(false);
        setDragActive(false);
    };

    // Drag Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('image/')) {
                setImageFile(droppedFile);
            } else {
                toast.error("Veuillez déposer une image valide");
            }
        }
    };

    const handleAddItem = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newItemInput.trim()) {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                items: [...(prev.items || []), newItemInput.trim()]
            }));
            setNewItemInput('');
        }
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.filter((_, i) => i !== index)
        }));
    };

    // --- ENHANCED HANDLESUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🚀 DÉBUT SUBMIT PACK (ZUSTAND/HYBRID) - Data:', formData);

        // Validation Explicite
        if (!formData.title?.trim()) {
            toast.error('Le titre du pack est obligatoire');
            return;
        }

        if (!formData.price?.trim()) {
            toast.error('Le prix est obligatoire');
            return;
        }

        // Validation Image : Soit une URL déjà là (Galerie/Edit), soit un fichier locale à upload
        if (!formData.image && !imageFile) {
            toast.error('Veuillez ajouter une image (Via Galerie ou Upload)');
            return;
        }

        setIsUploading(true);

        try {
            let finalImageUrl = formData.image;

            // Gestion de l'image locale (Upload)
            if (imageFile) {
                console.log('📤 Tentative upload image locale...');
                try {
                    finalImageUrl = await uploadFile(imageFile);
                } catch (err: any) {
                    console.error("Upload failed, maybe trying specific fallback or just failing hard if no other option");
                    throw new Error("Échec de l'upload: " + err.message);
                }
            }

            if (!finalImageUrl) throw new Error("Impossible de sécuriser une URL pour l'image");

            const packData = {
                ...formData,
                image: finalImageUrl,
                items: formData.items || [],
                price: formData.price,
                title: formData.title,
                desc: formData.desc || ''
            } as any;

            if (isEditing) {
                console.log('📝 Mise à jour Pack:', isEditing);
                await updatePack(isEditing, packData);
                toast.success("Pack mis à jour avec succès !");
            } else {
                console.log('➕ Création Nouveau Pack');
                await addPack(packData);
                toast.success("Nouveau pack créé !");
            }

            resetForm();
        } catch (error: any) {
            console.error('❌ ERREUR FORM PACK:', error);
            toast.error(`Erreur: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };
    // ----------------------------

    const handleEdit = (pack: PackItem) => {
        setFormData(pack);
        setImageFile(null);
        setIsEditing(pack.id);
        setIsFormOpen(true);
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>;

    // Image Preview Logic
    const previewUrl = imageFile ? URL.createObjectURL(imageFile) : formData.image;

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Packs Malins</h2>
                    <p className="text-neutral-400">Créez et modifiez les offres groupées de la boutique.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-[var(--color-primary)] text-black font-bold hover:bg-[var(--color-primary-light)]">
                    <Plus className="mr-2" size={18} /> Nouveau Pack
                </Button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map(pack => (
                    <Card key={pack.id} className="overflow-hidden flex flex-col group relative border border-neutral-800 bg-neutral-900 shadow-lg hover:border-[var(--color-primary)] transition-all duration-300">
                        <div className="relative h-48 bg-neutral-800">
                            {pack.image ? (
                                <Image src={pack.image} alt={pack.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-neutral-600"><ImageIcon size={48} /></div>
                            )}
                            {pack.promo && (
                                <span className="absolute top-2 right-2 bg-[var(--color-primary)] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    {pack.promo}
                                </span>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 p-0 rounded-full" onClick={() => handleEdit(pack)}>
                                    <Edit2 size={18} />
                                </Button>
                                <Button size="sm" variant="primary" className="bg-red-500/20 hover:bg-red-500/40 text-red-500 w-10 h-10 p-0 rounded-full border border-red-500/30" onClick={() => {
                                    if (confirm('Supprimer ce pack ?')) deletePack(pack.id);
                                }}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-white group-hover:text-[var(--color-primary)] transition-colors">{pack.title}</h3>
                                <div className={cn("p-2 rounded-lg opacity-80", pack.bg)}>
                                    {pack.iconType === 'home' ? <Home size={18} className="text-green-600" /> :
                                        pack.iconType === 'package' ? <Package size={18} className="text-purple-600" /> :
                                            pack.iconType === 'gift' ? <Gift size={18} className="text-blue-600" /> :
                                                <Utensils size={18} className="text-orange-600" />}
                                </div>
                            </div>
                            <p className="text-sm text-neutral-400 mb-4 line-clamp-2 leading-relaxed">{pack.desc}</p>
                            <div className="mt-auto pt-4 border-t border-neutral-800 flex justify-between items-center">
                                <span className="font-bold text-[var(--color-primary)]">{pack.price}</span>
                                <span className="text-xs text-neutral-500 font-medium">{pack.items.length} articles</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 p-8 shadow-2xl rounded-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{isEditing ? 'Modifier le Pack' : 'Créer un Pack'}</h3>
                            <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Selection Area */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Image du Pack</label>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Option 1: Gallery Selector (Primary) */}
                                    {/* Removed onClick={() => setShowMediaSelector(true)} from parent div to avoid bubbling issues if needed, strictly on click is fine */}
                                    <div
                                        onClick={() => setShowMediaSelector(true)}
                                        className={cn(
                                            "relative h-32 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-lg",
                                            !imageFile && formData.image ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5" : ""
                                        )}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <ImageIcon size={20} className="text-[var(--color-primary)]" />
                                        </div>
                                        <div className="text-xs font-bold text-white uppercase tracking-wider">Choisir du Stock</div>
                                        <div className="text-[10px] text-neutral-400">Médias existants</div>
                                    </div>

                                    {/* Option 2: Direct Upload (Secondary) */}
                                    <div
                                        className={cn(
                                            "relative h-32 rounded-xl border-2 border-dashed border-neutral-800 bg-black/20 hover:border-neutral-600 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden opacity-60 hover:opacity-100",
                                            dragActive ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 opacity-100" : ""
                                        )}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('pack-image-upload')?.click()}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-neutral-500">
                                            <UploadCloud size={20} />
                                        </div>
                                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Upload / Drop</div>
                                        <input
                                            id="pack-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>

                                {/* Preview Area if Image Selected */}
                                {previewUrl && (
                                    <div className="relative h-48 w-full rounded-xl border border-neutral-700 overflow-hidden bg-black group mt-4 animate-in fade-in">
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                            <Button type="button" size="sm" onClick={() => setShowMediaSelector(true)} variant="outline" className="border-white/20 text-white hover:bg-white/20">Changer</Button>
                                            <Button type="button" size="sm" onClick={() => { setImageFile(null); setFormData(p => ({ ...p, image: '' })) }} variant="destructive">Retirer</Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Titre</label>
                                    <input
                                        required
                                        className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Pack Apéro"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Prix</label>
                                    <input
                                        required
                                        className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="Ex: 15 000 FCFA"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Description</label>
                                <textarea
                                    className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none h-24 transition-all resize-none"
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="Décrivez le contenu..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Thème</label>
                                    <select
                                        className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none cursor-pointer"
                                        value={formData.bg}
                                        onChange={e => setFormData({ ...formData, bg: e.target.value })}
                                    >
                                        {COLORS.map(c => <option key={c.value} value={c.value} className="bg-neutral-900 text-white">{c.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Icône</label>
                                    <select
                                        className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none cursor-pointer"
                                        value={formData.iconType}
                                        onChange={e => setFormData({ ...formData, iconType: e.target.value as any })}
                                    >
                                        <option value="utensils" className="bg-neutral-900">Ustensiles</option>
                                        <option value="home" className="bg-neutral-900">Maison</option>
                                        <option value="package" className="bg-neutral-900">Colis</option>
                                        <option value="gift" className="bg-neutral-900">Cadeau</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Badge Promo</label>
                                <input
                                    className="w-full bg-black/50 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    value={formData.promo}
                                    onChange={e => setFormData({ ...formData, promo: e.target.value })}
                                    placeholder="Ex: -20%"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Contenu</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        className="flex-1 bg-black/50 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                        placeholder="Ajouter un article et Entrée..."
                                        value={newItemInput}
                                        onChange={e => setNewItemInput(e.target.value)}
                                        onKeyDown={handleAddItem}
                                    />
                                    <Button type="button" onClick={() => {
                                        if (newItemInput.trim()) {
                                            setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItemInput.trim()] }));
                                            setNewItemInput('');
                                        }
                                    }} className="bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700">Ajouter</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 p-4 bg-black/30 rounded-lg border border-neutral-800 min-h-[60px]">
                                    {(!formData.items || formData.items.length === 0) && (
                                        <span className="text-neutral-600 text-sm italic">Aucun article ajouté.</span>
                                    )}
                                    {formData.items?.map((item, i) => (
                                        <span key={i} className="bg-neutral-800 border border-neutral-700 text-zinc-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeItem(i)} className="text-neutral-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-[var(--color-primary)] h-12 text-lg font-bold text-black hover:bg-[var(--color-primary-light)] shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] transition-all" disabled={isUploading}>
                                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                {isEditing ? 'Sauvegarder' : 'Créer le Pack'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Media Selector Modal */}
            {showMediaSelector && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <Card className="w-full max-w-5xl h-[85vh] bg-neutral-900 border border-neutral-800 flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Médiathèque du Jardin</h3>
                                <p className="text-xs text-neutral-400 mt-1">Sélectionnez une ressource existante à utiliser dans votre pack.</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowMediaSelector(false)} className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-black/40">
                            {galleryItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-6">
                                    <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center">
                                        <ImageIcon size={40} className="opacity-20 text-white" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-medium text-neutral-400">Aucun média dans le stock</p>
                                        <p className="text-sm text-neutral-600 max-w-xs mx-auto">Votre galerie est vide. Veuillez uploader des images dans la section "Gallerie & Photos" ou utiliser l'upload local.</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setShowMediaSelector(false)} className="border-neutral-700">Retour</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {galleryItems.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, image: item.url }));
                                                setImageFile(null); // Clear local file if picking from gallery
                                                setShowMediaSelector(false);
                                            }}
                                            className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-800 cursor-pointer bg-neutral-800 hover:border-[var(--color-primary)] hover:ring-2 hover:ring-[var(--color-primary)]/50 transition-all duration-200"
                                        >
                                            <Image
                                                src={item.url}
                                                alt={item.title || 'Media'}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                <span className="text-xs text-white font-bold truncate">{item.title}</span>
                                                <span className="text-[10px] text-[var(--color-primary)] font-medium uppercase mt-0.5">Sélectionner</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex justify-end">
                            <span className="text-xs text-neutral-500 self-center mr-auto">
                                {galleryItems.length} éléments trouvés
                            </span>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
