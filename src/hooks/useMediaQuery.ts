'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        setMatches(media.matches);

        // Listener
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}

// Hook spécifique mobile
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 640px)');
}

// Hook tablet
export function useIsTablet(): boolean {
    return useMediaQuery('(max-width: 1024px)');
}
