'use client';

import { useEffect, useState } from 'react';
import { useGalleryStore } from '@/lib/store/gallery-store';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Video, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VitediaGallery() {
    const { items, isLoading, listenToGallery } = useGalleryStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = listenToGallery();
        return () => unsubscribe();
    }, [listenToGallery]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-cortex-restaurant" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-neutral-500 min-h-[400px] flex items-center justify-center">
                <p>Aucune photo disponible pour le moment</p>
            </div>
        );
    }

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto" id="galerie">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 font-heading">Notre Galerie</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                    Découvrez l'ambiance unique de viTEDia à travers nos photos
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => {
                    const aspectRatioClass = {
                        square: 'col-span-1 row-span-1 aspect-square',
                        wide: 'col-span-2 row-span-1 aspect-[2/1]',
                        tall: 'col-span-1 row-span-2 aspect-[1/2]',
                        large: 'col-span-2 row-span-2 aspect-square'
                    }[item.aspectRatio || 'square'];

                    return (
                        <Card
                            key={item.id}
                            onClick={() => setSelectedImage(item.url)}
                            className={cn(
                                "relative group overflow-hidden bg-neutral-900 border-neutral-800 cursor-pointer transition-all hover:scale-[1.02] hover:border-cortex-restaurant hover:shadow-xl hover:shadow-cortex-restaurant/10",
                                aspectRatioClass
                            )}
                        >
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    controls
                                    playsInline
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="font-bold text-lg">{item.title}</p>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                                    {item.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Lightbox Simple de secours */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors bg-white/10 p-2 rounded-full"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Agrandissement"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
