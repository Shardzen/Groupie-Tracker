import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Music, Mic2, Disc, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { mockArtists } from '../data/mockData';

export default function ArtistsPage() {
  const [activeGenre, setActiveGenre] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const genres = ['Tous', 'Rap FR', 'Pop', 'Metal', 'Electro', 'Rap Cloud'];

  const filteredArtists = useMemo(() => {
    return mockArtists.filter(artist => {
      const matchesGenre = activeGenre === 'Tous' || artist.genre === activeGenre;
      const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [activeGenre, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">

      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>


      <div className="relative pt-32 pb-12 px-6 bg-[#0e0e0e]">
        <div className="container mx-auto">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">
              Le <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Catalogue</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl">
              Explorez l'univers musical. Des légendes du rock aux pépites du rap, tout est là.
            </p>
        </div>
      </div>

      <div className="sticky top-20 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                            activeGenre === genre 
                            ? 'bg-white text-black' 
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Rechercher un artiste..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 pb-32">
        
        {filteredArtists.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
                Aucun artiste ne correspond à votre recherche.
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredArtists.map((artist) => (
                    <Link to={`/artist/${artist.id}`} key={artist.id} className="group block relative">

                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 mb-4">
                            <img 
                                src={artist.image} 
                                alt={artist.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <Zap className="w-6 h-6 text-black fill-black" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-violet-400 transition-colors">
                                {artist.name}
                            </h3>
                            <p className="text-sm text-zinc-500 font-medium flex items-center gap-2">
                                {artist.genre === 'Rap FR' && <Mic2 size={12} />}
                                {artist.genre === 'Pop' && <Music size={12} />}
                                {artist.genre === 'Metal' && <Disc size={12} />}
                                {artist.genre}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>

    </div>
  );
}