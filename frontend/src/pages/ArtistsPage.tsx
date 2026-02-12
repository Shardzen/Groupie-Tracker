import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { mockArtists } from '../data/mockData';
import { Search, Play, Mic2, Music2, Sparkles, Filter } from 'lucide-react';

const artistGenres: Record<string, string> = {
  "1": "Rap", "2": "Pop", "3": "Metal", "4": "Rap", "5": "Electro",
  "6": "Rap", "7": "Rap", "8": "Rap", "9": "Rap", "10": "Rap",
  "11": "Rap", "12": "Pop", "13": "Pop", "14": "Pop", "15": "Pop",
  "16": "Metal", "17": "Metal", "18": "Metal", "19": "Electro", "20": "Electro",
  "21": "Electro", "22": "Rap", "23": "Rap",
};

const genres = ["Tout", "Rap", "Pop", "R&B", "Electro", "Metal"];

export default function ArtistsPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tout');
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const filteredArtists = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryUrl = searchParams.get('search') || '';
    
    if (queryUrl !== searchTerm && queryUrl !== '') {
        setSearchTerm(queryUrl);
    }

    const queryToUse = queryUrl || searchTerm;

    return mockArtists.filter(artist => {
      const matchesName = artist.name.toLowerCase().includes(queryToUse.toLowerCase());
      const artistGenre = artistGenres[artist.id] || "Divers";
      const matchesGenre = selectedGenre === 'Tout' || artistGenre === selectedGenre;

      return matchesName && matchesGenre;
    });
  }, [location.search, searchTerm, selectedGenre]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-28 px-6 md:px-12 pb-20 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-900/20 via-black to-black -z-10 pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto mb-16 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
                        <Music2 size={20} />
                    </span>
                    <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Catalogue</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                  ARTISTES
                </h1>
            </div>
            <div className="text-right">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    {filteredArtists.length}
                </p>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Talents trouvés</p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            
            <div className="relative w-full lg:w-96 group">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher un artiste..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={20} />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                <Filter size={16} className="text-zinc-500 mr-2 flex-shrink-0" />
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                            selectedGenre === genre
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105'
                            : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
          {filteredArtists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {filteredArtists.map((artist, index) => (
                <Link 
                    key={artist.id} 
                    to={`/artist/${artist.id}`} 
                    className={`group relative block transform transition-all duration-500 hover:-translate-y-2 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                >
                  
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 bg-zinc-900 shadow-2xl border border-white/5 group-hover:border-violet-500/50 transition-colors">
                     <img 
                       src={artist.image} 
                       alt={artist.name} 
                       className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                       loading="lazy"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=400&background=random`;
                       }}
                     />
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     
                     <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                        <div className="bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform">
                            <Play fill="currentColor" size={24} />
                        </div>
                     </div>

                     <div className="absolute top-4 left-4 -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                            {artistGenres[artist.id] || artist.genre}
                        </span>
                     </div>
                  </div>
                  
                  <div className="px-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all truncate">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Mic2 size={12} className="text-zinc-500" />
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                           Vérifié • {artist.genre}
                        </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 rounded-3xl blur-3xl -z-10"></div>
                <div className="bg-white/5 p-6 rounded-full border border-white/10 mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Sparkles className="w-12 h-12 text-zinc-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Aucun résultat trouvé</h3>
                <p className="text-zinc-400 max-w-md mb-8">
                    Aucun artiste ne correspond à "<span className="text-white font-bold">{searchTerm}</span>" dans le genre <span className="text-white font-bold">{selectedGenre}</span>.
                </p>
                <button 
                    onClick={() => { setSearchTerm(''); setSelectedGenre('Tout'); }} 
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-lg"
                >
                    Réinitialiser les filtres
                </button>
            </div>
          )}
      </div>
    </div>
  );
}
