'use client';

import { useState, useEffect } from 'react';
import { Article, ArticleCategory } from '@/types/article';
import { Category } from '@/types/category';
import { subscribeToCategories, addCategory } from '@/lib/firebase/categories-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select-metallic';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus, Check } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload';
import { toast } from 'sonner';
import TedsaiEditor from '@/components/editor/TedsaiEditor';

interface ArticleFormData {
    title: string;
    subtitle: string;
    excerpt: string;
    content: string;
    category: ArticleCategory;
    tags: string[];
    heroImage: {
        url: string;
        alt: string;
    };
}

interface ArticleFormProps {
    data: ArticleFormData;
    onChange: (data: ArticleFormData) => void;
    disabled?: boolean;
}

export function ArticleForm({ data, onChange, disabled = false }: ArticleFormProps) {
    const { upload } = useUpload();
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Ajout états pour catégorie rapide
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryLabel, setNewCategoryLabel] = useState('');

    const handleChange = (field: keyof ArticleFormData, value: any) => {
        if (disabled) return;
        onChange({ ...data, [field]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingImage(true);
            toast.loading('Upload image...');

            const res = await upload(file, { path: 'articles/heroes' });

            if (res?.url) {
                handleChange('heroImage', {
                    url: res.url,
                    alt: data.title || 'Article image'
                });
                toast.dismiss();
                toast.success('Image uploaded');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Upload failed');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleAddTag = (tag: string) => {
        if (disabled) return;
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && !data.tags.includes(trimmed)) {
            handleChange('tags', [...data.tags, trimmed]);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (disabled) return;
        handleChange('tags', data.tags.filter(t => t !== tagToRemove));
    };

    // ... existing categories effect ...

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToCategories((data) => {
            setCategories(data);
        });
        return () => unsubscribe();
    }, []);

    const handleClientAddCategory = async () => {
        if (!newCategoryLabel.trim() || disabled) return;
        try {
            const newCat = await addCategory(newCategoryLabel, 'Hexagon'); // Default icon
            setNewCategoryLabel('');
            setIsAddingCategory(false);
            handleChange('category', newCat.id); // Auto-select new category
            toast.success('Catégorie ajoutée');
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    return (
        <div className="space-y-6">
            {/* Hero Image */}
            <div className="space-y-2">
                <Label>Image principale *</Label>
                {data.heroImage.url ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={data.heroImage.url}
                            alt={data.heroImage.alt}
                            className="w-full h-full object-cover"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                            onClick={() => handleChange('heroImage', { url: '', alt: '' })}
                            disabled={disabled}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                            {isUploadingImage ? 'Uploading...' : 'Cliquez pour upload'}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage || disabled}
                        />
                    </label>
                )}
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-200">Titre *</Label>
                    <Input
                        value={data.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Titre de l'article"
                        className="text-lg font-semibold bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                        disabled={disabled}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-200">Sous-titre</Label>
                    <Input
                        value={data.subtitle}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                        placeholder="Accroche courte"
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                        disabled={disabled}
                    />
                </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
                <Label className="text-gray-200">Résumé (SEO) *</Label>
                <Textarea
                    value={data.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    maxLength={160}
                    className="text-sm resize-none bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 min-h-[80px]"
                    rows={2}
                    placeholder="Description courte pour les moteurs de recherche (max 160 caractères)"
                    disabled={disabled}
                />
                <div className="text-xs text-gray-400 text-right">
                    {data.excerpt.length}/160
                </div>
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-200">Catégorie *</Label>
                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <Input
                                value={newCategoryLabel}
                                onChange={(e) => setNewCategoryLabel(e.target.value)}
                                placeholder="Nouvelle catégorie"
                                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                                autoFocus
                                disabled={disabled}
                            />
                            <Button
                                size="sm"
                                onClick={handleClientAddCategory}
                                className="bg-green-600 hover:bg-green-700 shrink-0 h-8 w-8 p-0"
                                disabled={disabled}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsAddingCategory(false)}
                                className="text-gray-400 hover:text-white shrink-0 h-8 w-8 p-0"
                                disabled={disabled}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Select
                                    value={data.category}
                                    onValueChange={(v) => handleChange('category', v as ArticleCategory)}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-white">
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-950 border-gray-700">
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddingCategory(true)}
                                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shrink-0 h-8 w-8 p-0"
                                title="Ajouter une catégorie"
                                disabled={disabled}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2 col-span-2">
                    <Label className="text-gray-200">Tags (Entrée pour ajouter)</Label>
                    <div className={`flex items-center gap-2 flex-wrap p-2 border border-gray-700 rounded-md bg-gray-900 min-h-[42px] focus-within:ring-1 focus-within:ring-purple-500 ring-offset-gray-950 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        {data.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1 bg-purple-900/50 text-purple-100 hover:bg-purple-900/70 border-purple-800">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-white transition-colors" disabled={disabled}>
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        <input
                            type="text"
                            placeholder="Ajouter un tag..."
                            className="flex-1 outline-none text-sm min-w-[120px] bg-transparent text-white placeholder:text-gray-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="space-y-2">
                <Label>Contenu *</Label>
                <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
                    <TedsaiEditor
                        content={data.content}
                        onChange={(html) => handleChange('content', html)}
                    />
                </div>
            </div>
        </div>
    );
}
