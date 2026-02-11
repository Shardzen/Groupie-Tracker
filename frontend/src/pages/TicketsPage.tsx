import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar'; // Assure-toi que le chemin est bon
import { mockArtists } from '../data/mockData';
import { useCartStore } from '../stores/useCartStore';
import { MapPin, Calendar, Ticket as TicketIcon, Search, Music, SlidersHorizontal } from 'lucide-react';
import { AISearch } from '../components/AISearch';

// --- CONFIGURATION DES LIEUX & GENRES ---
// On simule des genres pour tes artistes car mockArtists n'en a peut-être pas
const getGenre = (name: string) => {
  if (['Ninho', 'Damso', 'Booba'].includes(name)) return 'Rap';
  if (['Angèle', 'Stromae'].includes(name)) return 'Pop';
  if (['Gojira'].includes(name)) return 'Metal';
  if (['The Weeknd'].includes(name)) return 'R&B';
  if (['Daft Punk'].includes(name)) return 'Electro';
  return 'Divers';
};

const venues = [
  { city: "Paris", place: "Accor Arena" },
  { city: "Lyon", place: "Groupama Stadium" },
  { city: "Marseille", place: "Vélodrome" },
  { city: "Bruxelles", place: "Forest National" },
  { city: "Bordeaux", place: "Arkéa Arena" },
  { city: "Londres", place: "O2 Arena" },
];

// On génère la donnée complète des tickets
const ticketsData = mockArtists.map((artist, index) => {
  const venue = venues[index % venues.length];
  return {
    id: artist.id,
    artist: artist,
    genre: getGenre(artist.name), // On ajoute le genre
    date: `${10 + index} JUIN 2026`,
    price: 45 + (index * 5),
    place: venue.place,
    city: venue.city
  };
});

// --- COMPOSANT TICKET (Le même design Pro que tu as validé) ---
function TicketCard({ artist, date, price, place, city, id }: any) {
  const [isReserved, setIsReserved] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleReserve = () => {
    if (isReserved) return;
    setIsReserved(true);
    setTimeout(() => {
        addItem({
            id: id.toString(),
            title: artist.name,
            price: parseInt(price),
            image: artist.image,
            quantity: 1,
            type: 'standard'
        });
    }, 800);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-52 md:h-64 group mb-8 perspective-1000 animate-fade-in-up">
      {/* TAMPON */}
      {isReserved && (
        <div className="absolute z-50 pointer-events-none animate-stamp-precision" style={{ top: '35%', left: '55%' }}>
             <div className="relative w-12 h-24 mx-auto -mt-24">
                <div className="w-16 h-16 bg-zinc-800 rounded-full shadow-xl absolute -top-8 -left-2 z-10 border-b-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700"></div>
                </div>
                <div className="w-6 h-20 bg-gradient-to-r from-zinc-700 to-zinc-900 mx-auto rounded-b-xl shadow-lg"></div>
             </div>
             <div className="w-44 h-14 bg-[#222] rounded-sm shadow-2xl flex items-center justify-center border-b-[4px] border-zinc-500 relative z-0 transform -rotate-[10deg]">
                 <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">OFFICIAL TICKET</span>
             </div>
        </div>
      )}

      {/* CORPS GAUCHE */}
      <div className="relative h-full w-full md:w-[72%] bg-[#121212] rounded-3xl md:rounded-r-none md:rounded-l-3xl flex overflow-hidden z-10 clip-ticket-left shadow-lg border border-white/5">
            <div className="absolute inset-0">
                <img src={artist.image} alt="bg" className="w-full h-full object-cover opacity-20 grayscale mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/95 to-transparent"></div>
            </div>
            <div className="relative z-20 h-full w-48 hidden md:block">
                 <img src={artist.image} alt={artist.name} className="h-full w-full object-cover opacity-90 mask-image-gradient grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="relative z-20 flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-zinc-500 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Concert Exclusif
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 truncate">
                    {artist.name}
                </h2>
                <div className="space-y-1 text-zinc-400 mb-4">
                    <p className="font-medium text-sm flex items-center gap-2 uppercase tracking-wide">
                        <Calendar size={16} className="text-violet-500" /> 
                        <span className="text-white">{date}</span> • 20H30
                    </p>
                    <p className="font-medium text-sm flex items-center gap-2 uppercase tracking-wide">
                        <MapPin size={16} className="text-violet-500" /> 
                        {place}, <span className="text-white">{city}</span>
                    </p>
                </div>
                <div className={`absolute right-12 bottom-10 z-30 transform -rotate-[10deg] transition-all duration-200 ${isReserved ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} style={{ transitionDelay: '0.4s' }}>
                    <div className="border-[3px] border-violet-600 px-6 py-1 rounded-sm bg-violet-900/10 backdrop-blur-[1px]">
                        <span className="font-black text-2xl md:text-3xl uppercase tracking-widest text-violet-500">
                          RÉSERVÉ
                        </span>
                    </div>
                </div>
            </div>
            <div className="absolute right-0 top-4 bottom-4 w-[1px] border-r-2 border-dashed border-zinc-800 hidden md:block"></div>
      </div>

      {/* SOUCHE DROITE */}
      <div 
        className={`absolute right-0 top-0 bottom-0 w-[28%] bg-zinc-800 rounded-r-3xl hidden md:flex flex-col items-center justify-center z-20 clip-ticket-right shadow-lg transition-all duration-1000 ease-out origin-left delay-300 border-l border-black/20
        ${isReserved ? 'translate-x-[150%] rotate-[25deg] opacity-0 pointer-events-none' : 'hover:bg-zinc-750 cursor-pointer'}`}
      >
            <div className="text-center relative z-10 px-4 w-full transition-opacity duration-300" style={{ opacity: isReserved ? 0 : 1 }}>
                <div className="mb-4">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/40">Tarif Unique</span>
                    <span className="block text-4xl md:text-5xl font-black text-white tracking-tight">{price}€</span>
                </div>
                <button 
                    onClick={handleReserve}
                    className="w-full bg-white text-black px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    Réserver <TicketIcon size={14} />
                </button>
            </div>
      </div>
      {/* Mobile */}
      <div className="md:hidden mt-4">
        <button onClick={handleReserve} disabled={isReserved} className="w-full bg-white text-black px-4 py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
            {isReserved ? 'Validé' : `Réserver pour ${price}€`} <TicketIcon size={18} />
        </button>
      </div>
    </div>
  );
}

// --- PAGE PRINCIPALE ---
export default function TicketsPage() {
  // STATES POUR LA RECHERCHE
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('Tous');
  const [cityFilter, setCityFilter] = useState('Toutes');
  const [searchMode, setSearchMode] = useState<'simple' | 'ai'>('simple'); // State for search mode

  // Listes uniques pour les filtres
  const uniqueGenres = ['Tous', ...new Set(ticketsData.map(t => t.genre))];
  const uniqueCities = ['Toutes', ...new Set(ticketsData.map(t => t.city))];

  // FILTRAGE
  const filteredTickets = useMemo(() => {
    return ticketsData.filter(ticket => {
      // Recherche Texte (Artiste, Lieu, Ville)
      const matchesSearch = 
        ticket.artist.name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.place.toLowerCase().includes(search.toLowerCase()) ||
        ticket.city.toLowerCase().includes(search.toLowerCase());

      // Filtre Genre
      const matchesGenre = genreFilter === 'Tous' || ticket.genre === genreFilter;

      // Filtre Ville
      const matchesCity = cityFilter === 'Toutes' || ticket.city === cityFilter;

      return matchesSearch && matchesGenre && matchesCity;
    });
  }, [search, genreFilter, cityFilter]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-32 pb-20 relative overflow-x-hidden">
      
      <style>{`
        .clip-ticket-left { clip-path: polygon(0% 0%, 100% 0%, 100% 15%, 98% 18%, 100% 21%, 100% 79%, 98% 82%, 100% 85%, 100% 100%, 0% 100%); }
        .clip-ticket-right { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 85%, 2% 82%, 0% 79%, 0% 21%, 2% 18%, 0% 15%); }
        .mask-image-gradient { mask-image: linear-gradient(to right, black 80%, transparent 100%); }
        .perspective-1000 { perspective: 1000px; }
        @keyframes stamp-precision {
          0% { transform: translate(120%, -400px) rotate(30deg) scale(1.2); opacity: 0; }
          35% { transform: translate(0, -40px) rotate(-10deg) scale(1.05); opacity: 1; }
          40% { transform: translate(0, 0) rotate(-10deg) scale(1); }
          50% { transform: translate(0, -5px) rotate(-10deg) scale(0.98); }
          100% { transform: translate(-200%, -200px) rotate(-60deg) scale(0.8); opacity: 0; }
        }
        .animate-stamp-precision { animation: stamp-precision 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>

      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
              <TicketIcon size={14} className="text-zinc-400" />
              <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Billetterie Officielle</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white leading-none">
             Vivez L'Exceptionnel
           </h1>
           <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light mb-12">
             Trouvez votre prochain concert parmi notre sélection exclusive.
           </p>

           {/* --- Search Mode Toggle --- */}
           <div className="flex justify-center mb-4">
             <div className="bg-[#18181b] border border-white/10 rounded-lg p-1 flex space-x-1">
               <button
                 onClick={() => setSearchMode('simple')}
                 className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                   searchMode === 'simple' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'
                 }`}
               >
                 Simple Search
               </button>
               <button
                 onClick={() => setSearchMode('ai')}
                 className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                   searchMode === 'ai' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:bg-zinc-700'
                 }`}
               >
                 ✨ AI Search
               </button>
             </div>
           </div>

           {/* --- BARRE DE RECHERCHE & FILTRES (Simple Search) --- */}
           {searchMode === 'simple' && (
             <div className="max-w-4xl mx-auto bg-[#18181b] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-2xl">
              
              {/* Input Recherche */}
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                 <input 
                    type="text" 
                    placeholder="Artiste, salle ou ville..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                 />
              </div>

              {/* Filtres Dropdowns */}
              <div className="flex gap-4">
                 <div className="relative group min-w-[140px]">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <select 
                       value={genreFilter}
                       onChange={(e) => setGenreFilter(e.target.value)}
                       className="w-full appearance-none bg-[#0e0e0e] border border-white/5 rounded-xl py-3 pl-10 pr-8 text-sm font-bold text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                       {uniqueGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                 </div>

                 <div className="relative group min-w-[140px]">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <select 
                       value={cityFilter}
                       onChange={(e) => setCityFilter(e.target.value)}
                       className="w-full appearance-none bg-[#0e0e0e] border border-white/5 rounded-xl py-3 pl-10 pr-8 text-sm font-bold text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                       {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                 </div>
              </div>
            </div>
           )}

           {/* --- AI SEARCH --- */}
           {searchMode === 'ai' && (
             <div className="max-w-4xl mx-auto">
               <AISearch />
             </div>
           )}
        </div>

        {/* LISTE DES TICKETS (Only for simple search) */}
        {searchMode === 'simple' && (
          <div className="pb-32 max-w-5xl mx-auto">
             {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, idx) => (
                    <div key={ticket.id} style={{ animationDelay: `${idx * 100}ms` }}>
                        <TicketCard {...ticket} />
                    </div>
                ))
             ) : (
                // --- ETAT VIDE (Aucun résultat) ---
                <div className="text-center py-20 animate-fade-in-up">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Search size={40} className="text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Aucun ticket trouvé</h3>
                    <p className="text-zinc-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    <button 
                      onClick={() => { setSearch(''); setGenreFilter('Tous'); setCityFilter('Toutes'); }}
                      className="mt-6 text-violet-400 hover:text-violet-300 font-bold underline underline-offset-4"
                    >
                      Réinitialiser les filtres
                    </button>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}