import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ArtistCard from '../components/ArtistCard';
import ArtistCardSkeleton from '../components/ArtistCardSkeleton';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Sparkles, 
  TrendingUp,
  Music,
  Calendar,
  Filter
} from 'lucide-react';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
  locations: string[];
  concertDates: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'popular'>('all');

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    filterArtists();
  }, [artists, searchTerm, filterType]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/artists`);
      
      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }
      
      const data = await response.json();
      setArtists(data);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('impossible_connexion');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
      console.error('Erreur lors du chargement des artistes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterArtists = () => {
    let filtered = [...artists];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filterType === 'recent') {
      filtered = filtered.sort((a, b) => b.creationDate - a.creationDate);
    } else if (filterType === 'popular') {
      filtered = filtered.sort((a, b) => b.members.length - a.members.length);
    }

    setFilteredArtists(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <Navbar />
      <Hero />
      
      {/* Artists Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Découvrez nos artistes</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text text-display">Artistes à l'affiche</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Explorez notre collection exclusive d'artistes internationaux et réservez vos places pour des concerts exceptionnels
          </p>
        </div>

        {/* Search and Filters */}
        {!loading && !error && artists.length > 0 && (
          <div className="mb-12 animate-fadeIn animate-delay-200">
            <div className="glass-effect rounded-2xl p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Music className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un artiste, une ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'all'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Tous</span>
                  </button>
                  <button
                    onClick={() => setFilterType('recent')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'recent'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Récents</span>
                  </button>
                  <button
                    onClick={() => setFilterType('popular')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'popular'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Populaires</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ArtistCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State - Connection Issue */}
        {error && error === 'impossible_connexion' && (
          <div className="max-w-2xl mx-auto animate-fadeInScale">
            <div className="relative overflow-hidden glass-card rounded-3xl p-10 shadow-2xl">
              {/* Animated background gradients */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
              
              <div className="relative z-10 text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative p-5 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl border border-violet-500/30">
                      <Server className="w-12 h-12 text-violet-400" />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-3xl font-black">
                  <span className="gradient-text">Service momentanément indisponible</span>
                </h3>
                
                {/* Description */}
                <div className="space-y-3">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Impossible de se connecter au serveur backend.
                  </p>
                  <p className="text-sm text-slate-500 font-mono bg-slate-900/50 px-4 py-2 rounded-lg inline-block">
                    Vérifiez que le serveur tourne sur{' '}
                    <span className="text-violet-400 font-bold">localhost:8080</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button 
                    onClick={fetchArtists}
                    className="group px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Réessayer
                  </button>
                  
                  <a 
                    href={`${API_BASE_URL}/health`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-violet-500/50 text-slate-300 hover:text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Server className="w-5 h-5" />
                    Tester le serveur
                  </a>
                </div>

                {/* Help Text */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>
                      Astuce : Lancez le backend avec{' '}
                      <code className="text-violet-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                        go run main.go
                      </code>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error State */}
        {error && error !== 'impossible_connexion' && (
          <div className="max-w-md mx-auto glass-card rounded-2xl p-8 text-center animate-fadeInScale">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 mx-auto bg-red-950/50 border border-red-500/30 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-red-400 mb-3">Erreur de chargement</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={fetchArtists}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto hover:scale-105 shadow-lg shadow-red-500/30"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        )}

        {/* Artists Grid - Success State */}
        {!loading && !error && filteredArtists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && artists.length > 0 && filteredArtists.length === 0 && (
          <div className="text-center py-20 animate-fadeInScale">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl mb-6 border border-violet-500/30">
              <Music className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-400 text-lg mb-6">
              Essayez avec d'autres mots-clés ou filtres
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-500/50"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && artists.length === 0 && (
          <div className="text-center py-20 animate-fadeInScale">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl mb-6 border border-slate-600">
              <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
            </div>
            <p className="text-slate-500 text-xl">Aucun artiste disponible pour le moment</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">YNOT Music Events</p>
                <p className="text-slate-500 text-sm">La musique comme vous ne l'avez jamais vécue</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm mb-1">
                © 2026 YNOT - Tous droits réservés
              </p>
              <p className="text-slate-600 text-xs">
                Made with <span className="text-red-500">♥</span> by the YNOT Team
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
