'use client';

import { useEffect } from 'react';
import { incrementArticleViews } from '@/lib/firebase/articles-service';

export function ArticleViewTracker({ articleId }: { articleId: string }) {
    useEffect(() => {
        // Incrémenter la vue une seule fois par session/page view
        // On pourrait ajouter un check de localStorage pour unique views ici
        const viewedKey = `viewed_${articleId}`;
        const hasViewed = sessionStorage.getItem(viewedKey);

        if (!hasViewed) {
            incrementArticleViews(articleId, true)
                .catch(err => console.error('Error tracking view:', err));
            sessionStorage.setItem(viewedKey, 'true');
        } else {
            incrementArticleViews(articleId, false)
                .catch(err => console.error('Error tracking view:', err));
        }
    }, [articleId]);

    return null;
}
