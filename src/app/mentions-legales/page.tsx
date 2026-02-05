import React from 'react';
import { Container, Section } from '@/components/ui/Container';

export default function MentionsLegales() {
  return (
    <Section spacing="base" className="bg-white">
      <Container size="md">
        <h1 className="text-3xl font-heading font-bold mb-8">Mentions Légales</h1>

        <div className="prose prose-green max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Éditeur du Site</h2>
            <p>
              Le site <strong>TEDSAI</strong> (tedsai.cm) est édité par la société <strong>TEDSAI AI VENTURE SARL</strong>.<br />
              Siège Social : Yaoundé, Cameroun<br />
              RC/NIU : [Numéro RC/NIU à insérer]<br />
              Email de contact : contact@tedsai.cm<br />
              Téléphone : +237 6XX XX XX XX
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Directeur de la Publication</h2>
            <p>
              M. [Nom du Directeur], en qualité de [Fonction, ex: CEO].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc.<br />
              Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA<br />
              Site web : https://vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Propriété Intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation camerounaise et internationale sur le droit d'auteur et la propriété intellectuelle.
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
