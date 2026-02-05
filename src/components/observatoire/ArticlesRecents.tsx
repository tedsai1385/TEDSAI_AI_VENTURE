import React from 'react';
import { Container, Section } from '../ui/Container';
import { ArticleCard } from './ArticleCard';
import { Button } from '../ui/button';

export const ArticlesRecents = () => {
    const articles = [
        {
            title: "L'IA expliquée à ma grand-mère",
            excerpt: "Pas de robots tueurs ici. Juste des mathématiques qui nous aident à mieux planter et mieux vendre. Vulgarisation sans jargon.",
            cat: "Vulgarisation",
            date: "14 Fév",
            readTime: "5"
        },
        {
            title: "Pourquoi le Ndolé a besoin de la Blockchain ?",
            excerpt: "De la feuille à l'assiette : comment la technologie garantit que votre plat est 100% authentique et éthique.",
            cat: "Tech & Culture",
            date: "10 Fév",
            readTime: "7"
        },
        {
            title: "3 Startups Camerounaises à suivre en 2026",
            excerpt: "Elles ne sont pas dans la Silicon Valley, mais à Yaoundé et Douala. Et elles changent la donne.",
            cat: "Ecosystème",
            date: "02 Fév",
            readTime: "4"
        },
        {
            title: "L'Afrique, laboratoire de l'IA éthique ?",
            excerpt: "Pourquoi le continent a une carte majeure à jouer dans le développement d'une intelligence artificielle plus humaine.",
            cat: "Opinion",
            date: "25 Jan",
            readTime: "10"
        }
    ];

    return (
        <Section spacing="base" className="bg-[var(--color-background)]">
            <Container>
                <h2 className="text-2xl font-heading font-bold mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-[var(--color-secondary)] rounded-full" />
                    Dernières publications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {articles.map((art, i) => (
                        <ArticleCard
                            key={i}
                            title={art.title}
                            category={art.cat}
                            excerpt={art.excerpt}
                            date={art.date}
                            readTime={art.readTime}
                            image={`/images/blog/post-${i}.jpg`}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button variant="outline" size="lg">Voir tous les articles</Button>
                </div>
            </Container>
        </Section>
    );
};
