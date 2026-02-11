import { Card } from '@/components/ui/card';

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
      
      <Card className="p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Raison sociale :</strong> Groupie Tracker SAS</p>
            <p><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
            <p><strong>Capital social :</strong> 10 000 €</p>
            <p><strong>Siège social :</strong> 42 Avenue de la Musique, 75001 Paris, France</p>
            <p><strong>RCS :</strong> Paris B 123 456 789</p>
            <p><strong>SIRET :</strong> 123 456 789 00010</p>
            <p><strong>APE :</strong> 6201Z (Programmation informatique)</p>
            <p><strong>TVA Intracommunautaire :</strong> FR 12 123456789</p>
            <p><strong>Directeur de publication :</strong> Jean Dupont, Président</p>
            <p><strong>Contact :</strong> contact@groupietracker.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Frontend (CDN) :</strong></p>
            <p>Netlify, Inc.</p>
            <p>2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</p>
            
            <p className="mt-4"><strong>Backend (API) :</strong></p>
            <p>Microsoft Azure - Azure Container Instances (ACI)</p>
            <p>Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, USA</p>
            
            <p className="mt-4"><strong>Base de données :</strong></p>
            <p>Neon Database, Inc.</p>
            <p>548 Market St PMB 49197, San Francisco, CA 94104, USA</p>
            
            <p className="mt-4"><strong>Stockage fichiers (S3) :</strong></p>
            <p>MinIO Object Storage (self-hosted)</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
          <p className="text-muted-foreground">
            L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, bases de données) 
            est la propriété exclusive de Groupie Tracker SAS, sauf mentions contraires.
          </p>
          <p className="text-muted-foreground mt-4">
            Toute reproduction, représentation, modification, publication, adaptation totale ou partielle 
            des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans 
            l'autorisation écrite préalable de Groupie Tracker SAS.
          </p>
          <p className="text-muted-foreground mt-4">
            Les marques, logos, et autres signes distinctifs reproduits sur ce site sont la propriété 
            de leurs titulaires respectifs (Stripe, Deezer, Google, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Responsabilité</h2>
          <p className="text-muted-foreground">
            Groupie Tracker SAS s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations 
            diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou 
            l'exhaustivité des informations mises à disposition.
          </p>
          <p className="text-muted-foreground mt-4">
            En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
          </p>
          <p className="text-muted-foreground mt-4">
            Groupie Tracker SAS ne saurait être tenue responsable des dommages directs ou indirects résultant 
            de l'accès au site ou de l'utilisation du site, y compris l'inaccessibilité, les pertes de données, 
            détériorations, destructions ou virus qui pourraient affecter l'équipement informatique de l'utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Liens hypertextes</h2>
          <p className="text-muted-foreground">
            Le site peut contenir des liens hypertextes vers d'autres sites (Deezer, Stripe, etc.). 
            Groupie Tracker SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité 
            quant à leur contenu.
          </p>
          <p className="text-muted-foreground mt-4">
            La création de liens hypertextes vers le site groupietracker.fr nécessite une autorisation 
            écrite préalable de Groupie Tracker SAS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Données personnelles</h2>
          <p className="text-muted-foreground">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, 
            d'effacement et de portabilité de vos données personnelles.
          </p>
          <p className="text-muted-foreground mt-4">
            Pour plus d'informations, consultez notre{' '}
            <a href="/politique-confidentialite" className="text-primary underline">
              Politique de Confidentialité
            </a>.
          </p>
          <div className="space-y-2 mt-4 text-muted-foreground">
            <p><strong>Responsable de traitement :</strong> Groupie Tracker SAS</p>
            <p><strong>DPO (Délégué à la Protection des Données) :</strong> dpo@groupietracker.fr</p>
            <p>
              <strong>Autorité de contrôle :</strong> CNIL (Commission Nationale de l'Informatique et des Libertés)  
              <br />3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07  
              <br />Tél : 01 53 73 22 22
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p className="text-muted-foreground">
            Ce site utilise des cookies pour améliorer votre expérience de navigation et réaliser 
            des statistiques d'audience. En poursuivant votre navigation, vous acceptez l'utilisation 
            de cookies conformément à notre politique de confidentialité.
          </p>
          <p className="text-muted-foreground mt-4">
            Vous pouvez paramétrer vos préférences cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Médiation</h2>
          <p className="text-muted-foreground">
            Conformément à l'article L.612-1 du Code de la consommation, en cas de litige, 
            vous avez la possibilité de recourir gratuitement à un médiateur de la consommation :
          </p>
          <div className="mt-4 text-muted-foreground">
            <p><strong>Médiateur de la consommation :</strong> Association des Médiateurs Européens (AME)</p>
            <p>197 Boulevard Saint-Germain, 75007 Paris</p>
            <p>contact@mediationconso-ame.com</p>
            <p>
              Plateforme en ligne : 
              <a 
                href="https://ec.europa.eu/consumers/odr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline ml-2"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Loi applicable</h2>
          <p className="text-muted-foreground">
            Les présentes mentions légales sont soumises au droit français. En cas de litige et à défaut 
            de résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Crédits</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Conception & Développement :</strong> Groupie Tracker Team</p>
            <p><strong>Technologies :</strong> React.js, Golang, PostgreSQL, Stripe, Azure, Netlify</p>
            <p><strong>API Musique :</strong> Deezer API</p>
            <p><strong>Paiements :</strong> Stripe Inc.</p>
            <p><strong>Authentification :</strong> Google OAuth 2.0</p>
            <p><strong>IA :</strong> OpenAI GPT-4</p>
            <p><strong>Monitoring :</strong> Sentry.io</p>
          </div>
        </section>

        <footer className="mt-8 pt-6 border-t text-sm text-muted-foreground">
          <p>Dernière mise à jour : 11 février 2025</p>
          <p className="mt-2">
            Pour toute question concernant ces mentions légales, contactez-nous à :{' '}
            <a href="mailto:contact@groupietracker.fr" className="text-primary underline">
              contact@groupietracker.fr
            </a>
          </p>
        </footer>
      </Card>
    </div>
  );
}
