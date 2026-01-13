import { Link } from 'react-router-dom'
import { mockArtists } from '../data/mockData'
import { Calendar, Music, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react'

export default function HomePage() {
  const featuredArtists = mockArtists.slice(0, 9)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section Premium */}
      <section className="relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-pink-900/20 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          {/* Premium Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-xl rounded-full px-6 py-2.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Plateforme Premium
              </span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>
          </div>

          {/* Hero Title */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Vivez la musique
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mt-2">
                autrement
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Découvrez les meilleurs concerts et événements. Réservez vos places VIP en quelques clics.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/tickets"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Explorer les événements
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              to="/about"
              className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none" />
      </section>

      {/* Featured Artists Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-300 text-sm font-bold px-4 py-2 rounded-full border border-purple-500/30">
                <TrendingUp className="w-4 h-4" />
                Actualisé mensuellement
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                À l'affiche sur
              </span>
              {' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                YNOT
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Les meilleurs concerts du moment, sélectionnés pour vous
            </p>
          </div>

          {/* Artists Grid - PREMIUM CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
              >
                {/* Image Container with Gradient Overlay */}
                <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {artist.image ? (
                    <>
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <Music className="w-16 h-16 text-slate-700 group-hover:text-purple-500 transition-colors duration-300" />
                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl group-hover:bg-purple-500/40 transition-all" />
                      </div>
                      <div className="text-3xl font-black text-slate-600 group-hover:text-purple-400 transition-colors">
                        {artist.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" />
                      VIP
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Genre Badge */}
                  <div className="inline-flex">
                    <span className="bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
                      {artist.genre}
                    </span>
                  </div>

                  {/* Artist Name */}
                  <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
                    {artist.name}
                  </h3>

                  {/* Concert Info */}
                  {artist.upcomingDates.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        {artist.upcomingDates.length} concert{artist.upcomingDates.length > 1 ? 's' : ''} disponible{artist.upcomingDates.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-slate-500 ml-6">
                        Prochaine date : {new Date(artist.upcomingDates[0].toString()).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        Dates bientôt annoncées
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    to={`/artists/${artist.id}`}
                    className="group/btn relative w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white font-bold rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🎟️ Voir les billets
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 -z-10" />
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link
              to="/artists"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors group"
            >
              Découvrir tous les artistes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose YNOT Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="relative bg-gradient-to-br from-purple-900/20 via-slate-900/50 to-pink-900/20 backdrop-blur-2xl rounded-3xl p-8 md:p-16 border border-white/5 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            
            <div className="relative space-y-12">
              {/* Section Title */}
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-black">
                  <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Pourquoi choisir
                  </span>
                  {' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    YNOT ?
                  </span>
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  L'expérience premium pour les amateurs de musique live
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="group text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎫</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Billets VIP Exclusifs</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Accédez aux loges, coupe-files et expériences premium
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="group text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Découverte Musicale</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Explorez de nouveaux artistes et genres chaque mois
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="group text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Réservation Rapide</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Processus d'achat simplifié et ultra-sécurisé
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  )
}
