'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Trash2,
    Edit2,
    Loader2,
    Package,
    Tag,
    Plus,
    Search,
    Image as ImageIcon,
    Database,
    CloudOff,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { HarvestFormV2 } from './HarvestFormV2';
import { seedProducts } from '@/lib/firebase/seed';
import { useGardenStore, GardenProduct } from '@/lib/store/garden-store';

export function HarvestManager() {
    const { products, isLoading, error, deleteItem, startFirestoreSync } = useGardenStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<GardenProduct | null>(null);

    // Sync with Firestore on mount
    useEffect(() => {
        const unsubscribe = startFirestoreSync();
        return () => unsubscribe();
    }, [startFirestoreSync]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Supprimer définitivement ${name} du catalogue ?`)) return;
        try {
            await deleteItem(id);
            toast.success('Produit retiré du catalogue');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleEdit = (product: GardenProduct) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleSeed = async () => {
        try {
            await seedProducts();
            toast.success('Produits initiaux importés');
        } catch (error) {
            toast.error('Erreur d\'importation');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && products.length === 0) {
        return (
            <div className="flex justify-center items-center p-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-cortex-primary" />
                    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Chargement du Catalogue...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <Input
                        placeholder="Rechercher un produit..."
                        className="h-11 pl-10 bg-zinc-900/50 border-zinc-800 text-white focus:ring-1 focus:ring-cortex-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {products.length === 0 && (
                        <Button
                            variant="outline"
                            onClick={handleSeed}
                            className="h-11 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Seed Initial
                        </Button>
                    )}
                    <Button
                        onClick={handleAdd}
                        className="h-11 bg-cortex-primary hover:bg-cortex-primary-light text-white font-bold px-6 shadow-lg shadow-cortex-primary/10 flex-1 md:flex-none"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Produit
                    </Button>
                </div>
            </div>



            {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-zinc-950/50 rounded-3xl border border-zinc-800 border-dashed">
                    <div className="p-6 bg-zinc-900 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Package className="w-10 h-10 text-zinc-700" />
                    </div>
                    <h3 className="text-white font-bold text-xl">Catalogue Vide</h3>
                    <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">Commencez par ajouter votre premier produit récolté pour le rendre visible.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="bg-zinc-900/50 border-zinc-800/80 overflow-hidden flex flex-col group transition-all hover:bg-zinc-900 hover:border-cortex-primary/40 hover:shadow-2xl hover:shadow-black/50">
                            {/* Product Image Preview */}
                            <div className="relative aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <picture className="w-full h-full">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </picture>
                                ) : (
                                    <ImageIcon className="text-zinc-800 w-16 h-16 opacity-20" />
                                )}



                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <Badge className={`${product.inStock ? 'bg-cortex-success/10 text-cortex-success border-cortex-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} backdrop-blur-md px-3 py-1 font-bold uppercase text-[9px] tracking-widest`}>
                                        {product.inStock ? 'DISPONIBLE' : 'RUPTURE'}
                                    </Badge>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-white/10"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Edit2 size={14} className="mr-2" /> Modifier
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                        onClick={() => handleDelete(product.id, product.name)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-[10px] text-cortex-primary font-bold uppercase tracking-[0.2em] mb-1">
                                        <Tag size={10} />
                                        {product.tag || 'DIVERS'}
                                    </div>
                                    <h4 className="font-bold text-lg text-white leading-tight">{product.name}</h4>
                                </div>

                                <p className="text-xs text-zinc-500 line-clamp-2 mb-6 leading-relaxed">
                                    {product.description || "Aucune description détaillée disponible."}
                                </p>

                                <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Prix de vente</span>
                                        <span className="text-md font-black text-cortex-success font-mono">{product.price}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter block">Stock</span>
                                        <span className="text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 rounded-full">{product.quantity} {product.unit}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <HarvestFormV2
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
}
