'use client';

import { useMenuStore, CourseType } from '@/lib/store/menu-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function EditImageDropzone({ currentImage, onUpdate }: { currentImage?: string, onUpdate: (img: string) => void }) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                onUpdate(result);
            };
            reader.readAsDataURL(file);
        }
    }, [onUpdate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors relative overflow-hidden h-[80px] flex flex-col items-center justify-center
                ${isDragActive ? 'border-cortex-secondary bg-cortex-secondary/10' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950'}
            `}
        >
            <input {...getInputProps()} />
            {currentImage ? (
                <div className="w-full h-full relative group">
                    <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-[10px]">Changer</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center text-zinc-500">
                    <Upload className="w-4 h-4 mb-1" />
                    <span className="text-[10px]">Glisser ou cliquer</span>
                </div>
            )}
        </div>
    );
}

export default function AdminMenuPage() {
    const { items, addItem, updateItem, deleteItem } = useMenuStore();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newDish, setNewDish] = useState<{
        name: string;
        description: string;
        price: string;
        course: CourseType;
        image: string;
    }>({
        name: '',
        description: '',
        price: '',
        course: 'plat',
        image: ''
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setNewDish(prev => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const handleAdd = () => {
        if (!newDish.name || !newDish.price) return;
        addItem(newDish);
        setNewDish({ name: '', description: '', price: '', course: 'plat', image: '' });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Gestion du Menu</h1>
                <p className="text-zinc-400">Modifiez le menu du jour affiché sur le site public.</p>
            </div>

            {/* Formulaire Ajout Rapide */}
            <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-cortex-secondary" /> Ajouter un plat
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Nom du plat</Label>
                            <Input
                                placeholder="Ex: Poulet DG"
                                className="bg-neutral-950 border-neutral-800 text-white"
                                value={newDish.name}
                                onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Catégorie</Label>
                            <Select
                                value={newDish.course}
                                onValueChange={(v: CourseType) => setNewDish({ ...newDish, course: v })}
                            >
                                <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="entree">Entrée</SelectItem>
                                    <SelectItem value="plat">Plat Principal</SelectItem>
                                    <SelectItem value="dessert">Dessert</SelectItem>
                                    <SelectItem value="boisson">Boisson</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-zinc-400">Description</Label>
                            <Textarea
                                placeholder="Ingrédients, origine..."
                                className="bg-neutral-950 border-neutral-800 text-white h-20"
                                value={newDish.description}
                                onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Image</Label>
                            <div
                                {...getRootProps()}
                                className={`
                                    border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors relative overflow-hidden h-[100px] flex flex-col items-center justify-center
                                    ${isDragActive ? 'border-cortex-secondary bg-cortex-secondary/10' : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950'}
                                    ${newDish.image ? 'border-none p-0' : ''}
                                `}
                            >
                                <input {...getInputProps()} />
                                {newDish.image ? (
                                    <div className="w-full h-full relative group">
                                        <img src={newDish.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs">Changer</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-zinc-500">
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-xs">Glisser ou cliquer</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Prix (CFA)</Label>
                            <Input
                                placeholder="5000"
                                className="bg-neutral-950 border-neutral-800 text-white"
                                value={newDish.price}
                                onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                className="w-full bg-cortex-secondary hover:bg-cortex-secondary-light text-white font-bold"
                                onClick={handleAdd}
                            >
                                Ajouter au Menu
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des Plats */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Carte Actuelle</h3>
                <div className="grid gap-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-cortex-secondary/30 transition-all">

                            {/* Thumbnail in List */}
                            {item.image && (
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Mode Édition ? */}
                            {isEditing === item.id ? (
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase text-zinc-500">Nom</Label>
                                            <Input
                                                defaultValue={item.name}
                                                className="bg-neutral-950 border-neutral-800 text-white"
                                                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase text-zinc-500">Catégorie</Label>
                                            <Select
                                                defaultValue={item.course}
                                                onValueChange={(v: CourseType) => updateItem(item.id, { course: v })}
                                            >
                                                <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                                    <SelectItem value="entree">Entrée</SelectItem>
                                                    <SelectItem value="plat">Plat Principal</SelectItem>
                                                    <SelectItem value="dessert">Dessert</SelectItem>
                                                    <SelectItem value="boisson">Boisson</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-500">Description</Label>
                                        <Textarea
                                            defaultValue={item.description}
                                            className="bg-neutral-950 border-neutral-800 text-white h-16"
                                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <Label className="text-[10px] uppercase text-zinc-500">Prix (CFA)</Label>
                                            <Input
                                                defaultValue={item.price}
                                                className="bg-neutral-950 border-neutral-800 text-white"
                                                onChange={(e) => updateItem(item.id, { price: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-500" onClick={() => setIsEditing(null)}>
                                                <Save className="w-4 h-4 mr-2" /> Terminer
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-zinc-500" onClick={() => setIsEditing(null)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-zinc-500">Changer l'image</Label>
                                        <EditImageDropzone
                                            currentImage={item.image}
                                            onUpdate={(img) => updateItem(item.id, { image: img })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Badge variant="outline" className={`
                                                uppercase text-[10px] 
                                                ${item.course === 'entree' ? 'text-blue-400 border-blue-400/30' : ''}
                                                ${item.course === 'plat' ? 'text-cortex-secondary border-cortex-secondary/30' : ''}
                                                ${item.course === 'dessert' ? 'text-pink-400 border-pink-400/30' : ''}
                                            `}>
                                                {item.course}
                                            </Badge>
                                            <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                        </div>
                                        <p className="text-zinc-500 text-sm">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono font-bold text-cortex-secondary text-lg">{item.price} CFA</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white px-2" onClick={() => setIsEditing(item.id)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 px-2" onClick={() => deleteItem(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
