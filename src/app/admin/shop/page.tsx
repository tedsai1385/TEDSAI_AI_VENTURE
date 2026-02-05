'use client';

import { useShopStore } from '@/lib/store/shop-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag, Percent, Clock } from 'lucide-react';

export default function ShopPage() {
    const products = useShopStore((state) => state.products);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Boutique & Anti-Gaspi</h1>
                    <p className="text-zinc-400">Gestion des surplus, promos et catalogue standard.</p>
                </div>
                <Button className="bg-cortex-secondary hover:bg-cortex-secondary-light text-white font-bold">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ajouter Produit
                </Button>
            </div>

            {products.length === 0 ? (
                <div className="bg-dark-surface border border-dark-border rounded-xl p-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium text-lg">Aucun produit en ligne</h3>
                    <p className="text-zinc-500 max-w-md mx-auto mt-2">
                        Les produits apparaîtront ici quand vous en créerez manuellement ou quand le système détectera un surplus au Jardin.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-gradient-to-br from-blue-900/10 via-neutral-900 to-neutral-900 border border-blue-900/50 rounded-xl overflow-hidden group hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-900/20">
                            <div className="h-40 bg-black/40 relative">
                                {product.isAntiWaste && (
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-red-600 text-white flex gap-1 shadow-lg shadow-red-900/20">
                                            <Tag className="w-3 h-3" /> Anti-Gaspi
                                        </Badge>
                                    </div>
                                )}
                                {product.promoPrice && (
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-[#D4A574] text-black font-bold shadow-lg shadow-amber-900/20">
                                            -30%
                                        </Badge>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center text-blue-900/30">
                                    <ShoppingBag className="w-16 h-16" />
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-blue-100 text-lg group-hover:text-blue-400 transition-colors">{product.name}</h3>
                                        <p className="text-xs text-blue-300/60">{product.category} • Stock: {product.stock}U</p>
                                    </div>
                                    <div className="text-right">
                                        {product.promoPrice ? (
                                            <>
                                                <div className="text-lg font-bold text-[#D4A574]">{product.promoPrice} CFA</div>
                                                <div className="text-xs text-zinc-600 line-through">{product.price} CFA</div>
                                            </>
                                        ) : (
                                            <div className="text-lg font-bold text-white">{product.price} CFA</div>
                                        )}
                                    </div>
                                </div>

                                {product.isAntiWaste && (
                                    <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3 mt-4 flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-red-500" />
                                        <div className="text-xs text-red-400">
                                            Expire dans <strong>3 jours</strong>. <br />
                                            Boosté sur WhatsApp.
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" className="flex-1 border-blue-900/30 hover:bg-blue-900/20 text-blue-200 hover:text-white hover:border-blue-500/50">Modifier</Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold transition-all hover:scale-105"
                                        onClick={() => {
                                            const text = `🚨 *ANTI-GASPI TEDSAI* 🚨\n\nLe produit *${product.name}* est en promo à *${product.promoPrice || product.price} CFA* !\n\n🌱 Qualité Premium, Prix Cassé.\n👉 Réservez ici : https://tedsai.cm/shop/${product.id}`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                        }}
                                    >
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
