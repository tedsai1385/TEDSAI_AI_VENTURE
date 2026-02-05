import React, { useEffect } from 'react';
import { Container, Section } from '../ui/Container';
import { Button } from '../ui/button';
import { Instagram, Loader2, Play } from 'lucide-react';
import { useGalleryStore } from '@/lib/store/gallery-store';
import { cn } from '@/lib/utils';

export const GaleriePhotos = () => {
    const { items, isLoading, listenToGallery } = useGalleryStore();

    useEffect(() => {
        const unsubscribe = listenToGallery();
        return () => unsubscribe();
    }, [listenToGallery]);

    const photoSkeleton = (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] animate-pulse">
            <div className="md:col-span-2 md:row-span-2 bg-gray-200 rounded-2xl" />
            <div className="bg-gray-200 rounded-2xl" />
            <div className="bg-gray-200 rounded-2xl" />
            <div className="md:col-span-2 bg-gray-200 rounded-2xl" />
        </div>
    );

    return (
        <Section spacing="base" className="bg-[var(--color-background)]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-heading font-bold mb-4">L'Art de Recevoir</h2>
                        <p className="text-gray-600">
                            Une atmosphère pensée pour l'éveil des sens. Nature, technologie et gastronomie en harmonie à Yaoundé.
                        </p>
                    </div>
                    <a href="https://instagram.com/tedsai_cm" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-[var(--color-primary)] text-[var(--color-primary)]">
                            <Instagram size={18} className="mr-2" /> Suivez-nous @viTEDia
                        </Button>
                    </a>
                </div>

                {isLoading ? photoSkeleton : (
                    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4">
                        {items.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-serif italic">
                                La beauté se prépare... Revenez bientôt pour les visuels.
                            </div>
                        ) : (
                            items.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "relative rounded-2xl overflow-hidden group shadow-lg transition-transform hover:scale-[1.02]",
                                        item.aspectRatio === 'large' || idx === 0 ? "md:col-span-2 md:row-span-2" : "",
                                        item.aspectRatio === 'wide' ? "md:col-span-2" : "",
                                        item.aspectRatio === 'tall' ? "md:row-span-2" : ""
                                    )}
                                >
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-black relative">
                                            <img src="/images/placeholders/video-bg.jpg" className="w-full h-full object-cover opacity-50" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                                                    <Play size={32} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <p className="text-white font-medium">{item.title}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </Container>
        </Section>
    );
};
