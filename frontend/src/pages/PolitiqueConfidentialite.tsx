import { Card } from '@/components/ui/card';

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
      
      <Card className="p-6 space-y-6">
        <section>
          <p className="text-muted-foreground mb-4">
            <strong>Date d'entrée en vigueur :</strong> 11 février 2025
          </p>
          <p className="text-muted-foreground">
            Groupie Tracker SAS (ci-après "nous", "notre" ou "Groupie Tracker") s'engage à protéger 
            la vie privée de ses utilisateurs. Cette politique de confidentialité décrit comment nous 
            collectons, utilisons, stockons et protégeons vos données personnelles conformément au 
            Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Raison sociale :</strong> Groupie Tracker SAS</p>
            <p><strong>Siège social :</strong> 42 Avenue de la Musique, 75001 Paris, France</p>
            <p><strong>Email :</strong> contact@groupietracker.fr</p>
            <p><strong>DPO :</strong> dpo@groupietracker.fr</p>
            <p><strong>Numéro SIRET :</strong> 123 456 789 00010</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Données fournies directement</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Inscription :</strong> Nom, prénom, adresse email, mot de passe (hashé)</li>
            <li><strong>OAuth Google :</strong> Email, nom, photo de profil, identifiant Google</li>
            <li><strong>Réservations :</strong> Type de billet, quantité, concert sélectionné</li>
            <li><strong>Paiements :</strong> Données traitées par Stripe (voir section 4)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Données collectées automatiquement</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Logs de connexion :</strong> Adresse IP, user-agent, horodatage</li>
            <li><strong>Cookies :</strong> Session, préférences, analytics (Sentry)</li>
            <li><strong>Recherche IA :</strong> Requêtes envoyées à OpenAI (anonymisées)</li>
            <li><strong>Analytics :</strong> Pages visitées, durée de session (anonymisées)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3. Données sensibles</h3>
          <p className="text-muted-foreground">
            Nous ne collectons <strong>aucune donnée sensible</strong> au sens de l'article 9 du RGPD 
            (origine raciale, opinions politiques, données de santé, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Finalités du traitement</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Finalité</th>
                  <th className="text-left py-2 px-4">Base légale (RGPD)</th>
                  <th className="text-left py-2 px-4">Durée de conservation</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 px-4">Création de compte</td>
                  <td className="py-2 px-4">Consentement (Art. 6.1.a)</td>
                  <td className="py-2 px-4">3 ans après dernière activité</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Réservation de billets</td>
                  <td className="py-2 px-4">Exécution du contrat (Art. 6.1.b)</td>
                  <td className="py-2 px-4">10 ans (obligations comptables)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Paiements Stripe</td>
                  <td className="py-2 px-4">Exécution du contrat (Art. 6.1.b)</td>
                  <td className="py-2 px-4">Géré par Stripe (voir 4.1)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Recherche IA (OpenAI)</td>
                  <td className="py-2 px-4">Consentement (Art. 6.1.a)</td>
                  <td className="py-2 px-4">30 jours (logs OpenAI)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Suivi d'erreurs (Sentry)</td>
                  <td className="py-2 px-4">Intérêt légitime (Art. 6.1.f)</td>
                  <td className="py-2 px-4">90 jours</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Envoi d'emails transactionnels</td>
                  <td className="py-2 px-4">Exécution du contrat (Art. 6.1.b)</td>
                  <td className="py-2 px-4">Durée de la relation client</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Prévention de la fraude</td>
                  <td className="py-2 px-4">Intérêt légitime (Art. 6.1.f)</td>
                  <td className="py-2 px-4">6 mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Partage des données avec des tiers</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Stripe (Paiements)</h3>
          <p className="text-muted-foreground">
            Les paiements sont traités par <strong>Stripe, Inc.</strong>, certifié PCI-DSS niveau 1. 
            Nous ne stockons <strong>aucune donnée bancaire</strong> sur nos serveurs. Stripe collecte :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Numéro de carte bancaire (tokenisé)</li>
            <li>Date d'expiration, CVC</li>
            <li>Nom du titulaire</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Consultez la{' '}
            <a 
              href="https://stripe.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              politique de confidentialité Stripe
            </a>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. OpenAI (Recherche IA)</h3>
          <p className="text-muted-foreground">
            Les requêtes de recherche IA sont envoyées à <strong>OpenAI</strong> (GPT-4). 
            Données transmises : texte de la recherche uniquement (aucun email, nom, ou donnée personnelle).
          </p>
          <p className="text-muted-foreground mt-2">
            Consultez la{' '}
            <a 
              href="https://openai.com/policies/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              politique de confidentialité OpenAI
            </a>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Google OAuth</h3>
          <p className="text-muted-foreground">
            Si vous vous connectez via Google, nous recevons : email, nom, photo de profil, ID Google. 
            Nous ne partageons <strong>aucune donnée</strong> avec Google après l'authentification.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4. Sentry (Monitoring d'erreurs)</h3>
          <p className="text-muted-foreground">
            Sentry collecte des logs d'erreurs techniques (stack traces, user-agent, IP anonymisée). 
            Les emails et noms sont exclus des rapports Sentry.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.5. Deezer (Widgets musicaux)</h3>
          <p className="text-muted-foreground">
            Les widgets Deezer sont intégrés via iframe. Deezer peut collecter des cookies. 
            Consultez la{' '}
            <a 
              href="https://www.deezer.com/legal/personal-datas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              politique Deezer
            </a>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.6. Transferts hors UE</h3>
          <p className="text-muted-foreground">
            Nos prestataires (Stripe, OpenAI, Sentry) sont basés aux USA. Les transferts sont 
            encadrés par des clauses contractuelles types (CCT) conformes au RGPD.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Vos droits (RGPD)</h2>
          <p className="text-muted-foreground mb-4">
            Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>
              <strong>Droit d'accès (Art. 15) :</strong> Obtenir une copie de vos données personnelles
            </li>
            <li>
              <strong>Droit de rectification (Art. 16) :</strong> Corriger des données inexactes
            </li>
            <li>
              <strong>Droit à l'effacement (Art. 17) :</strong> Supprimer vos données (sauf obligations légales)
            </li>
            <li>
              <strong>Droit à la limitation (Art. 18) :</strong> Bloquer le traitement temporairement
            </li>
            <li>
              <strong>Droit à la portabilité (Art. 20) :</strong> Recevoir vos données en format CSV/JSON
            </li>
            <li>
              <strong>Droit d'opposition (Art. 21) :</strong> Refuser un traitement spécifique
            </li>
            <li>
              <strong>Droit de retrait du consentement (Art. 7.3) :</strong> Annuler votre accord à tout moment
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            <strong>Comment exercer vos droits :</strong>
          </p>
          <p className="text-muted-foreground">
            Envoyez un email à <strong>dpo@groupietracker.fr</strong> avec :
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
            <li>Votre nom, prénom, email</li>
            <li>Copie de pièce d'identité (pour vérification)</li>
            <li>Nature de votre demande (accès, suppression, etc.)</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            <strong>Délai de réponse :</strong> 1 mois maximum (Art. 12.3 du RGPD)
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
          <p className="text-muted-foreground mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Chiffrement :</strong> HTTPS/TLS 1.3 pour toutes les communications</li>
            <li><strong>Mots de passe :</strong> Hashés avec bcrypt (coût 14)</li>
            <li><strong>Authentification :</strong> JWT avec expiration 24h</li>
            <li><strong>Base de données :</strong> Accès restreint, backups chiffrés</li>
            <li><strong>Monitoring :</strong> Sentry pour détecter les intrusions</li>
            <li><strong>Rate limiting :</strong> Protection contre les attaques brute-force</li>
            <li><strong>CORS :</strong> Origines autorisées uniquement</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            En cas de violation de données (data breach), nous notifierons la CNIL et les utilisateurs 
            concernés dans les <strong>72 heures</strong> (Art. 33 du RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Cookie</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Finalité</th>
                  <th className="text-left py-2 px-4">Durée</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 px-4">auth_token</td>
                  <td className="py-2 px-4">Essentiel</td>
                  <td className="py-2 px-4">Authentification JWT</td>
                  <td className="py-2 px-4">24 heures</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">cart_items</td>
                  <td className="py-2 px-4">Essentiel</td>
                  <td className="py-2 px-4">Panier d'achat</td>
                  <td className="py-2 px-4">Session</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">sentry_session</td>
                  <td className="py-2 px-4">Analytics</td>
                  <td className="py-2 px-4">Suivi d'erreurs</td>
                  <td className="py-2 px-4">Session</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">theme</td>
                  <td className="py-2 px-4">Préférence</td>
                  <td className="py-2 px-4">Mode sombre/clair</td>
                  <td className="py-2 px-4">1 an</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            <strong>Gestion des cookies :</strong> Vous pouvez désactiver les cookies dans les paramètres 
            de votre navigateur. Attention : certaines fonctionnalités du site peuvent ne plus fonctionner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Mineurs</h2>
          <p className="text-muted-foreground">
            Notre service est destiné aux personnes âgées de <strong>16 ans et plus</strong>. 
            Conformément à l'article 8 du RGPD, les mineurs de moins de 16 ans doivent obtenir 
            le consentement de leurs parents ou tuteurs légaux.
          </p>
          <p className="text-muted-foreground mt-4">
            Si vous pensez qu'un mineur a fourni des données sans consentement parental, contactez-nous 
            à <strong>dpo@groupietracker.fr</strong> pour suppression immédiate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Modifications de la politique</h2>
          <p className="text-muted-foreground">
            Nous nous réservons le droit de modifier cette politique à tout moment. En cas de changement 
            substantiel, nous vous notifierons par email 30 jours avant la prise d'effet.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Version actuelle :</strong> 2.0 (11 février 2025)  
            <br />
            <strong>Dernière modification :</strong> 11 février 2025
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Réclamation</h2>
          <p className="text-muted-foreground">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
            auprès de la CNIL :
          </p>
          <div className="mt-4 text-muted-foreground">
            <p><strong>CNIL - Commission Nationale de l'Informatique et des Libertés</strong></p>
            <p>3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</p>
            <p>Tél : 01 53 73 22 22</p>
            <p>
              <a 
                href="https://www.cnil.fr/fr/plaintes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://www.cnil.fr/fr/plaintes
              </a>
            </p>
          </div>
        </section>

        <footer className="mt-8 pt-6 border-t text-sm text-muted-foreground">
          <p>Pour toute question relative à cette politique de confidentialité :</p>
          <p className="mt-2">
            📧 Email : <a href="mailto:dpo@groupietracker.fr" className="text-primary underline">dpo@groupietracker.fr</a>
          </p>
          <p>📞 Téléphone : +33 1 23 45 67 89</p>
        </footer>
      </Card>
    </div>
  );
}
