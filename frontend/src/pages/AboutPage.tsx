import Navbar from '../components/Navbar';
import { Heart, Users, Zap, Shield, Sparkles, Star, Music, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-0 left-0 opacity-10"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 top-1/3 right-0 opacity-10 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 bottom-0 left-1/2 opacity-10 animation-delay-4000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 fade-in-artistic">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-8 border border-violet-500/30">
              <Star className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-sm font-bold text-violet-300">Notre Vision</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
              <span className="text-artistic-gradient">À propos</span>
              <br />
              <span className="text-white">de Groupie</span>
            </h1>
            <p className="text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              La passion de la musique, sublimée par l'art et la technologie
            </p>
          </div>

          {/* Story Section */}
          <div className="card-artistic p-10 md:p-14 mb-12 fade-in-artistic animation-delay-200">
            <div className="flex items-start gap-6 mb-8">
              <div className="p-4 bg-gradient-to-br from-fuchsia-600 to-orange-600 rounded-3xl shadow-glow-magenta">
                <Heart className="text-white w-10 h-10" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-black mb-3 text-artistic-gradient">
                  Notre Histoire
                </h2>
                <p className="text-zinc-400">Depuis 2024</p>
              </div>
            </div>
            <div className="space-y-6 text-zinc-300 leading-relaxed text-lg">
              <p>
                <span className="text-white font-bold">YNOT</span> est né d'une conviction simple : 
                <span className="text-artistic-gradient font-bold"> la culture doit être accessible à tous</span>. 
                Fondée par une équipe de passionnés de musique et d'innovation, notre plateforme révolutionne 
                l'accès aux concerts et festivals à travers le monde.
              </p>
              <p>
               Pourquoi YNOT ? Parce que nous croyons que chaque mélomane est un groupie dans l'âme, animé par cette envie de se dire "Why Not?" : pourquoi ne pas suivre sa passion sans limites et vivre la musique à 100 % ? <span className="text-white font-semibold">passion dévorante pour la musique live</span>. 
                Nous avons transformé cette passion en une expérience digitale artistique et immersive.
              </p>
              <p>
                Nous croyons que chaque amateur de musique mérite de vivre des expériences inoubliables, 
                que ce soit dans la fosse d'un petit club intimiste ou dans une loge VIP d'un festival international. 
                Notre mission ? <span className="text-white font-semibold">Démocratiser l'accès à la musique live</span> tout 
                en proposant des expériences premium pour ceux qui cherchent l'exception.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="card-artistic p-8 group hover:shadow-glow-violet fade-in-artistic animation-delay-200">
              <div className="p-4 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border-2 border-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-violet-400 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">Pour les Fans</h3>
              <p className="text-zinc-300 leading-relaxed">
                Découvrez de nouveaux artistes, réservez vos billets en quelques clics, 
                et vivez des expériences musicales inoubliables. Notre sélection exclusive 
                vous garantit de ne jamais rater les événements qui comptent.
              </p>
            </div>

            <div className="card-artistic p-8 group hover:shadow-glow-magenta fade-in-artistic animation-delay-200">
              <div className="p-4 bg-gradient-to-br from-fuchsia-600/30 to-orange-600/30 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border-2 border-fuchsia-500/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-fuchsia-400 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">Pour les Artistes</h3>
              <p className="text-zinc-300 leading-relaxed">
                Une visibilité accrue auprès d'une communauté engagée de mélomanes passionnés. 
                Nos outils de promotion vous permettent de toucher votre public cible 
                et de créer une connexion authentique avec vos fans.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="card-artistic p-10 md:p-14 mb-12 fade-in-artistic animation-delay-200">
            <div className="flex items-start gap-6 mb-10">
              <div className="p-4 bg-gradient-to-br from-violet-600 to-orange-600 rounded-3xl shadow-artistic-multi">
                <Shield className="text-white w-10 h-10" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-black mb-3 text-artistic-gradient">
                  Nos Valeurs
                </h2>
                <p className="text-zinc-400">Ce qui nous guide au quotidien</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/30 group-hover:bg-violet-600/30 transition-colors">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Accessibilité</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Des billets pour tous les budgets, sans compromis sur la qualité de l'expérience musicale.
                </p>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-fuchsia-600/20 rounded-xl border border-fuchsia-500/30 group-hover:bg-fuchsia-600/30 transition-colors">
                    <Star className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Transparence</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Pas de frais cachés, pas de surprises. Ce que vous voyez est exactement ce que vous payez.
                </p>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-600/20 rounded-xl border border-orange-500/30 group-hover:bg-orange-600/30 transition-colors">
                    <Rocket className="w-5 h-5 text-orange-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Innovation</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Une technologie de pointe pour une expérience utilisateur fluide, artistique et moderne.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card-artistic p-10 md:p-14 text-center relative overflow-hidden fade-in-artistic animation-delay-200">
            <div className="blob-artistic w-64 h-64 bg-violet-500 top-0 right-0 opacity-20"></div>
            <div className="blob-artistic w-48 h-48 bg-fuchsia-500 bottom-0 left-0 opacity-20 animation-delay-2000"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl mb-6 shadow-glow-violet">
                <Music className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-display font-black mb-4 text-white">
                Rejoignez l'Aventure
              </h2>
              <p className="text-zinc-300 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
                Des milliers de fans nous font déjà confiance pour découvrir et vivre la musique autrement. 
                Et vous ?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/tickets" className="btn-artistic-primary group">
                  <Sparkles className="inline-block w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Découvrir les événements
                </a>
                <a href="/login" className="btn-artistic-outline">
                  <Star className="inline-block w-5 h-5 mr-2" />
                  Créer un compte
                </a>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-16 text-center text-zinc-500 text-sm space-y-2 fade-in-artistic animation-delay-200">
            <p className="flex items-center justify-center gap-2">
              Une plateforme développée avec{' '}
              <Heart className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400 animate-pulse" />
              {' '}et{' '}
              <Sparkles className="w-4 h-4 text-violet-400" />
              {' '}pour la musique
            </p>
            <p>© 2026 Groupie Tracker - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  );
}
