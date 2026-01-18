import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { mockEvents } from '../data/mockData';
import { Calendar, MapPin, Music, Star, Sparkles, Filter, TrendingUp, Clock } from 'lucide-react';

type FilterType = 'all' | 'upcoming' | 'popular' | 'vip';

export default function ConcertsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case 'upcoming':
        return new Date(event.date) > new Date();
      case 'popular':
        return event.vipPrice > 100;
      case 'vip':
        return event.vipPrice > 0;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-0 right-0 opacity-10"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 bottom-1/4 left-0 opacity-10 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 top-1/2 right-1/3 opacity-10 animation-delay-4000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-artistic">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-8 border border-violet-500/30">
            <Music className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-bold text-violet-300">Événements en Direct</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
            <span className="text-artistic-gradient">Concerts</span>
            <br />
            <span className="text-white">& Festivals</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Découvrez les événements musicaux les plus attendus de l'année
          </p>
        </div>

        {/* Filters */}
        <div className="mb-16 fade-in-artistic animation-delay-200">
          <div className="glass-artistic rounded-3xl p-6 max-w-5xl mx-auto shadow-artistic-multi border-2 border-white/10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Music className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un concert, artiste, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-artistic w-full pl-14"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                      : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Tous</span>
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    filter === 'upcoming'
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                      : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">À venir</span>
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    filter === 'popular'
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                      : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Populaires</span>
                </button>
                <button
                  onClick={() => setFilter('vip')}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    filter === 'vip'
                      ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                      : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">VIP</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredEvents.map((event, index) => (
            <Link
              key={event.id}
              to={`/tickets`}
              className="group card-artistic fade-in-artistic hover:z-10"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-artistic">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 backdrop-blur-xl rounded-full border border-white/20 shadow-glow-violet">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  {event.vipPrice > 100 && (
                    <div className="px-3 py-1.5 bg-gradient-to-br from-orange-500/90 to-fuchsia-500/90 backdrop-blur-xl rounded-full border border-white/20 shadow-glow-orange">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        VIP
                      </span>
                    </div>
                  )}
                </div>

                {/* Play icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="p-5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-glow-violet group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-display font-black mb-2 text-white group-hover:text-artistic-gradient transition-colors">
                  {event.name}
                </h3>
                <p className="text-violet-300 font-bold text-lg mb-4">{event.artistName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{event.venue}, {event.city}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">À partir de</p>
                    <p className="text-2xl font-bold text-artistic-gradient">
                      {event.standardPrice.toFixed(2)}€
                    </p>
                  </div>
                  <div className="px-5 py-2.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-xl group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 transition-all duration-300">
                    <span className="text-sm font-bold text-violet-300 group-hover:text-white transition-colors">
                      Réserver
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-24 fade-in-artistic">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl mb-8 border-2 border-violet-500/30">
              <Music className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-3xl font-display font-black text-white mb-4">Aucun concert trouvé</h3>
            <p className="text-zinc-400 text-lg mb-8">
              Essayez avec d'autres filtres ou mots-clés
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="btn-artistic-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-white/5 mt-24 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-zinc-500 text-sm">
              © 2026 Groupie Tracker. Créé avec{' '}
              <span className="text-artistic-gradient">passion</span> pour la musique.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
