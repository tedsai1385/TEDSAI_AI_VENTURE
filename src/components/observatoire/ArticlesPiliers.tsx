import React from 'react';
import { Container, Section } from '../ui/Container';
import { ArticleCard } from './ArticleCard';

export const ArticlesPiliers = () => {
    return (
        <Section spacing="base" className="bg-[var(--color-background)] pb-0">
            <Container>
                <h2 className="text-2xl font-heading font-bold mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-[var(--color-primary)] rounded-full" />
                    À la Une
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Featured Article (Large) */}
                    <div className="lg:col-span-2">
                        <ArticleCard
                            featured
                            title="L'IA peut-elle sauver l'agriculture africaine ?"
                            category="Tech & IA"
                            date="21 Janv. 2026"
                            readTime="8"
                            image="/images/blog/ia-agri.jpg"
                            excerpt="Face aux défis climatiques et démographiques, l'intelligence artificielle n'est plus un gadget. C'est une question de survie et de souveraineté alimentaire. Analyse d'une révolution silencieuse."
                        />
                    </div>

                    {/* Side Article 1 */}
                    <ArticleCard
                        title="Gastronomie : Le retour aux sources par la data"
                        category="Économie & Business"
                        date="18 Janv. 2026"
                        readTime="5"
                        image="/images/blog/food-data.jpg"
                        excerpt="Comment la connaissance précise des préférences clients permet aux chefs de redécouvrir des ingrédients oubliés tout en réduisant le gaspillage à zéro."
                    />

                    {/* Side Article 2 (visible on mobile/tablet or large screens below) */}
                    <ArticleCard
                        title="Aquaponie : Rentable en zone urbaine ?"
                        category="Agriculture Urbaine"
                        date="15 Janv. 2026"
                        readTime="6"
                        image="/images/blog/aqua-urban.jpg"
                        excerpt="Étude de cas complète sur le modèle économique d'une ferme de 200m² en plein cœur de Yaoundé. ROI, CAPEX et OPEX décortiqués."
                    />

                    <div className="lg:col-span-2">
                        {/* Optional additional large card or ad space */}
                    </div>
                </div>
            </Container>
        </Section>
    );
};
