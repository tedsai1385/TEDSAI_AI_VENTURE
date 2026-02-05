'use client';

import { useMenuStore } from '@/lib/store/menu-store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MenuDuJour() {
    const { items, date: customDate } = useMenuStore();
    const { addItem } = useCart();
    const [displayDate, setDisplayDate] = useState<string>('');

    useEffect(() => {
        if (customDate) {
            setDisplayDate(customDate);
        } else {
            const d = new Date();
            const formatter = new Intl.DateTimeFormat('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            });
            setDisplayDate(formatter.format(d));
        }
    }, [customDate]);

    const addToCart = (item: any) => {
        const numericPrice = typeof item.price === 'string'
            ? parseInt(item.price.replace(/\s/g, ''))
            : item.price;

        addItem({
            id: item.id + '-menu',
            productId: item.id,
            name: item.name,
            price: numericPrice || 0,
            quantity: 1,
            image: item.image || '',
            category: 'menu'
        });
    };

    const entrees = items.filter(i => i.course === 'entree');
    const plats = items.filter(i => i.course === 'plat');
    const desserts = items.filter(i => i.course === 'dessert');

    return (
        <div className="relative max-w-4xl mx-auto py-12 px-6 overflow-visible">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-[#f4e4bc] text-[#2c1810] shadow-2xl min-h-[800px] flex flex-col"
                style={{
                    backgroundImage: 'url(https://www.transparenttextures.com/patterns/old-paper.png)',
                    border: '12px double #8b5a2b',
                    boxShadow: '0 0 50px rgba(0,0,0,0.3)',
                    borderRadius: '4px'
                }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/natural-paper.png)' }}
                />

                <div className="relative z-10 p-6 md:p-12 flex-1 flex flex-col text-center">
                    <div className="mb-12">
                        <div className="w-20 h-20 mx-auto mb-4 border-2 border-double border-[#8b5a2b] flex items-center justify-center rounded-full">
                            <span className="font-serif text-3xl font-bold">V</span>
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter mb-2 italic">Le Menu du Jour</h2>
                        <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#8b5a2b] to-transparent mx-auto mb-2" />
                        <p className="font-serif text-sm uppercase tracking-[0.2em] opacity-70">{displayDate}</p>
                    </div>

                    <div className="space-y-16 max-w-2xl mx-auto w-full">
                        {entrees.length > 0 && (
                            <div className="space-y-6">
                                <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-2 border-b border-[#8b5a2b]/10 pb-1 w-32 mx-auto">Pour Commencer</span>
                                {entrees.map(item => (
                                    <div key={item.id} className="group flex items-center justify-between gap-4">
                                        <div className="flex-1 text-left">
                                            <h4 className="font-serif text-2xl font-semibold mb-1 group-hover:text-[#8b5a2b] transition-colors">{item.name}</h4>
                                            <p className="text-sm italic opacity-80 mb-2">{item.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-lg">{item.price} CFA</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="bg-[#8b5a2b]/10 hover:bg-[#8b5a2b] hover:text-white text-[#8b5a2b] px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1"
                                                >
                                                    <Plus size={10} /> AJOUTER
                                                </button>
                                            </div>
                                        </div>
                                        {item.image && (
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-double border-[#8b5a2b]/30 shadow-sm shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {plats.length > 0 && (
                            <div className="space-y-6">
                                <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-2 border-b border-[#8b5a2b]/10 pb-1 w-32 mx-auto">La Pièce Maîtresse</span>
                                {plats.map(item => (
                                    <div key={item.id} className="group flex items-center justify-between gap-4 py-2">
                                        <div className="flex-1 text-left">
                                            <h4 className="font-serif text-3xl font-bold mb-1 text-[#8b5a2b]">{item.name}</h4>
                                            <p className="text-sm italic opacity-80 mb-2">{item.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-xl">{item.price} CFA</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="bg-[#8b5a2b] hover:bg-[#2c1810] text-white px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1"
                                                >
                                                    <ShoppingCart size={12} /> COMMANDER
                                                </button>
                                            </div>
                                        </div>
                                        {item.image && (
                                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-double border-[#8b5a2b]/40 shadow-lg shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {desserts.length > 0 && (
                            <div className="space-y-6">
                                <span className="block font-serif text-sm font-bold uppercase tracking-widest text-[#8b5a2b]/60 mb-2 border-b border-[#8b5a2b]/10 pb-1 w-32 mx-auto">Douceur Finale</span>
                                {desserts.map(item => (
                                    <div key={item.id} className="group flex items-center justify-between gap-4">
                                        <div className="flex-1 text-left">
                                            <h4 className="font-serif text-2xl font-semibold mb-1 group-hover:text-[#8b5a2b] transition-colors">{item.name}</h4>
                                            <p className="text-sm italic opacity-80 mb-2">{item.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-lg">{item.price} CFA</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="bg-[#8b5a2b]/10 hover:bg-[#8b5a2b] hover:text-white text-[#8b5a2b] px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1"
                                                >
                                                    <Plus size={10} /> AJOUTER
                                                </button>
                                            </div>
                                        </div>
                                        {item.image && (
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-double border-[#8b5a2b]/30 shadow-sm shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-16 text-xs italic opacity-50 font-serif">
                        ~ Cuisine éthique et responsable par TEDSAI ~
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
