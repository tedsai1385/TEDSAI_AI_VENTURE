import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.tedsai.cm';

    // Pages statiques principales
    const routes = [
        '',
        '/vitedia',
        '/garden-selected',
        '/solutions-ia',
        '/epicerie',
        '/infographie',
        '/observatoire',
        '/mentions-legales',
        '/politique-confidentialite',
        '/cgv',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Exemple pour routes dynamiques (articles de blog)
    // Dans un cas réel, on fetcherait les slugs depuis une DB/CMS
    // const posts = await getBlogPosts();
    // const postRoutes = posts.map(...)

    return [...routes];
}
