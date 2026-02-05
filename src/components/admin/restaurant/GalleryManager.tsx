'use client';

import React, { useState, useEffect } from 'react';
import { useGalleryStore, GalleryItem, MediaType } from '@/lib/store/gallery-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Video, Trash2, Plus, Loader2, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GalleryManager = () => {
    const { items, isLoading, listenToGallery, addItem, deleteItem, uploadFile } = useGalleryStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [newItem, setNewItem] = useState({
        url: '',
        type: 'image' as MediaType,
        title: '',
        aspectRatio: 'square' as any
    });

    useEffect(() => {
        const unsubscribe = listenToGallery();
        return () => unsubscribe();
    }, [listenToGallery]);

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
            setFile(droppedFile);
            setNewItem({ ...newItem, type: droppedFile.type.startsWith('video') ? 'video' : 'image' });
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let finalUrl = newItem.url;

            if (file) {
                const path = `gallery/${Date.now()}-${file.name}`;
                finalUrl = await uploadFile(file, path);
            }

            if (!finalUrl) throw new Error("Veuillez sélectionner un fichier ou entrer une URL");

            await addItem({ ...newItem, url: finalUrl });
            setIsAdding(false);
            setNewItem({ url: '', type: 'image', title: '', aspectRatio: 'square' });
            setFile(null);
        } catch (error: any) {
            console.error('Error adding gallery item:', error);
            if (error.code === 'storage/retry-limit-exceeded') {
                alert("Erreur de connexion au stockage. Vérifiez votre connexion internet ou la configuration du 'Storage Bucket' Firebase.");
            } else if (error.code === 'storage/unauthorized') {
                alert("Permission refusée. Vérifiez les règles de sécurité Firebase Storage.");
            } else {
                alert(`Erreur: ${error.message}`);
            }
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Galerie viTEDia</h2>
                    <p className="text-zinc-500 text-sm">Gérez les images et vidéos du restaurant</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-[var(--color-primary)]">
                    <Plus size={18} className="mr-2" /> Ajouter un média
                </Button>
            </div>

            {/* Modal Ajout */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg bg-neutral-900 border-neutral-800 p-8 text-white shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">Nouveau Média</h3>
                            <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-6">
                            {/* Drag & Drop Zone */}
                            <div
                                className={cn(
                                    "relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3",
                                    dragActive ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-neutral-800 bg-black/20",
                                    file ? "border-solid border-[var(--color-primary)] bg-[var(--color-primary)]/5" : ""
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*,video/*"
                                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                                />
                                {file ? (
                                    <div className="text-center p-4">
                                        <div className="text-[var(--color-primary)] font-bold mb-1 truncate max-w-[300px]">{file.name}</div>
                                        <div className="text-xs text-neutral-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="mt-2 text-xs text-red-400 hover:underline"
                                        >
                                            Changer de fichier
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                                            <Plus size={24} className="text-zinc-400" />
                                        </div>
                                        <div className="text-sm font-medium">Déposez un fichier ici ou cliquez pour parcourir</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Images (JPG, PNG, WEBP) ou Vidéos (MP4)</div>
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 uppercase tracking-tighter">Titre / Légende</label>
                                    <input
                                        required
                                        value={newItem.title}
                                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                        placeholder="Ex: Notre nouveau cocktail"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 uppercase tracking-tighter">Format d'affichage</label>
                                    <select
                                        value={newItem.aspectRatio}
                                        onChange={e => setNewItem({ ...newItem, aspectRatio: e.target.value as any })}
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="square">Carré (1:1)</option>
                                        <option value="wide">Large (2:1)</option>
                                        <option value="tall">Haut (1:2)</option>
                                        <option value="large">En grand (2:2)</option>
                                    </select>
                                </div>
                            </div>

                            {!file && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Ou URL externe</label>
                                    <input
                                        value={newItem.url}
                                        onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                                        className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                className="bg-[var(--color-primary)] h-14 text-lg font-bold"
                                loading={isUploading}
                            >
                                {isUploading ? 'Chargement...' : "Confirmer l'ajout"}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Grid Affichage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-800 rounded-2xl text-neutral-500">
                        Aucun média dans la galerie
                    </div>
                ) : (
                    items.map((item) => (
                        <Card key={item.id} className="relative group bg-neutral-900 border-neutral-800 overflow-hidden pt-[100%] h-0">
                            <div className="absolute inset-0">
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        <Video className="text-neutral-700" size={48} />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                    <p className="text-white font-bold mb-1">{item.title}</p>
                                    <div className="flex gap-2">
                                        <a href={item.url} target="_blank" rel="noopener" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                            <ExternalLink size={18} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                if (confirm('Supprimer ce média ?')) deleteItem(item.id);
                                            }}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute top-2 left-2">
                                    <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white flex items-center gap-1">
                                        {item.type === 'image' ? <ImageIcon size={10} /> : <Video size={10} />}
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
