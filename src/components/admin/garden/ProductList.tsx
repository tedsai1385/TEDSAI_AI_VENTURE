'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Loader2, Package, Tag, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'garden_products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Supprimer ${name} ?`)) return;
        try {
            await deleteDoc(doc(db, 'garden_products', id));
            toast.success('Produit supprimé');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const toggleStock = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'garden_products', id), {
                inStock: !currentStatus
            });
            toast.success('Statut mis à jour');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-cortex-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {products.length === 0 ? (
                <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border">
                    <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">Aucun produit dans le catalogue.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="bg-dark-surface border-dark-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cortex-primary/10 rounded-lg flex items-center justify-center text-cortex-primary">
                                    <Tag size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white uppercase">{product.name}</h4>
                                    <p className="text-xs text-zinc-500">{product.tag} • {product.price}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                                <Badge variant={product.inStock ? 'success' : 'outline'} className={product.inStock ? 'bg-cortex-success/20 text-cortex-success border-cortex-success/30' : 'text-zinc-500'}>
                                    {product.inStock ? 'En Stock' : 'Hors Stock'}
                                </Badge>
                                <div className="text-sm font-mono text-zinc-400">{product.quantity}{product.unit || 'kg'}</div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-dark-border hover:bg-white/5"
                                        onClick={() => toggleStock(product.id, product.inStock)}
                                    >
                                        <ShoppingCart size={14} className="mr-1" />
                                        Stock
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                        onClick={() => handleDelete(product.id, product.name)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
