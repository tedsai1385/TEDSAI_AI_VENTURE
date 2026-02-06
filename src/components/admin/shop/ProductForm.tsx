'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductsStore, Product, ProductBadge, ProductCategory } from '@/lib/store/products-store';
import { useGalleryStore } from '@/lib/store/gallery-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
    Save,
    X,
    Image as ImageIcon,
    UploadCloud,
    Loader2,
    ArrowLeft,
    Box,
    Tag,
    Globe,
    AlertCircle,
    Eye,
    EyeOff,
    CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BADGE_COLORS: Record<string, string> = {
    'IGP': 'bg-blue-600 text-white',
    'Bio': 'bg-green-600 text-white',
    'Rare': 'bg-amber-600 text-white',
    'Artisanal': 'bg-orange-700 text-white',
    'Montagne': 'bg-slate-600 text-white',
    'Village': 'bg-emerald-700 text-white',
    'Fort': 'bg-red-700 text-white',
    'Nouveau': 'bg-purple-600 text-white'
};

const AVAILABLE_BADGES: ProductBadge[] = ['IGP', 'Bio', 'Rare', 'Artisanal', 'Montagne', 'Village', 'Fort', 'Nouveau'];

const CATEGORIES: { id: ProductCategory; label: string; color: string }[] = [
    { id: 'epices', label: 'Épices', color: 'bg-orange-900/20 text-orange-400 border-orange-800' },
    { id: 'sucres', label: 'Sucrés', color: 'bg-pink-900/20 text-pink-400 border-pink-800' },
    { id: 'huiles', label: 'Huiles', color: 'bg-yellow-900/20 text-yellow-400 border-yellow-800' },
    { id: 'super-aliments', label: 'Super-aliments', color: 'bg-purple-900/20 text-purple-400 border-purple-800' },
    { id: 'frais', label: 'Frais', color: 'bg-green-900/20 text-green-400 border-green-800' },
    { id: 'autre', label: 'Autre', color: 'bg-neutral-800 text-neutral-400' },
];

interface ProductFormProps {
    productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const isEditing = productId && productId !== 'new';

    const { products, addProduct, updateProduct, listenToProducts } = useProductsStore();
    const { items: galleryItems, listenToGallery, uploadFile } = useGalleryStore();

    const [isLoading, setIsLoading] = useState(false);
    const [showMediaSelector, setShowMediaSelector] = useState(false);
    const [localImageFile, setLocalImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        slug: '',
        category: 'epices',
        priceVal: 0,
        description: '',
        shortDescription: '',
        weightVolume: '',
        stock: 0,
        badges: [],
        mainImage: '',
        galleryImages: [],
        isFeatured: false
    });

    useEffect(() => {
        const unsubProducts = listenToProducts();
        const unsubGallery = listenToGallery();

        if (isEditing) {
            const product = products.find(p => p.id === productId);
            if (product) {
                setFormData(product);
            }
        }

        return () => {
            unsubProducts();
            unsubGallery();
        };
    }, [isEditing, productId, products, listenToProducts, listenToGallery]);

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleBadge = (badge: ProductBadge) => {
        const currentBadges = formData.badges || [];
        if (currentBadges.includes(badge)) {
            handleChange('badges', currentBadges.filter(b => b !== badge));
        } else {
            handleChange('badges', [...currentBadges, badge]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            toast.error("Le nom est obligatoire");
            return;
        }

        if ((!formData.mainImage) && !localImageFile) {
            toast.error("Une image principale est requise");
            return;
        }

        setIsLoading(true);

        try {
            let finalImageUrl = formData.mainImage || '';

            if (localImageFile) {
                const sanitizedFileName = localImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '');
                finalImageUrl = await uploadFile(localImageFile, `products/${Date.now()}-${sanitizedFileName}`);
            }

            const payload: any = {
                ...formData,
                mainImage: finalImageUrl,
                price: `${formData.priceVal || 0} FCFA`,
                priceVal: Math.max(0, Number(formData.priceVal || 0)),
                stock: Math.max(0, Number(formData.stock || 0))
            };

            console.log('📦 Payload avant envoi:', { stock: payload.stock, priceVal: payload.priceVal, status: payload.status });

            if (isEditing && productId) {
                await updateProduct(productId, payload);
                toast.success("Produit mis à jour !");
            } else {
                await addProduct(payload);
                toast.success("Produit créé !");
            }
            router.push('/admin/shop/products');
        } catch (error: any) {
            console.error("Submit Error:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const previewUrl = localImageFile ? URL.createObjectURL(localImageFile) : formData.mainImage;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0 text-neutral-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {isEditing ? `Modifier "${formData.name}"` : "Nouveau Trésor"}
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {isEditing ? "Mettez à jour les informations du produit." : "Ajoutez un nouveau produit au catalogue."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="bg-neutral-900 border border-neutral-800 w-full justify-start h-auto p-1 rounded-xl mb-6">
                        <TabsTrigger value="general" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-black py-2.5 px-4 rounded-lg flex gap-2">
                            <Box size={16} /> Général
                        </TabsTrigger>
                        <TabsTrigger value="media" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-black py-2.5 px-4 rounded-lg flex gap-2">
                            <ImageIcon size={16} /> Médias
                        </TabsTrigger>
                        <TabsTrigger value="badges" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-black py-2.5 px-4 rounded-lg flex gap-2">
                            <Tag size={16} /> Badges
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-black py-2.5 px-4 rounded-lg flex gap-2">
                            <Globe size={16} /> SEO
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-neutral-400 text-xs uppercase font-bold">Nom du produit</Label>
                                    <Input
                                        className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white text-lg font-bold"
                                        placeholder="Ex: Poivre de Penja"
                                        value={formData.name}
                                        onChange={e => {
                                            const val = e.target.value;
                                            handleChange('name', val);
                                            // Auto-slugify en mode création si le slug est vide
                                            if (!isEditing && !formData.slug) {
                                                const slug = val.toLowerCase()
                                                    .replace(/[^\w ]+/g, '')
                                                    .replace(/ +/g, '-');
                                                handleChange('slug', slug);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-neutral-400 text-xs uppercase font-bold">Catégorie</Label>
                                    <select
                                        className="w-full bg-black/40 border border-neutral-800 rounded-md p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                        value={formData.category}
                                        onChange={e => handleChange('category', e.target.value)}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-neutral-400 text-xs uppercase font-bold">Prix (FCFA)</Label>
                                    <Input
                                        type="number"
                                        className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white"
                                        value={formData.priceVal ?? ''}
                                        onChange={e => handleChange('priceVal', e.target.value === '' ? undefined : Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-neutral-400 text-xs uppercase font-bold">Conditionnement</Label>
                                    <Input
                                        className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white"
                                        placeholder="Ex: 50g, 1L"
                                        value={formData.weightVolume}
                                        onChange={e => handleChange('weightVolume', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-neutral-400 text-xs uppercase font-bold">Stock Disponible</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleChange('stock', Math.max(0, (formData.stock || 0) - 10))}
                                            className="shrink-0"
                                        >
                                            -10
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleChange('stock', Math.max(0, (formData.stock || 0) - 1))}
                                            className="shrink-0"
                                        >
                                            -1
                                        </Button>

                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.stock ?? 0}
                                            onChange={e => handleChange('stock', Math.max(0, parseInt(e.target.value) || 0))}
                                            className={cn(
                                                "bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white text-center text-xl font-mono w-32",
                                                (formData.stock || 0) < 5 && (formData.stock || 0) > 0 ? "border-orange-500/50" : "",
                                                (formData.stock || 0) === 0 ? "border-red-500/50" : ""
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleChange('stock', (formData.stock || 0) + 1)}
                                            className="shrink-0"
                                        >
                                            +1
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleChange('stock', (formData.stock || 0) + 10)}
                                            className="shrink-0"
                                        >
                                            +10
                                        </Button>
                                    </div>

                                    {(formData.stock || 0) === 0 && (
                                        <p className="text-sm text-red-500 flex items-center gap-2">
                                            <span>⚠️</span>
                                            <span>Produit en rupture de stock (invisible sur le site)</span>
                                        </p>
                                    )}
                                    {(formData.stock || 0) > 0 && (formData.stock || 0) < 5 && (
                                        <p className="text-sm text-orange-500 flex items-center gap-2">
                                            <span>⚡</span>
                                            <span>Stock faible - Badge "Plus que {formData.stock}!" affiché</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-neutral-400 text-xs uppercase font-bold">Description courte</Label>
                                <Input
                                    className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white"
                                    placeholder="Ex: Une saveur intense, idéale pour les grillades"
                                    value={formData.shortDescription}
                                    onChange={e => handleChange('shortDescription', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-neutral-400 text-xs uppercase font-bold">Description complète</Label>
                                <Textarea
                                    className="bg-black/40 border-neutral-800 focus:ring-[var(--color-primary)] text-white min-h-[150px]"
                                    placeholder="Histoire, origine, saveurs..."
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                />
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6">
                        <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-6">
                            <Label className="text-neutral-400 text-xs uppercase font-bold">Image Principale</Label>
                            <div className="flex gap-4 items-start">
                                <div className="relative w-48 h-48 rounded-xl bg-black border border-neutral-800 overflow-hidden shrink-0">
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-neutral-600">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                    <div
                                        onClick={() => setShowMediaSelector(true)}
                                        className="h-32 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-[var(--color-primary)]">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="text-center text-sm font-bold text-white uppercase">Médiathèque</div>
                                    </div>
                                    <label className="h-32 rounded-xl border-2 border-dashed border-neutral-800 bg-black/20 hover:border-neutral-600 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-neutral-500">
                                            <UploadCloud size={20} />
                                        </div>
                                        <div className="text-center text-sm font-bold text-neutral-500 uppercase">Upload Local</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => {
                                                if (e.target.files?.[0]) {
                                                    setLocalImageFile(e.target.files[0]);
                                                    handleChange('mainImage', '');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-6">
                        <Card className="bg-neutral-900 border-neutral-800 p-6">
                            <Label className="text-neutral-400 text-xs uppercase font-bold mb-4 block">Badges & Labels</Label>
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_BADGES.map(badge => (
                                    <button
                                        key={badge}
                                        type="button"
                                        onClick={() => toggleBadge(badge)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg border transition-all font-bold text-sm uppercase",
                                            formData.badges?.includes(badge)
                                                ? BADGE_COLORS[badge] || "bg-white text-black"
                                                : "bg-neutral-800 border-neutral-700 text-neutral-400"
                                        )}
                                    >
                                        {badge}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                        <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-neutral-400 text-xs uppercase font-bold">Slug URL</Label>
                                <Input
                                    className="bg-black/40 border-neutral-800 text-neutral-300 font-mono text-sm"
                                    value={formData.slug}
                                    onChange={e => handleChange('slug', e.target.value)}
                                />
                                <p className="text-[10px] text-neutral-500">Laissez vide pour auto-génération.</p>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800 p-4 flex justify-end gap-4 z-40">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="text-neutral-400">Annuler</Button>
                    <Button type="submit" disabled={isLoading} className="bg-[var(--color-primary)] text-black font-bold h-10 px-8">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        Sauvegarder
                    </Button>
                </div>
            </form>

            {showMediaSelector && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <Card className="w-full max-w-5xl h-[85vh] bg-neutral-900 border border-neutral-800 flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Médiathèque</h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowMediaSelector(false)} className="text-neutral-400">
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-black/40">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {galleryItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            handleChange('mainImage', item.url);
                                            setLocalImageFile(null);
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
