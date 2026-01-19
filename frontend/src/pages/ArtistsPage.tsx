import { Link } from 'react-router-dom';
import { mockArtists } from '../data/mockData';
import { Music, Sparkles, Zap, Star } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function ArtistsPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = ['all', ...new Set(mockArtists.map(a => a.genre))];
  
  const filteredArtists = selectedGenre === 'all' 
    ? mockArtists 
    : mockArtists.filter(a => a.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-0 right-0 opacity-10"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 bottom-0 left-0 opacity-10 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 top-1/2 left-1/2 opacity-10 animation-delay-4000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-artistic">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-artistic rounded-full mb-8 border border-violet-500/30">
            <Star className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-bold text-violet-300">Collection Complète</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 leading-tight">
            <span className="text-artistic-gradient">Tous les</span>
            <br />
            <span className="text-white">Artistes</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Explorez notre sélection complète d'artistes exceptionnels venus du monde entier
          </p>
        </div>

        {/* Genre filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 fade-in-artistic animation-delay-200">
          {genres.map((genre, idx) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-artistic-multi scale-105'
                  : 'glass-artistic text-zinc-400 hover:text-white hover:scale-105 border border-white/10'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {genre === 'all' ? 'Tous les genres' : genre}
            </button>
          ))}
        </div>

        {/* Artists grid with asymmetric design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist, index) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="group relative card-artistic fade-in-artistic hover:z-10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Image container */}
              <div className="aspect-[3/4] overflow-hidden rounded-t-artistic relative">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                {/* Genre badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 backdrop-blur-xl rounded-full border border-white/20 shadow-glow-violet">
                  <span className="text-xs font-bold text-white">{artist.genre}</span>
                </div>

                {/* Play icon on hover */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <div className="p-5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-glow-violet">
                    <Zap className="text-white w-8 h-8" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-display font-bold text-2xl mb-2 leading-tight text-artistic-glow">
                    {artist.name}
                  </h3>
                  {artist.upcomingDates && artist.upcomingDates.length > 0 ? (
                    <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold">
                      <Music className="w-4 h-4" />
                      <span>{artist.upcomingDates.length} concert{artist.upcomingDates.length > 1 ? 's' : ''} à venir</span>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm font-medium">Pas de concert prévu</p>
                  )}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-artistic opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 via-transparent to-transparent"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-32 fade-in-artistic">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl mb-8 border-2 border-violet-500/30">
              <Music className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-3xl font-display font-black text-white mb-4">Aucun artiste trouvé</h3>
            <p className="text-zinc-400 text-lg mb-8">
              Essayez un autre genre musical
            </p>
            <button
              onClick={() => setSelectedGenre('all')}
              className="btn-artistic-primary"
            >
              <Sparkles className="inline-block w-5 h-5 mr-2" />
              Voir tous les artistes
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
