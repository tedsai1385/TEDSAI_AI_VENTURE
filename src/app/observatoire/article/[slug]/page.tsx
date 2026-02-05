import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/firebase/articles-server';
import { ArticleDetail } from '@/components/observatoire/ArticleDetail';
import { ArticleViewTracker } from '@/components/observatoire/ArticleViewTracker';

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        return {
            title: 'Article introuvable | Observatoire TEDSAI',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${article.metaTitle || article.title} | Observatoire TEDSAI`,
        description: article.metaDescription || article.excerpt,
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.excerpt,
            images: article.heroImage?.url ? [article.heroImage.url, ...previousImages] : previousImages,
            type: 'article',
            publishedTime: article.publishedAt?.toDate().toISOString(),
            authors: [article.authorName],
            tags: article.tags,
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <ArticleViewTracker articleId={article.id} />
            <ArticleDetail article={article} />
        </>
    );
}
