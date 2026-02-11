import { Card } from '@/components/ui/card';

export default function CGU() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation (CGU)</h1>
      
      <Card className="p-6 space-y-6">
        <section>
          <p className="text-muted-foreground mb-4">
            <strong>Date d'entrée en vigueur :</strong> 11 février 2025  
            <br />
            <strong>Version :</strong> 2.0
          </p>
          <p className="text-muted-foreground">
            Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;) régissent l'utilisation 
            du site internet <strong>groupietracker.fr</strong> et de l'application mobile associée 
            (ci-après "le Service") édités par <strong>Groupie Tracker SAS</strong>.
          </p>
          <p className="text-muted-foreground mt-4">
            En accédant au Service, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez 
            pas ces conditions, veuillez ne pas utiliser le Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 1 - Définitions</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>"Service"</strong> : Site web groupietracker.fr et application mobile Android</li>
            <li><strong>"Utilisateur"</strong> : Toute personne accédant au Service</li>
            <li><strong>"Compte"</strong> : Espace personnel créé après inscription</li>
            <li><strong>"Billet"</strong> : Titre d'accès à un concert vendu via le Service</li>
            <li><strong>"Réservation"</strong> : Commande d'un ou plusieurs billets</li>
            <li><strong>"Éditeur"</strong> : Groupie Tracker SAS, RCS Paris B 123 456 789</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 2 - Accès au Service</h2>
          <p className="text-muted-foreground">
            Le Service est accessible gratuitement à toute personne disposant d'un accès internet. 
            Tous les coûts afférents à l'accès au Service (matériel, logiciel, connexion internet) 
            sont à la charge exclusive de l'Utilisateur.
          </p>
          <p className="text-muted-foreground mt-4">
            L'Éditeur se réserve le droit de suspendre, d'interrompre ou de limiter l'accès au Service, 
            notamment pour des raisons de maintenance, sans préavis ni indemnité.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 3 - Inscription et Compte Utilisateur</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Création de compte</h3>
          <p className="text-muted-foreground">
            Pour réserver des billets, l'Utilisateur doit créer un compte en fournissant :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Une adresse email valide</li>
            <li>Un mot de passe (minimum 8 caractères)</li>
            <li>Un nom et prénom</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Alternativement, l'Utilisateur peut s'inscrire via <strong>Google OAuth</strong>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Vérification d'email</h3>
          <p className="text-muted-foreground">
            Une vérification d'email peut être requise pour lutter contre les bots. 
            L'Utilisateur recevra un lien de confirmation à cliquer.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3. Responsabilité du compte</h3>
          <p className="text-muted-foreground">
            L'Utilisateur est responsable de la confidentialité de ses identifiants. En cas de 
            compromission (vol, phishing), il doit immédiatement contacter l'Éditeur à 
            <strong> contact@groupietracker.fr</strong>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.4. Suppression de compte</h3>
          <p className="text-muted-foreground">
            L'Utilisateur peut supprimer son compte à tout moment depuis son profil. 
            Cette action est <strong>irréversible</strong> (sauf réservations en cours).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 4 - Réservation de Billets</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Processus de réservation</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
            <li>L'Utilisateur sélectionne un concert</li>
            <li>Il choisit le type de billet (Standard ou VIP) et la quantité</li>
            <li>Il procède au paiement sécurisé via <strong>Stripe</strong></li>
            <li>Il reçoit une confirmation par email avec un QR code</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Disponibilité des billets</h3>
          <p className="text-muted-foreground">
            Les billets sont vendus dans la limite des places disponibles. Une réservation non payée 
            expire après <strong>15 minutes</strong> et les places sont remises en vente.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Prix</h3>
          <p className="text-muted-foreground">
            Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). 
            L'Éditeur se réserve le droit de modifier les prix à tout moment, mais les réservations 
            confirmées ne sont pas affectées.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4. Paiement</h3>
          <p className="text-muted-foreground">
            Les paiements sont traités par <strong>Stripe</strong> (certifié PCI-DSS). 
            Moyens acceptés : Carte bancaire (Visa, Mastercard, Amex).
          </p>
          <p className="text-muted-foreground mt-2">
            Aucune donnée bancaire n'est stockée sur nos serveurs.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.5. Confirmation</h3>
          <p className="text-muted-foreground">
            Après paiement réussi, l'Utilisateur reçoit :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Un email de confirmation</li>
            <li>Un billet PDF avec QR code</li>
            <li>Un historique dans son compte</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 5 - Droit de Rétractation (Code de la Consommation)</h2>
          <p className="text-muted-foreground">
            Conformément à l'<strong>article L221-28 du Code de la consommation</strong>, 
            le droit de rétractation de 14 jours <strong>ne s'applique pas</strong> aux prestations 
            de services de loisirs à date ou période déterminée (concerts).
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Exception :</strong> Si le concert est annulé par l'organisateur, 
            l'Utilisateur sera remboursé intégralement (voir Article 6).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 6 - Annulation et Remboursement</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6.1. Annulation par l'Utilisateur</h3>
          <p className="text-muted-foreground">
            Les billets ne sont <strong>ni remboursables, ni échangeables</strong>, 
            sauf cas de force majeure (maladie grave justifiée par certificat médical).
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2. Annulation par l'Organisateur</h3>
          <p className="text-muted-foreground">
            En cas d'annulation du concert, l'Utilisateur sera remboursé à 100% dans un délai de 
            <strong> 14 jours ouvrés</strong> via le même moyen de paiement.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.3. Report de date</h3>
          <p className="text-muted-foreground">
            Si le concert est reporté, les billets restent valables pour la nouvelle date. 
            Si l'Utilisateur ne peut pas assister, il peut demander un remboursement dans les 
            <strong> 7 jours</strong> suivant l'annonce.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 7 - Utilisation du Service de Recherche IA</h2>
          <p className="text-muted-foreground">
            Le Service propose une recherche assistée par IA (OpenAI GPT-4). 
            Les requêtes sont anonymisées et ne contiennent <strong>aucune donnée personnelle</strong>.
          </p>
          <p className="text-muted-foreground mt-4">
            L'Utilisateur reconnaît que les résultats de l'IA sont générés automatiquement et 
            peuvent contenir des erreurs. L'Éditeur ne garantit pas l'exactitude des recommandations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 8 - Propriété Intellectuelle</h2>
          <p className="text-muted-foreground">
            L'ensemble du contenu du Service (code, design, logos, textes, images, vidéos) est 
            protégé par le droit d'auteur et appartient à l'Éditeur ou à ses partenaires 
            (Deezer, artistes).
          </p>
          <p className="text-muted-foreground mt-4">
            Toute reproduction, distribution, modification ou utilisation commerciale non autorisée 
            est strictement interdite et passible de poursuites judiciaires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 9 - Obligations de l'Utilisateur</h2>
          <p className="text-muted-foreground mb-4">
            L'Utilisateur s'engage à :
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Fournir des informations exactes et à jour</li>
            <li>Ne pas usurper l'identité d'un tiers</li>
            <li>Ne pas utiliser de bots ou scripts automatisés</li>
            <li>Ne pas tenter d'accéder à des zones protégées du Service</li>
            <li>Ne pas diffuser de contenu illégal, offensant ou malveillant</li>
            <li>Respecter les droits de propriété intellectuelle</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            En cas de violation, l'Éditeur se réserve le droit de <strong>suspendre ou supprimer 
            le compte</strong> sans préavis ni remboursement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 10 - Responsabilité</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">10.1. Limitation de responsabilité</h3>
          <p className="text-muted-foreground">
            L'Éditeur met tout en œuvre pour assurer la disponibilité du Service, mais ne garantit pas :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Une disponibilité 24/7 (maintenance possible)</li>
            <li>L'absence d'erreurs ou de bugs</li>
            <li>La compatibilité avec tous les navigateurs/appareils</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">10.2. Exclusion de garantie</h3>
          <p className="text-muted-foreground">
            L'Éditeur ne saurait être tenu responsable :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Des dommages indirects (perte de données, manque à gagner)</li>
            <li>Des contenus diffusés par des tiers (Deezer, OpenAI)</li>
            <li>De l'annulation d'un concert par l'organisateur</li>
            <li>De la perte ou du vol de billets papier/PDF</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">10.3. Force majeure</h3>
          <p className="text-muted-foreground">
            L'Éditeur ne peut être tenu responsable en cas de force majeure (catastrophe naturelle, 
            cyberattaque, grève, pandémie, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 11 - Données Personnelles</h2>
          <p className="text-muted-foreground">
            Le traitement des données personnelles est régi par notre{' '}
            <a href="/politique-confidentialite" className="text-primary underline">
              Politique de Confidentialité
            </a>.
          </p>
          <p className="text-muted-foreground mt-4">
            L'Utilisateur dispose d'un droit d'accès, de rectification, d'effacement et de portabilité 
            de ses données (RGPD). Pour exercer ces droits : <strong>dpo@groupietracker.fr</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 12 - Cookies</h2>
          <p className="text-muted-foreground">
            Le Service utilise des cookies pour améliorer l'expérience utilisateur. 
            Types de cookies :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li><strong>Essentiels :</strong> Authentification, panier</li>
            <li><strong>Analytics :</strong> Sentry (suivi d'erreurs)</li>
            <li><strong>Préférences :</strong> Thème sombre/clair</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            L'Utilisateur peut désactiver les cookies dans son navigateur, mais certaines 
            fonctionnalités peuvent ne plus fonctionner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 13 - Modifications des CGU</h2>
          <p className="text-muted-foreground">
            L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. 
            Les modifications prennent effet dès leur publication sur le Site.
          </p>
          <p className="text-muted-foreground mt-4">
            En cas de modification substantielle, l'Utilisateur sera notifié par email 
            <strong> 30 jours avant</strong> la prise d'effet.
          </p>
          <p className="text-muted-foreground mt-4">
            La poursuite de l'utilisation du Service après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 14 - Médiation et Litiges</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">14.1. Médiation de la consommation</h3>
          <p className="text-muted-foreground">
            Conformément à l'article L.612-1 du Code de la consommation, l'Utilisateur peut 
            recourir gratuitement à un médiateur :
          </p>
          <div className="mt-4 text-muted-foreground">
            <p><strong>Association des Médiateurs Européens (AME)</strong></p>
            <p>197 Boulevard Saint-Germain, 75007 Paris</p>
            <p>contact@mediationconso-ame.com</p>
            <p>
              Plateforme en ligne :{' '}
              <a 
                href="https://ec.europa.eu/consumers/odr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">14.2. Loi applicable et juridiction</h3>
          <p className="text-muted-foreground">
            Les présentes CGU sont soumises au <strong>droit français</strong>.
          </p>
          <p className="text-muted-foreground mt-4">
            En cas de litige non résolu par médiation, compétence exclusive est attribuée aux 
            tribunaux de <strong>Paris</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Article 15 - Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question concernant ces CGU :
          </p>
          <div className="mt-4 text-muted-foreground">
            <p>📧 Email : <a href="mailto:contact@groupietracker.fr" className="text-primary underline">contact@groupietracker.fr</a></p>
            <p>📞 Téléphone : +33 1 23 45 67 89</p>
            <p>📍 Adresse : 42 Avenue de la Musique, 75001 Paris, France</p>
            <p>
              🌐 Site web :{' '}
              <a 
                href="https://groupietracker.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://groupietracker.fr
              </a>
            </p>
          </div>
        </section>

        <footer className="mt-8 pt-6 border-t text-sm text-muted-foreground">
          <p><strong>Date de dernière mise à jour :</strong> 11 février 2025</p>
          <p><strong>Version :</strong> 2.0</p>
          <p className="mt-4">
            En utilisant le Service, vous déclarez avoir lu, compris et accepté les présentes 
            Conditions Générales d'Utilisation.
          </p>
        </footer>
      </Card>
    </div>
  );
}
