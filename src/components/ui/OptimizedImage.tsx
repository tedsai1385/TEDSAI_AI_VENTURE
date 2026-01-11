'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallback?: string;
}

/**
 * OptimizedImage Component
 * Automatically attempts to serve .webp version of images.
 * Falls back to original if .webp is not found.
 */
export default function OptimizedImage({
    src,
    fallback,
    alt,
    ...props
}: OptimizedImageProps) {
    // Logic: if it's a relative path starting with /assets or /images, 
    // we try the .webp version.
    const isOptimizable = src.startsWith('/assets') || src.startsWith('/images') || src.startsWith('/');
    const initialSrc = (isOptimizable && !src.endsWith('.webp'))
        ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        : src;

    const [currentSrc, setCurrentSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Fallback to original src or provided fallback
            setCurrentSrc(fallback || src);
        }
    };

    return (
        <Image
            src={currentSrc}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
}
