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
  Filter,
  Star,
  Zap
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

    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType === 'recent') {
      filtered = filtered.sort((a, b) => b.creationDate - a.creationDate);
    } else if (filterType === 'popular') {
      filtered = filtered.sort((a, b) => b.members.length - a.members.length);
    }

    setFilteredArtists(filtered);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-1/4 left-0 opacity-10"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 top-1/2 right-0 opacity-10 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 bottom-0 left-1/2 opacity-10 animation-delay-4000"></div>
      </div>

      <Navbar />
      <Hero />
      
      {/* Artists Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        {/* Section Header with artistic design */}
        <div className="text-center mb-16 fade-in-artistic">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-8 border border-violet-500/30">
            <Star className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-bold text-violet-300">Collection Exclusive</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
            <span className="text-artistic-gradient">Artistes</span>
            <br />
            <span className="text-white">d'Exception</span>
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Explorez une sélection unique d'artistes internationaux et vivez des expériences musicales inoubliables
          </p>
        </div>

        {/* Search and Filters with artistic styling */}
        {!loading && !error && artists.length > 0 && (
          <div className="mb-16 fade-in-artistic animation-delay-200">
            <div className="glass-artistic rounded-3xl p-6 max-w-5xl mx-auto shadow-artistic-multi border-2 border-white/10">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Zap className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Rechercher votre prochaine découverte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-artistic w-full pl-14"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'all'
                        ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                        : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Tous</span>
                  </button>
                  <button
                    onClick={() => setFilterType('recent')}
                    className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'recent'
                        ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                        : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Récents</span>
                  </button>
                  <button
                    onClick={() => setFilterType('popular')}
                    className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                      filterType === 'popular'
                        ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                        : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ArtistCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State - Connection Issue */}
        {error && error === 'impossible_connexion' && (
          <div className="max-w-2xl mx-auto fade-in-artistic">
            <div className="relative overflow-hidden glass-artistic rounded-3xl p-12 shadow-artistic-multi border-2 border-white/10">
              <div className="blob-artistic w-64 h-64 bg-violet-500 top-0 right-0 opacity-20"></div>
              <div className="blob-artistic w-48 h-48 bg-fuchsia-500 bottom-0 left-0 opacity-20 animation-delay-2000"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl animate-glow"></div>
                    <div className="relative p-6 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl border-2 border-violet-500/30">
                      <Server className="w-16 h-16 text-violet-400" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-display font-black">
                  <span className="text-artistic-gradient">Service temporairement indisponible</span>
                </h3>
                
                <div className="space-y-4">
                  <p className="text-zinc-300 text-lg leading-relaxed">
                    Impossible de se connecter au serveur backend.
                  </p>
                  <p className="text-sm text-zinc-500 font-mono glass-artistic px-6 py-3 rounded-2xl inline-block border border-white/10">
                    Vérifiez que le serveur tourne sur{' '}
                    <span className="text-violet-400 font-bold">localhost:8080</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <button 
                    onClick={fetchArtists}
                    className="btn-artistic-primary group"
                  >
                    <RefreshCw className="inline-block w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Réessayer
                  </button>
                  
                  <a 
                    href={`${API_BASE_URL}/health`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-artistic-outline"
                  >
                    <Server className="inline-block w-5 h-5 mr-2" />
                    Tester le serveur
                  </a>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-xs text-zinc-500 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>
                      Astuce : Lancez le backend avec{' '}
                      <code className="text-violet-400 font-mono glass-artistic px-3 py-1.5 rounded-lg border border-violet-500/30">
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
          <div className="max-w-md mx-auto glass-artistic rounded-3xl p-10 text-center fade-in-artistic shadow-artistic-multi border-2 border-white/10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-orange-600/20 to-red-600/20 border-2 border-orange-500/30 rounded-3xl flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4 font-display">Erreur de chargement</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={fetchArtists}
              className="btn-artistic-primary group mx-auto"
            >
              <RefreshCw className="inline-block w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Réessayer
            </button>
          </div>
        )}

        {/* Artists Grid - Asymmetric layout for artistic feel */}
        {!loading && !error && filteredArtists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="fade-in-artistic"
                style={{ 
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <ArtistCard 
                  id={String(artist.id)} 
                  name={artist.name} 
                  image={artist.image} 
                  category="Artiste" 
                />
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && artists.length > 0 && filteredArtists.length === 0 && (
          <div className="text-center py-24 fade-in-artistic">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl mb-8 border-2 border-violet-500/30">
              <Music className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-3xl font-display font-black text-white mb-4">Aucun résultat</h3>
            <p className="text-zinc-400 text-lg mb-8">
              Essayez avec d'autres mots-clés ou filtres
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="btn-artistic-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && artists.length === 0 && (
          <div className="text-center py-24 fade-in-artistic">
            <div className="inline-flex items-center justify-center w-24 h-24 glass-artistic rounded-3xl mb-8 border-2 border-white/10">
              <Loader2 className="w-12 h-12 text-zinc-500 animate-spin" />
            </div>
            <p className="text-zinc-500 text-xl font-display">Aucun artiste disponible pour le moment</p>
          </div>
        )}
      </section>

      {/* Footer with artistic styling */}
      <footer className="border-t-2 border-white/5 mt-24 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-glow-violet">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-display font-black text-xl text-artistic-gradient">Groupie Tracker</p>
                <p className="text-zinc-500 text-sm">L'art de la découverte musicale</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
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
