import { Heart, Users, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              À propos de YNOT
            </h1>
            <p className="text-xl text-gray-300">
              La passion de la musique, accessible à tous
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Heart className="text-pink-500" size={32} />
              Notre Histoire
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p>
                YNOT est née d'une conviction simple : <strong className="text-white">la culture doit être accessible à tous</strong>. 
                Fondée par une équipe de passionnés de musique en 2024, notre plateforme révolutionne 
                l'accès aux concerts et festivals en France et en Europe.
              </p>
              <p>
                Pourquoi "YNOT" ? Parce que trop souvent, on entend "pourquoi pas ?" quand il s'agit 
                d'assister à un concert. Distance, prix, complexité de réservation... Nous avons décidé 
                de transformer ce "pourquoi pas" en un <strong className="text-white">"Y NOT !" enthousiaste</strong>.
              </p>
              <p>
                Nous croyons que chaque mélomane mérite de vivre des expériences inoubliables, que ce soit 
                dans la fosse d'un petit club ou dans une loge VIP d'un festival international. 
                Notre mission est de démocratiser l'accès à la musique live tout en proposant des 
                expériences premium pour ceux qui le souhaitent.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Users className="text-purple-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Pour les Fans</h3>
              <p className="text-gray-300">
                Découvrez de nouveaux artistes, réservez vos billets en quelques clics, 
                et vivez des expériences musicales inoubliables. Notre sélection mensuelle 
                vous garantit de ne jamais rater les événements qui comptent.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
              <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="text-blue-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Pour les Artistes</h3>
              <p className="text-gray-300">
                Une visibilité accrue auprès d'une communauté engagée de mélomanes. 
                Nos outils de promotion vous permettent de toucher votre public cible 
                et de remplir vos salles à chaque concert.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Shield className="text-green-500" size={32} />
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-purple-400">Accessibilité</h4>
                <p className="text-gray-300 text-sm">
                  Des billets pour tous les budgets, sans compromis sur la qualité de l'expérience.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-pink-400">Transparence</h4>
                <p className="text-gray-300 text-sm">
                  Pas de frais cachés, pas de surprises. Ce que vous voyez est ce que vous payez.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-blue-400">Innovation</h4>
                <p className="text-gray-300 text-sm">
                  Une technologie de pointe pour une expérience utilisateur fluide et moderne.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/50 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez l'Aventure</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Des milliers de fans nous font déjà confiance pour découvrir et vivre la musique autrement.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="/tickets"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl"
              >
                Découvrir les événements
              </a>
              <a
                href="/login"
                className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all border border-white/30"
              >
                Créer un compte
              </a>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>Une plateforme développée avec ❤️ en France</p>
            <p className="mt-2">© 2026 YNOT - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  )
}
