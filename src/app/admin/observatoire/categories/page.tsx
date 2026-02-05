'use client';

import { useEffect, useState } from 'react';
import {
    subscribeToCategories,
    addCategory,
    deleteCategory,
    seedCategories
} from '@/lib/firebase/categories-service';
import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Zap, Cpu, Leaf, TrendingUp, BookOpen, Hexagon } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select-metallic';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Hexagon');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToCategories((data) => {
            setCategories(data);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async () => {
        if (!newCategoryName.trim()) return;

        try {
            await addCategory(newCategoryName, selectedIcon);
            setNewCategoryName('');
            toast.success('Catégorie ajoutée');
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`Supprimer la catégorie "${label}" ?`)) return;

        try {
            await deleteCategory(id);
            toast.success('Catégorie supprimée');
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleSeed = async () => {
        try {
            await seedCategories();
            toast.success('Catégories initialisées');
        } catch (error) {
            toast.error("Erreur lors de l'initialisation");
        }
    };

    // Mapping icônes disponibles
    const icons = [
        { name: 'Hexagon', icon: Hexagon },
        { name: 'Cpu', icon: Cpu },
        { name: 'Leaf', icon: Leaf },
        { name: 'TrendingUp', icon: TrendingUp },
        { name: 'Zap', icon: Zap },
        { name: 'BookOpen', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Gestion des Catégories</h1>

            {/* Ajout */}
            <Card className="bg-gray-800/60 border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Nouvelle Catégorie</h2>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Nom de la catégorie"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white"
                        />
                    </div>

                    <div className="w-[180px]">
                        <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                            <SelectTrigger className="w-full bg-gray-900 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-950 border-gray-700">
                                {icons.map((item) => (
                                    <SelectItem key={item.name} value={item.name}>
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-4 h-4" />
                                            {item.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                    </Button>
                </div>
            </Card>

            {/* Liste */}
            <div className="grid gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700 rounded-lg hover:bg-gray-800/60 transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-purple-400">
                                {/* Dynamic Icon Rendering could use a Helper, for now simplified */}
                                {category.icon === 'Leaf' && <Leaf size={16} />}
                                {category.icon === 'Cpu' && <Cpu size={16} />}
                                {category.icon === 'TrendingUp' && <TrendingUp size={16} />}
                                {category.icon === 'Zap' && <Zap size={16} />}
                                {category.icon === 'BookOpen' && <BookOpen size={16} />}
                                {category.icon === 'Hexagon' && <Hexagon size={16} />}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{category.label}</h3>
                                <p className="text-gray-500 text-xs text-mono">Slug: {category.id}</p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id, category.label)}
                            className="text-gray-400 hover:text-red-400"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {categories.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">Aucune catégorie définie.</p>
                        <Button variant="outline" onClick={handleSeed} className="border-purple-500 text-purple-400 hover:bg-purple-900/20">
                            <Zap className="w-4 h-4 mr-2" />
                            Initialiser les catégories par défaut
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
